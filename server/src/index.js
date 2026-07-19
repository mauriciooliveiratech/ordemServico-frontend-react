import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import pg from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false });
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET não configurado");
app.use(helmet());
app.use(cors({ origin: (process.env.FRONTEND_URL || "http://localhost:5173").split(",") }));
app.use(express.json({ limit: "1mb" }));
app.get("/api/health", async (_req,res)=>{ await pool.query("select 1"); res.json({ status:"online" }); });

app.post("/api/auth/criar-empresa", async (req,res,next)=>{
  const client=await pool.connect();
  try {
    const { nome, email, senha, razaoSocial, nomeFantasia, documento, slug, planoId=1 }=req.body;
    if(!nome||!email||!senha||!razaoSocial||!nomeFantasia||!documento||!slug) return res.status(400).json({erro:"Preencha os campos obrigatórios"});
    await client.query("begin");
    const hash=await bcrypt.hash(senha,12);
    const user=(await client.query("insert into usuarios(nome,email,senha_hash,perfil) values($1,lower($2),$3,'admin') returning id,nome,email",[nome,email,hash])).rows[0];
    const company=(await client.query("insert into empresas(razao_social,nome_fantasia,documento,email,slug) values($1,$2,$3,lower($4),lower($5)) returning *",[razaoSocial,nomeFantasia,documento,email,slug])).rows[0];
    await client.query("insert into empresa_usuarios(empresa_id,usuario_id,papel) values($1,$2,'PROPRIETARIO')",[company.id,user.id]);
    await client.query("insert into assinaturas(empresa_id,plano_id,status,periodo_inicio,periodo_fim) values($1,$2,'TRIAL',now(),now()+interval '14 days')",[company.id,planoId]);
    await client.query("commit");
    const token=jwt.sign({sub:user.id,empresaId:company.id,papel:"PROPRIETARIO"},jwtSecret,{expiresIn:"8h"});
    res.status(201).json({token,usuario:user,empresa:company});
  } catch(e){await client.query("rollback");next(e)} finally{client.release()}
});

app.post("/api/auth/login",async(req,res,next)=>{try{
  const {email,senha,empresaId}=req.body;
  const {rows}=await pool.query("select u.id,u.nome,u.email,u.senha_hash,eu.empresa_id,eu.papel,e.nome_fantasia,e.status from usuarios u join empresa_usuarios eu on eu.usuario_id=u.id join empresas e on e.id=eu.empresa_id where u.email=lower($1) and u.ativo and eu.ativo and ($2::uuid is null or e.id=$2)",[email,empresaId||null]);
  let user=null;
  for(const candidate of rows){if(await bcrypt.compare(senha,candidate.senha_hash)){user=candidate;break}}
  if(!user) return res.status(401).json({erro:"Credenciais inválidas"});
  if(["SUSPENSA","CANCELADA"].includes(user.status)) return res.status(403).json({erro:"Empresa sem acesso ativo"});
  const token=jwt.sign({sub:user.id,empresaId:user.empresa_id,papel:user.papel},jwtSecret,{expiresIn:"8h"});
  res.json({token,usuario:{id:user.id,nome:user.nome,email:user.email,papel:user.papel},empresa:{id:user.empresa_id,nome:user.nome_fantasia}});
}catch(e){next(e)}});

const auth=async(req,res,next)=>{try{
  const token=req.headers.authorization?.replace(/^Bearer /,"");
  if(!token) return res.status(401).json({erro:"Autenticação obrigatória"});
  const claims=jwt.verify(token,jwtSecret);
  const {rows}=await pool.query("select e.status,a.status assinatura_status,eu.papel from empresa_usuarios eu join empresas e on e.id=eu.empresa_id left join lateral(select status from assinaturas where empresa_id=e.id order by criado_em desc limit 1)a on true where eu.usuario_id=$1 and eu.empresa_id=$2 and eu.ativo",[claims.sub,claims.empresaId]);
  if(!rows[0]||["SUSPENSA","CANCELADA"].includes(rows[0].status)) return res.status(403).json({erro:"Empresa sem acesso ativo"});
  req.auth={...claims,papel:rows[0].papel}; next();
}catch{return res.status(401).json({erro:"Sessão inválida ou expirada"})}};
app.use("/api",auth);

const somenteAdmin=(req,res,next)=>["PROPRIETARIO","ADMIN"].includes(req.auth.papel)?next():res.status(403).json({erro:"Acesso exclusivo do administrador"});

app.get("/api/minha-empresa",async(req,res,next)=>{try{const {rows}=await pool.query("select e.*,a.status assinatura_status,p.nome plano,p.preco_mensal from empresas e left join lateral(select * from assinaturas where empresa_id=e.id order by criado_em desc limit 1)a on true left join planos p on p.id=a.plano_id where e.id=$1",[req.auth.empresaId]);res.json(rows[0])}catch(e){next(e)}});
app.get("/api/usuarios",somenteAdmin,async(req,res,next)=>{try{const {rows}=await pool.query("select u.id,u.nome,u.email,eu.papel,eu.ativo,u.criado_em from empresa_usuarios eu join usuarios u on u.id=eu.usuario_id where eu.empresa_id=$1 order by u.nome",[req.auth.empresaId]);res.json(rows)}catch(e){next(e)}});
app.post("/api/usuarios",somenteAdmin,async(req,res,next)=>{const client=await pool.connect();try{const {nome,email,senha,papel="TECNICO"}=req.body;if(!["ADMIN","TECNICO"].includes(papel))return res.status(400).json({erro:"Perfil deve ser ADMIN ou TECNICO"});await client.query("begin");let user=(await client.query("select id,nome,email from usuarios where email=lower($1)",[email])).rows[0];if(!user){const hash=await bcrypt.hash(senha,12);user=(await client.query("insert into usuarios(nome,email,senha_hash,perfil) values($1,lower($2),$3,$4) returning id,nome,email",[nome,email,hash,papel.toLowerCase()])).rows[0]}await client.query("insert into empresa_usuarios(empresa_id,usuario_id,papel) values($1,$2,$3)",[req.auth.empresaId,user.id,papel]);await client.query("commit");res.status(201).json({...user,papel})}catch(e){await client.query("rollback");next(e)}finally{client.release()}});
app.patch("/api/usuarios/:id",somenteAdmin,async(req,res,next)=>{try{const {papel,ativo}=req.body;if(papel&&!['ADMIN','TECNICO'].includes(papel))return res.status(400).json({erro:"Perfil inválido"});const {rows}=await pool.query("update empresa_usuarios set papel=coalesce($1,papel),ativo=coalesce($2,ativo) where empresa_id=$3 and usuario_id=$4 returning usuario_id,papel,ativo",[papel||null,typeof ativo==="boolean"?ativo:null,req.auth.empresaId,req.params.id]);if(!rows[0])return res.status(404).json({erro:"Usuário não encontrado"});res.json(rows[0])}catch(e){next(e)}});
const resources={marcas:"marcas",modelos:"modelos",servicos:"servicos",insumos:"insumos",clientes:"clientes"};
for(const [route,table] of Object.entries(resources)){
  app.get(`/api/${route}`,async(req,res,next)=>{try{const params=[req.auth.empresaId];let extra="";if(route==="modelos"&&req.query.marcaId){params.push(req.query.marcaId);extra=" and marca_id=$2"}const {rows}=await pool.query(`select * from ${table} where empresa_id=$1${extra} order by nome`,params);res.json(rows)}catch(e){next(e)}});
  app.post(`/api/${route}`,async(req,res,next)=>{try{const allowed=Object.keys(req.body).filter(k=>/^[a-z_]+$/.test(k)&&k!=="empresa_id");if(!allowed.length)return res.status(400).json({erro:"Dados obrigatórios ausentes"});const cols=["empresa_id",...allowed],values=[req.auth.empresaId,...allowed.map(k=>req.body[k])],vars=cols.map((_,i)=>`$${i+1}`);const {rows}=await pool.query(`insert into ${table}(${cols.join(",")}) values(${vars.join(",")}) returning *`,values);res.status(201).json(rows[0])}catch(e){next(e)}});
}
app.get("/api/os",async(req,res,next)=>{try{const admin=["PROPRIETARIO","ADMIN"].includes(req.auth.papel);const {rows}=await pool.query("select os.*,m.nome marca,mo.nome modelo,c.nome cliente,u.nome tecnico from ordens_servico os left join marcas m on m.id=os.marca_id and m.empresa_id=os.empresa_id left join modelos mo on mo.id=os.modelo_id and mo.empresa_id=os.empresa_id left join clientes c on c.id=os.cliente_id and c.empresa_id=os.empresa_id left join usuarios u on u.id=os.tecnico_id where os.empresa_id=$1 and ($2::boolean or os.tecnico_id=$3) order by os.criado_em desc",[req.auth.empresaId,admin,req.auth.sub]);res.json(rows)}catch(e){next(e)}});
app.get("/api/os/:id",async(req,res,next)=>{try{const admin=["PROPRIETARIO","ADMIN"].includes(req.auth.papel);const {rows}=await pool.query("select * from ordens_servico where id=$1 and empresa_id=$2 and ($3::boolean or tecnico_id=$4)",[req.params.id,req.auth.empresaId,admin,req.auth.sub]);if(!rows[0])return res.status(404).json({erro:"Ordem não encontrada"});res.json(rows[0])}catch(e){next(e)}});
app.post("/api/os",async(req,res,next)=>{try{const b=req.body,admin=["PROPRIETARIO","ADMIN"].includes(req.auth.papel);const tecnicoId=admin?(b.tecnico_id||req.auth.sub):req.auth.sub;const vinculo=await pool.query("select 1 from empresa_usuarios where empresa_id=$1 and usuario_id=$2 and ativo",[req.auth.empresaId,tecnicoId]);if(!vinculo.rows[0])return res.status(400).json({erro:"Técnico não pertence à empresa"});const {rows}=await pool.query("insert into ordens_servico(empresa_id,numero,cliente_id,marca_id,modelo_id,equipamento,defeito_relatado,observacao,situacao,valor,custo,tecnico_id,criado_por) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) returning *",[req.auth.empresaId,b.numero||b.numeroOS,b.cliente_id||null,b.marca_id||b.marcaId||null,b.modelo_id||b.modeloId||null,b.equipamento||null,b.defeito_relatado||null,b.observacao||null,b.situacao||"Aberta",b.valor||0,b.custo||0,tecnicoId,req.auth.sub]);res.status(201).json(rows[0])}catch(e){next(e)}});
app.patch("/api/os/:id",async(req,res,next)=>{try{const admin=["PROPRIETARIO","ADMIN"].includes(req.auth.papel);const allowed=["situacao","observacao","valor","custo"].filter(k=>req.body[k]!==undefined);if(admin&&req.body.tecnico_id!==undefined)allowed.push("tecnico_id");if(!allowed.length)return res.status(400).json({erro:"Nenhuma alteração válida"});const values=allowed.map(k=>req.body[k]),sets=allowed.map((k,i)=>`${k}=$${i+1}`);values.push(req.params.id,req.auth.empresaId,admin,req.auth.sub);const n=values.length;const {rows}=await pool.query(`update ordens_servico set ${sets.join(",")} where id=$${n-3} and empresa_id=$${n-2} and ($${n-1}::boolean or tecnico_id=$${n}) returning *`,values);if(!rows[0])return res.status(404).json({erro:"Ordem não encontrada"});res.json(rows[0])}catch(e){next(e)}});
app.get("/api/relatorios/resumo",somenteAdmin,async(req,res,next)=>{try{const {rows}=await pool.query("select coalesce(sum(valor),0) receita,coalesce(sum(custo),0) custo,count(*) ordens,count(*) filter(where situacao='Finalizada') finalizadas from ordens_servico where empresa_id=$1 and criado_em>=date_trunc('month',now())",[req.auth.empresaId]);res.json(rows[0])}catch(e){next(e)}});
const distPath=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../../dist");
app.use(express.static(distPath));
app.use((req,res,next)=>req.method==="GET"&&!req.path.startsWith("/api/")?res.sendFile(path.join(distPath,"index.html")):next());
app.use((err,_req,res,_next)=>{console.error(err);res.status(err.code==="23505"?409:500).json({erro:err.code==="23505"?"Registro já cadastrado":"Não foi possível concluir a operação"})});
export {app};
if(process.env.VERCEL!=="1") app.listen(process.env.PORT||8080,()=>console.log(`API online na porta ${process.env.PORT||8080}`));
