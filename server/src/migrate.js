import "dotenv/config";
import pg from "pg";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==="production"?{rejectUnauthorized:false}:false});
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../../database");
try{
  await pool.query("create table if not exists schema_migrations(nome text primary key, executado_em timestamptz default now())");
  for(const name of ["schema.sql","002_saas_multiempresa.sql","003_perfis_e_tecnicos.sql","004_pagamentos_os.sql","005_atendentes_clientes.sql"]){
    const done=await pool.query("select 1 from schema_migrations where nome=$1",[name]);
    if(done.rows[0])continue;
    const client=await pool.connect();
    try{await client.query("begin");await client.query(await fs.readFile(path.join(root,name),"utf8"));await client.query("insert into schema_migrations(nome) values($1)",[name]);await client.query("commit");console.log(`Migração aplicada: ${name}`)}catch(e){await client.query("rollback");throw e}finally{client.release()}
  }
  await pool.query("alter table insumos add column if not exists modelo text");
  await pool.query("alter table clientes add column if not exists ativo boolean not null default true");
  await pool.query("alter table ordens_servico add column if not exists insumo_id bigint references insumos(id)");
  await pool.query("alter table ordens_servico add column if not exists insumo_baixado boolean not null default false");
  await pool.query("update insumos set modelo=regexp_replace(nome, '^Tampa (.*) (Preto|Branco|Lilás|Amarelo|Verde|Vermelho|Cinza Grafite|Dourado|Azul|Roxo|Rosa)$', '\\1') where modelo is null and nome like 'Tampa iPhone %'");
  const importName="006_importar_estoque_pdf_2026_07_10";
  if(!(await pool.query("select 1 from schema_migrations where nome=$1",[importName])).rows[0]){
    await pool.query("alter table insumos add column if not exists modelo text");
    const encoded="H4sIAPZGXGoC/5WXwW6cMBCGXwVx3kMwhm6OaRv10kjRblVFinKwGtogsUvFZqUob9Nn6YsVbYFd8Gd7fIXvH3tmfsbm8TGt71/afZVkWbpKv5ndb5NMT5L7rnpt01VWPK384MfO7H/0ZBkCv9bN3z+HdJWHwJud6aqmD6lC5Peqe65k3K5qXqyQfZYt5t4mn+r9u0m+dOZn/dovcS3VcTlOr+7Mm0PUv1kumGWxAcaVi1jh5/bYmedeqS+VylKoaYkPIXBwTxniRk8UIfDm/dgsrEPYudES1PKOwsaennJKHn6slZYKKEUPPnXNzgD7rSyjXMcKhxKsY3WuzAKyKcOZMrcU+UXbdQiFvRA21igI3tX7eqKViB7KGITHETzj0BH5pUMLKY8O9QnYcj7F/2rbGWDnc8uhOlZI3RXIhspF67gg2lLocQUd5JrjgU9KJ012IngsahYCp6wy0frQYycr3sP5i56j6DXtPnl9Aiych6dEPfimfcPto6e0fzpLhGgxgQ72WVh4geGJw8lJ4HTNCy/ttI6TptlJ8KY9GAE2XBbmHPa+uLCKluJ4fvgEZF0f79w/eqNYzFMVK3PnExAuLsHReqpLafEl5UUYeo5A1yB0svLIYGTiwMiEkRFKNE7pOfJ9Cs7MI1j++Eh1WBmnR0qRxyR69JhA5y5MQIjn8XopWP/C0UscXHcIw96vT/616LmrtVTAP+ZeCVfDpwCjbG+X7PY2UVfqCrvkpqNC853mYYk/bPEOYHN04QeKXEGLuga3i4XvgFAR5hsCFBRN4NoowxuL3nCpCIQvCDn7nEGMPwOOeL41Pf0DVOxYacMTAAA=";
    const items=JSON.parse(gunzipSync(Buffer.from(encoded,"base64")).toString("utf8"));
    const companies=(await pool.query("select id from empresas order by criado_em")).rows;
    if(companies.length!==1)throw new Error(`Importação do estoque requer exatamente uma empresa; encontradas: ${companies.length}`);
    const client=await pool.connect();
    try{
      await client.query("begin");
      for(let i=0;i<items.length;i++){
        const [modelo,nome,estoque]=items[i],sku=`PDF-${String(i+1).padStart(3,"0")}`;
        await client.query("insert into insumos(empresa_id,sku,nome,modelo,unidade,estoque,estoque_minimo,custo_medio,preco_venda,ativo) values($1,$2,$3,$4,'UN',$5,0,0,0,true) on conflict(empresa_id,sku) do update set nome=excluded.nome,modelo=excluded.modelo,estoque=excluded.estoque",[companies[0].id,sku,nome,modelo,estoque]);
      }
      await client.query("insert into schema_migrations(nome) values($1)",[importName]);
      await client.query("commit");
      console.log(`Estoque importado: ${items.length} itens`);
    }catch(e){await client.query("rollback");throw e}finally{client.release()}
  }
}finally{await pool.end()}
