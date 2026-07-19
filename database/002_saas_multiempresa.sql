-- Execute após schema.sql. Converte a instalação em SaaS multiempresa.
create table if not exists planos (
  id bigint generated always as identity primary key,
  nome text unique not null,
  preco_mensal numeric(12,2) not null default 0,
  limite_usuarios integer,
  limite_ordens_mes integer,
  recursos jsonb not null default '{}'::jsonb,
  ativo boolean not null default true
);

create table if not exists empresas (
  id uuid primary key default gen_random_uuid(),
  razao_social text not null,
  nome_fantasia text not null,
  documento text unique not null,
  email text not null,
  telefone text,
  slug text unique not null,
  status text not null default 'TRIAL' check (status in ('TRIAL','ATIVA','SUSPENSA','CANCELADA')),
  trial_termina_em timestamptz default (now() + interval '14 days'),
  criado_em timestamptz not null default now()
);

create table if not exists assinaturas (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  plano_id bigint not null references planos(id),
  status text not null default 'TRIAL' check (status in ('TRIAL','ATIVA','ATRASADA','CANCELADA')),
  provedor text,
  cliente_externo_id text,
  assinatura_externa_id text unique,
  periodo_inicio timestamptz,
  periodo_fim timestamptz,
  cancelar_ao_final boolean not null default false,
  criado_em timestamptz not null default now()
);

create table if not exists empresa_usuarios (
  empresa_id uuid not null references empresas(id) on delete cascade,
  usuario_id uuid not null references usuarios(id) on delete cascade,
  papel text not null default 'OPERADOR' check (papel in ('PROPRIETARIO','ADMIN','TECNICO','VENDEDOR','OPERADOR')),
  ativo boolean not null default true,
  primary key (empresa_id, usuario_id)
);

alter table marcas add column if not exists empresa_id uuid references empresas(id);
alter table modelos add column if not exists empresa_id uuid references empresas(id);
alter table servicos add column if not exists empresa_id uuid references empresas(id);
alter table clientes add column if not exists empresa_id uuid references empresas(id);
alter table insumos add column if not exists empresa_id uuid references empresas(id);
alter table ordens_servico add column if not exists empresa_id uuid references empresas(id);
alter table vendas add column if not exists empresa_id uuid references empresas(id);
alter table movimentos_estoque add column if not exists empresa_id uuid references empresas(id);

alter table marcas drop constraint if exists marcas_nome_key;
alter table servicos drop constraint if exists servicos_nome_key;
alter table insumos drop constraint if exists insumos_sku_key;
alter table ordens_servico drop constraint if exists ordens_servico_numero_key;
alter table vendas drop constraint if exists vendas_numero_key;
create unique index if not exists uq_marcas_empresa_nome on marcas(empresa_id, lower(nome));
create unique index if not exists uq_servicos_empresa_nome on servicos(empresa_id, lower(nome));
create unique index if not exists uq_insumos_empresa_sku on insumos(empresa_id, sku);
create unique index if not exists uq_os_empresa_numero on ordens_servico(empresa_id, numero);
create unique index if not exists uq_vendas_empresa_numero on vendas(empresa_id, numero);
create index if not exists idx_empresa_usuarios_usuario on empresa_usuarios(usuario_id);
create index if not exists idx_assinaturas_empresa on assinaturas(empresa_id, status);

insert into planos(nome, preco_mensal, limite_usuarios, limite_ordens_mes, recursos)
values
 ('Essencial', 79.90, 3, 200, '{"pdv":true,"estoque":true,"relatorios":true}'),
 ('Profissional', 149.90, 10, 1000, '{"pdv":true,"estoque":true,"relatorios":true,"multiunidade":true}')
on conflict (nome) do nothing;
