alter table ordens_servico add column if not exists servico_id bigint references servicos(id);
alter table ordens_servico add column if not exists valor_pago numeric(12,2) not null default 0;
alter table ordens_servico add column if not exists pago_em timestamptz;

create table if not exists pagamentos_os (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  ordem_id bigint not null references ordens_servico(id) on delete cascade,
  recebido_por uuid not null references usuarios(id),
  forma text not null check (forma in ('DINHEIRO','PIX','DEBITO','CREDITO','TRANSFERENCIA')),
  valor numeric(12,2) not null check (valor > 0),
  parcelas integer not null default 1 check (parcelas > 0),
  observacao text,
  confirmado_em timestamptz not null default now(),
  estornado_em timestamptz
);
create index if not exists idx_pagamentos_empresa_data on pagamentos_os(empresa_id, confirmado_em desc);
create unique index if not exists uq_pagamento_os_ativo on pagamentos_os(ordem_id) where estornado_em is null;
