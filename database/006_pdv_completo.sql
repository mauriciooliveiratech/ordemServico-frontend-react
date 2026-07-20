alter table vendas add column if not exists vendedor_id uuid references usuarios(id);
alter table vendas add column if not exists parcelas integer not null default 1;
alter table vendas add column if not exists observacao text;
alter table vendas add column if not exists status text not null default 'CONCLUIDA';
alter table vendas add column if not exists cancelada_em timestamptz;
alter table venda_itens add column if not exists custo_unitario numeric(12,2) not null default 0;
create index if not exists idx_vendas_empresa_data on vendas(empresa_id, criado_em desc);
create index if not exists idx_venda_itens_venda on venda_itens(venda_id);
