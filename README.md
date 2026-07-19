# Oficina OS

Sistema web de gestão de oficina com ordens de serviço, cadastro dependente de marca/modelo, serviços, PDV, insumos/estoque e relatórios.

## SaaS multiempresa

Cada cliente possui uma empresa isolada por `empresa_id`. Usuários são vinculados por função, com suporte a proprietário, administrador, técnico, vendedor e operador. Planos, período de teste e assinaturas ficam registrados separadamente. Execute `database/002_saas_multiempresa.sql` depois do schema principal. A API extrai a empresa do token assinado e não aceita `empresa_id` enviado pelo navegador, evitando acesso acidental aos dados de outro cliente.

Execute também `database/003_perfis_e_tecnicos.sql`. Os perfis `PROPRIETARIO` e `ADMIN` acessam todas as ordens e o relatório consolidado da empresa. O perfil `TECNICO` recebe automaticamente apenas suas ordens e não pode atribuí-las a outro usuário. Cadastro, alteração de perfil e desativação de usuários são exclusivos do administrador.

### Fluxo de acesso

1. O usuário entra com e-mail e senha em `/login`.
2. A API retorna um token assinado contendo usuário e empresa.
3. O frontend envia esse token automaticamente em todas as chamadas.
4. A API valida novamente o vínculo e o perfil atual no banco a cada requisição.
5. Administradores recebem todas as OS da empresa; técnicos recebem apenas registros cujo `tecnico_id` seja o seu usuário.

## Arquitetura online

- Frontend: React + TypeScript + Vite (publicável na Vercel, Netlify ou Render)
- Backend: Node.js + Express em `server/` (publicável no Render, Railway ou Fly.io)
- Banco: PostgreSQL gerenciado (Supabase, Neon, Render ou Railway)
- O navegador nunca acessa o banco diretamente; todas as operações passam pela API.

## Executar

1. Crie um PostgreSQL online e execute `database/schema.sql`.
2. Copie `server/.env.example` para `server/.env` e informe a conexão do banco.
3. Em `server/`, execute `npm install` e `npm run dev`.
4. Copie `.env.example` para `.env` e configure `VITE_API_URL=http://localhost:8080/api`.
5. Na raiz, execute `npm install` e `npm run dev`.

## Publicar sem manter nada local

O arquivo `render.yaml` publica tudo em uma única infraestrutura online: aplicação web Node, frontend React servido pela mesma aplicação e PostgreSQL gerenciado. O banco é migrado automaticamente antes de cada inicialização. Depois de enviar o repositório para GitHub, crie um **Blueprint** no Render apontando para ele. O serviço gera o banco, a chave JWT e o link HTTPS público. Não é necessário deixar nenhum computador ligado.

O endereço padrão será `https://oficina-os-saas.onrender.com`. Se o Render alterar o nome por indisponibilidade, atualize `FRONTEND_URL` com o endereço gerado. Um domínio próprio também pode ser conectado no painel do serviço.

## Publicação no domínio O Técnico Apple Vix

O projeto também está configurado por `vercel.json` para funcionar como uma aplicação única na Vercel. Use um PostgreSQL online integrado à Vercel e cadastre as variáveis `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production` e `FRONTEND_URL=https://app.otecnicoapplevix.com.br`. O build executa as migrações antes de gerar o frontend. Depois associe `app.otecnicoapplevix.com.br` ao projeto; como os nameservers do domínio já são da Vercel, o certificado HTTPS e o registro DNS são administrados no mesmo painel.

O painel incluído usa dados demonstrativos para permitir a avaliação visual. A próxima etapa de produção é ligar todas as ações de tela à API, adicionar autenticação JWT, validações e transações de estoque/PDV.
