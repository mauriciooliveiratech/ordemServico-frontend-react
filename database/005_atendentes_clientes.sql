create table if not exists atendentes (
  id bigint generated always as identity primary key,
  empresa_id uuid not null references empresas(id) on delete cascade,
  nome text not null,
  telefone text,
  email text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create unique index if not exists uq_atendentes_empresa_nome
  on atendentes(empresa_id, lower(nome));

alter table ordens_servico
  add column if not exists atendente_id bigint references atendentes(id);

create index if not exists idx_atendentes_empresa on atendentes(empresa_id);
create index if not exists idx_clientes_empresa on clientes(empresa_id);
