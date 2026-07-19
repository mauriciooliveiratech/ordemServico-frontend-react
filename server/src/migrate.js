import "dotenv/config";
import pg from "pg";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==="production"?{rejectUnauthorized:false}:false});
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../../database");
try{
  await pool.query("create table if not exists schema_migrations(nome text primary key, executado_em timestamptz default now())");
  for(const name of ["schema.sql","002_saas_multiempresa.sql","003_perfis_e_tecnicos.sql","004_pagamentos_os.sql"]){
    const done=await pool.query("select 1 from schema_migrations where nome=$1",[name]);
    if(done.rows[0])continue;
    const client=await pool.connect();
    try{await client.query("begin");await client.query(await fs.readFile(path.join(root,name),"utf8"));await client.query("insert into schema_migrations(nome) values($1)",[name]);await client.query("commit");console.log(`Migração aplicada: ${name}`)}catch(e){await client.query("rollback");throw e}finally{client.release()}
  }
}finally{await pool.end()}
