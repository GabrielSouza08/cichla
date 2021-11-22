use db_cichla;
SET SQL_SAFE_UPDATES = 0;

INSERT INTO tb_departamentos (id_departamento,ds_departamento,dt_cadastro,dt_alteracao,id_status) values ('1','TI',curtime(), curtime(),1);
INSERT INTO tb_areas (id_area,ds_area,id_departamento,dt_cadastro,dt_alteracao,id_status) values ('1','Desenvolvimento','1',curtime(), curtime(),1);
INSERT INTO tb_cargos (id_cargo,ds_cargo,dt_cadastro,dt_alteracao,id_status) values ('1','Desenvolvedor',curtime(), curtime(), 1);
INSERT INTO tb_cargos (id_cargo,ds_cargo,dt_cadastro,dt_alteracao,id_status) values ('2','Coordenador(a)',curtime(), curtime(), 1);
INSERT INTO tb_cargos_area (id_cargo_area, id_cargo, id_area, dt_criacao) values ('1','1','1', curtime());
INSERT INTO tb_cargos_area (id_cargo_area, id_cargo, id_area, dt_criacao) values ('2','2','1', curtime());
INSERT INTO tb_cargos_permissoes (id_cargo_permissao, id_cargo, id_permissao, dt_criacao) values ('1','1','6', curtime());
INSERT INTO tb_cargos_permissoes (id_cargo_permissao, id_cargo, id_permissao, dt_criacao) values ('1','2','1', curtime());
INSERT INTO tb_cargos_permissoes (id_cargo_permissao, id_cargo, id_permissao, dt_criacao) values ('1','2','2', curtime());
INSERT INTO tb_cargos_permissoes (id_cargo_permissao, id_cargo, id_permissao, dt_criacao) values ('1','2','3', curtime());
INSERT INTO tb_cargos_permissoes (id_cargo_permissao, id_cargo, id_permissao, dt_criacao) values ('1','2','4', curtime());
INSERT INTO tb_cargos_permissoes (id_cargo_permissao, id_cargo, id_permissao, dt_criacao) values ('1','2','5', curtime());
INSERT INTO tb_cargos_permissoes (id_cargo_permissao, id_cargo, id_permissao, dt_criacao) values ('1','2','6', curtime());
INSERT INTO tb_criterios (id_criterio,ds_criterio,dt_cadastro,dt_alteracao,id_status) values ('1','Habilidade',curtime(),curtime(),1);
INSERT INTO tb_criterio_area (id_criterio_area,id_criterio,id_area,peso,dt_criacao) values ('1','1','1',10,curtime());
INSERT INTO tb_questoes (id_questao,ds_questao,id_criterio_area,dt_cadastro,dt_alteracao,id_status) values ('1','Qual sua habilidade??','1',curtime(),curtime(),1);
INSERT INTO tb_questoes (id_questao,ds_questao,id_criterio_area,dt_cadastro,dt_alteracao,id_status) values ('2','Qual sua habilidade 2??','1',curtime(),curtime(),1);
INSERT INTO tb_usuarios (id_usuario, nome, email, senha, id_avaliador, id_cargo, id_area, dt_cadastro, dt_alteracao, id_status) values ('1','Giovanni Antoniolli','giovanni.antoniolli@gmail.com','81dc9bdb52d04dc20036dbd8313ed055', null,'2','1',curtime(),curtime(),1);
INSERT INTO tb_usuarios (id_usuario, nome, email, senha, id_avaliador, id_cargo, id_area, dt_cadastro, dt_alteracao, id_status) values ('2','Gabriel Calixto','gabriel.calixto@gmail.com','81dc9bdb52d04dc20036dbd8313ed055', '1','1','1',curtime(),curtime(),1);
INSERT INTO tb_usuarios (id_usuario, nome, email, senha, id_avaliador, id_cargo, id_area, dt_cadastro, dt_alteracao, id_status) values ('3','Willian Santos','willian.santos@gmail.com','81dc9bdb52d04dc20036dbd8313ed055', '1','1','1',curtime(),curtime(),1);
INSERT INTO tb_marcadores_avaliativos (id_marcador,ds_marcador,periodo,dt_inicio,dt_fim,dt_limite,dt_cadastro,dt_alteracao,id_status) values ('1','1 semestre 2021',6,'2021-01-17 07:45:10','2021-06-05 16:45:10', '2021-05-15 23:59:59',curtime(),curtime(),1);
INSERT INTO tb_marcadores_avaliativos (id_marcador,ds_marcador,periodo,dt_inicio,dt_fim,dt_limite,dt_cadastro,dt_alteracao,id_status) values ('2','2 semestre 2021',6,'2021-07-17 07:45:10','2021-12-05 16:45:10', '2021-11-15 23:59:59',curtime(),curtime(),1);

SELECT * FROM TB_USUARIOS;

-- Senha dos usuários é 1234