use DB_CICHLA;
-- cria tabela status
CREATE TABLE IF NOT EXISTS tb_status (
id_status INT NOT NULL AUTO_INCREMENT,
ds_status VARCHAR (50) NOT NULL,
dt_cadastro DATETIME NOT NULL,
dt_alteracao DATETIME NOT NULL,
status BIT NOT NULL,
PRIMARY KEY(id_status),
INDEX (ds_status(10))
);

-- Cria tabela de cargos
CREATE TABLE IF NOT EXISTS tb_cargos (
id_cargo INT NOT NULL AUTO_INCREMENT,
ds_cargo VARCHAR (50) NOT NULL,
dt_cadastro DATETIME NOT NULL,
dt_alteracao DATETIME NOT NULL,
id_status int NOT NULL,
PRIMARY KEY(id_cargo),
CONSTRAINT fk_tb_cargos_status FOREIGN KEY (id_status) REFERENCES tb_status(id_status),
INDEX (ds_cargo(10))
);
-- cria tabela areas
CREATE TABLE IF NOT EXISTS tb_areas (
id_area INT NOT NULL AUTO_INCREMENT,
ds_area VARCHAR (50) NOT NULL,
dt_cadastro DATETIME NOT NULL,
dt_alteracao DATETIME NOT NULL,
id_status int NOT NULL,
PRIMARY KEY(id_area),
CONSTRAINT fk_tb_areas_status FOREIGN KEY (id_status) REFERENCES tb_status(id_status),
INDEX (ds_area(10))
);
-- cria tabela departamentos
CREATE TABLE IF NOT EXISTS tb_departamentos (
id_departamento INT NOT NULL AUTO_INCREMENT,
ds_departamento VARCHAR (50) NOT NULL,
dt_cadastro DATETIME NOT NULL,
dt_alteracao DATETIME NOT NULL,
id_status int NOT NULL,
PRIMARY KEY(id_departamento),
CONSTRAINT fk_tb_departamentos_status FOREIGN KEY (id_status) REFERENCES tb_status(id_status),
INDEX (ds_departamento(10))
);

-- cria tabela permissoes
CREATE TABLE IF NOT EXISTS tb_permissoes (
id_permissao INT NOT NULL AUTO_INCREMENT,
ds_permissao VARCHAR (50) NOT NULL,
dt_cadastro DATETIME NOT NULL,
dt_alteracao DATETIME NOT NULL,
id_status int NOT NULL,
PRIMARY KEY(id_permissao),
CONSTRAINT fk_tb_permissoes_status FOREIGN KEY (id_status) REFERENCES tb_status(id_status)
);

-- cria tabela perfil
CREATE TABLE IF NOT EXISTS tb_perfil (
id_perfil INT NOT NULL AUTO_INCREMENT,
ds_perfil VARCHAR (50) NOT NULL,
range_permissoes VARCHAR (50) NOT NULL,
dt_cadastro DATETIME NOT NULL,
dt_alteracao DATETIME NOT NULL,
id_status int NOT NULL,
PRIMARY KEY(id_perfil),
CONSTRAINT fk_tb_perfil_status FOREIGN KEY (id_status) REFERENCES tb_status(id_status),
INDEX (ds_perfil, range_permissoes(10))
);

-- cria tabela usuarios
CREATE TABLE IF NOT EXISTS tb_usuarios (
id_usuario  INT NOT NULL AUTO_INCREMENT,
nome VARCHAR (70) NOT NULL,
email VARCHAR (50) NOT NULL,
senha VARCHAR (100) NOT NULL,
id_perfil int,
id_cargo int,
id_area int,
id_departamento int,
dt_cadastro DATETIME NOT NULL,
dt_alteracao DATETIME NOT NULL,
id_status int NOT NULL,
PRIMARY KEY(id_usuario),
CONSTRAINT fk_tb_usuarios_perfil FOREIGN KEY (id_perfil) REFERENCES tb_perfil(id_perfil),
CONSTRAINT fk_tb_usuarios_cargo FOREIGN KEY (id_cargo) REFERENCES tb_cargos(id_cargo),
CONSTRAINT fk_tb_usuarios_area FOREIGN KEY (id_area) REFERENCES tb_areas(id_area),
CONSTRAINT fk_tb_usuarios_departamento FOREIGN KEY (id_departamento) REFERENCES tb_departamentos(id_departamento),
CONSTRAINT fk_tb_usuarios_status FOREIGN KEY (id_status) REFERENCES tb_status(id_status),
INDEX (nome, email, senha(20))
);