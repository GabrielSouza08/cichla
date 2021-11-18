use db_cichla;
SET SQL_SAFE_UPDATES = 0;

insert into tb_departamentos (id_departamento,ds_departamento,dt_cadastro,dt_alteracao,id_status) values ('1','TI',curtime(), curtime(),1);
insert into tb_areas (id_area,ds_area,id_departamento,dt_cadastro,dt_alteracao,id_status) values ('1','Desenvolvimento','1',curtime(), curtime(),1);
insert into tb_criterios (id_criterio,ds_criterio,dt_cadastro,dt_alteracao,id_status) values ('1','Habilidade',curtime(),curtime(),1);
insert into tb_criterio_area (id_criterio_area,id_criterio,id_area,peso,dt_criacao) values ('1','1','1',10,curtime());
insert into tb_questoes (id_questao,ds_questao,id_criterio_area,dt_cadastro,dt_alteracao,id_status) values ('1','Qual sua habilidade??','1',curtime(),curtime(),1);
insert into tb_questoes (id_questao,ds_questao,id_criterio_area,dt_cadastro,dt_alteracao,id_status) values ('2','Qual sua habilidade 2??','1',curtime(),curtime(),1);


select * from tb_questoes