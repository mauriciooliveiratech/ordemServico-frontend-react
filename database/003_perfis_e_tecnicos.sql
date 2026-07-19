-- Vínculo e autorização das ordens por usuário.
alter table ordens_servico add column if not exists tecnico_id uuid references usuarios(id);
alter table ordens_servico add column if not exists criado_por uuid references usuarios(id);
create index if not exists idx_os_empresa_tecnico on ordens_servico(empresa_id, tecnico_id, criado_em desc);

-- Os papéis suportados permanecem no vínculo empresa_usuarios.
-- PROPRIETARIO e ADMIN veem todos; TECNICO vê somente suas ordens.
