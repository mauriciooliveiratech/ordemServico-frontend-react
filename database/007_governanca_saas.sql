alter table usuarios add column if not exists super_admin boolean not null default false;
update usuarios set super_admin=true where lower(email)='mauricioazol@gmail.com';

alter table empresas drop constraint if exists empresas_status_check;
alter table empresas add constraint empresas_status_check check (status in ('PENDENTE','TRIAL','ATIVA','SUSPENSA','CANCELADA','REJEITADA'));
alter table empresas add column if not exists acesso_tipo text;
alter table empresas add column if not exists acesso_ate timestamptz;
alter table empresas add constraint empresas_acesso_tipo_check check (acesso_tipo is null or acesso_tipo in ('PERIODO','VITALICIO'));

update empresas e set status='ATIVA',acesso_tipo='VITALICIO',acesso_ate=null
where exists(select 1 from empresa_usuarios eu join usuarios u on u.id=eu.usuario_id where eu.empresa_id=e.id and u.super_admin);
update empresas e set status='PENDENTE',trial_termina_em=null
where e.status='TRIAL' and not exists(select 1 from empresa_usuarios eu join usuarios u on u.id=eu.usuario_id where eu.empresa_id=e.id and u.super_admin);

alter table assinaturas drop constraint if exists assinaturas_status_check;
alter table assinaturas add constraint assinaturas_status_check check (status in ('PENDENTE','TRIAL','ATIVA','ATRASADA','SUSPENSA','CANCELADA','REJEITADA'));
update assinaturas a set status='ATIVA',periodo_inicio=coalesce(periodo_inicio,now()),periodo_fim=null
where exists(select 1 from empresas e where e.id=a.empresa_id and e.acesso_tipo='VITALICIO');
update assinaturas a set status='PENDENTE',periodo_inicio=null,periodo_fim=null
where exists(select 1 from empresas e where e.id=a.empresa_id and e.status='PENDENTE');
