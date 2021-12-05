/* infra/data/creates/CreateTables*/

module.exports = CreateTables = async() => {
    var t = this;
    let accessDb = require("../../../Shared/DbConnectionMySQL");
    t.DataBase = new accessDb(true);

    t.scriptCreateProc = `CREATE PROCEDURE CreateAllTables()
    BEGIN
    -- cria tabela status
                                        CREATE TABLE IF NOT EXISTS tb_status (
                                        id_status INT NOT NULL,
                                        ds_status VARCHAR (50) NOT NULL,
                                        dt_cadastro DATETIME NOT NULL,
                                        dt_alteracao DATETIME NOT NULL,
                                        status BIT NOT NULL,
                                        PRIMARY KEY(id_status),
                                        INDEX (ds_status(10))
                                        );
                                        
     -- cria tabela permissoes
                                    CREATE TABLE IF NOT EXISTS tb_permissoes (
                                    id_permissao INT NOT NULL,
                                    ds_permissao VARCHAR (50) NOT NULL,
                                    dt_cadastro DATETIME NOT NULL,
                                    dt_alteracao DATETIME NOT NULL,
                                    id_status int NOT NULL,
                                    PRIMARY KEY(id_permissao),
                                    FOREIGN KEY (id_status) REFERENCES tb_status(id_status)
                                    );
                                    
    -- cria tabela de escalas avaliativas
                                    CREATE TABLE IF NOT EXISTS tb_escalas(
                                    id_escala VARCHAR(50) NOT NULL,
                                    ds_escala VARCHAR(50) NOT NULL,
                                    nota INT NOT NULL,
                                    dt_cadastro DATETIME NOT NULL,
                                    dt_alteracao DATETIME NOT NULL,
                                    id_status INT NOT NULL,
                                    PRIMARY KEY(id_escala),
                                    FOREIGN KEY (id_status) REFERENCES tb_status(id_status),
                                    INDEX (ds_escala)
                                    );                                
                                        
    -- cria tabela departamentos
                                    CREATE TABLE IF NOT EXISTS tb_departamentos (
                                    id_departamento VARCHAR (50) NOT NULL,
                                    ds_departamento VARCHAR (50) NOT NULL,
                                    dt_cadastro DATETIME NOT NULL,
                                    dt_alteracao DATETIME NOT NULL,
                                    id_status int NOT NULL,
                                    PRIMARY KEY(id_departamento),
                                    FOREIGN KEY (id_status) REFERENCES tb_status(id_status),
                                    INDEX (ds_departamento(10))
                                    );
    
    -- Cria tabela de cargos
                                      CREATE TABLE IF NOT EXISTS tb_cargos (
                                      id_cargo VARCHAR (50) NOT NULL,
                                      ds_cargo VARCHAR (50) NOT NULL,
                                      dt_cadastro DATETIME NOT NULL,
                                      dt_alteracao DATETIME NOT NULL,
                                      id_status int NOT NULL,
                                      PRIMARY KEY(id_cargo),
                                      INDEX (ds_cargo(10)),
                                      FOREIGN KEY (id_status) REFERENCES tb_status(id_status)
                                      );   
                                    
    -- cria tabela areas
                                      CREATE TABLE IF NOT EXISTS tb_areas (
                                      id_area VARCHAR (50) NOT NULL,
                                      ds_area VARCHAR (50) NOT NULL,
                                      id_departamento VARCHAR (50) NOT NULL,
                                      dt_cadastro DATETIME NOT NULL,
                                      dt_alteracao DATETIME NOT NULL,
                                      id_status int NOT NULL,
                                      PRIMARY KEY(id_area),
                                      FOREIGN KEY (id_departamento) REFERENCES tb_departamentos(id_departamento),
                                      FOREIGN KEY (id_status) REFERENCES tb_status(id_status),
                                      INDEX (ds_area(10))
                                      );
                                                                    
     -- cria tabela que relaciona cargos às permissões
                                    CREATE TABLE IF NOT EXISTS tb_cargos_permissoes (
                                    id_cargo_permissao VARCHAR(50) NOT NULL,
                                    id_cargo VARCHAR (50) NOT NULL,
                                    id_permissao VARCHAR (50) NOT NULL,
                                    dt_criacao VARCHAR (100) NOT NULL
                                    );
                                    
     -- cria tabela que relaciona cargos às respctivas areas
                                    CREATE TABLE IF NOT EXISTS tb_cargos_area (
                                    id_cargo_area VARCHAR(50) NOT NULL,
                                    id_cargo VARCHAR (50) NOT NULL,
                                    id_area VARCHAR (50) NOT NULL,
                                    dt_criacao VARCHAR (100) NOT NULL
                                    );                                
                                    
    -- cria tabela usuarios
                                    CREATE TABLE IF NOT EXISTS tb_usuarios (
                                    id_usuario VARCHAR(50) NOT NULL,
                                    nome VARCHAR (70) NOT NULL,
                                    email VARCHAR (50) NOT NULL,
                                    senha VARCHAR (100) NOT NULL,
                                    id_avaliador VARCHAR (50) NULL,
                                    id_cargo VARCHAR (50) NOT NULL,
                                    id_area VARCHAR (50) NOT NULL,
                                    dt_cadastro DATETIME NOT NULL,
                                    dt_alteracao DATETIME NOT NULL,
                                    id_status INT NOT NULL,
                                    PRIMARY KEY(id_usuario),
                                    FOREIGN KEY (id_cargo) REFERENCES tb_cargos(id_cargo),
                                    FOREIGN KEY (id_area) REFERENCES tb_areas(id_area),
                                    FOREIGN KEY (id_status) REFERENCES tb_status(id_status),
                                    INDEX (nome, email, senha(20))
                                    );
                                    
    -- cria tabela criterios
                                    CREATE TABLE IF NOT EXISTS tb_criterios (
                                    id_criterio VARCHAR(50) NOT NULL,
                                    ds_criterio VARCHAR (70) NOT NULL,
                                    dt_cadastro DATETIME NOT NULL,
                                    dt_alteracao DATETIME NOT NULL,
                                    id_status INT NOT NULL,
                                    PRIMARY KEY(id_criterio),
                                    FOREIGN KEY (id_status) REFERENCES tb_status(id_status),
                                    INDEX (ds_criterio(20))
                                    );                                
                                        
    -- cria tabela que relaciona criterios às area
                                    CREATE TABLE IF NOT EXISTS tb_criterio_area (
                                    id_criterio_area VARCHAR(50) NOT NULL,
                                    id_criterio VARCHAR (50) NOT NULL,
                                    id_area VARCHAR (50) NOT NULL,
                                    peso INT NOT NULL,
                                    dt_criacao VARCHAR (100) NOT NULL,
                                    PRIMARY KEY(id_criterio_area),
                                    FOREIGN KEY (id_criterio) REFERENCES tb_criterios(id_criterio),
                                    FOREIGN KEY (id_area) REFERENCES tb_areas(id_area),
                                    INDEX (peso, dt_criacao)
                                    );
                                    
    -- cria tabela de questoes
                                    CREATE TABLE IF NOT EXISTS tb_questoes(
                                    id_questao VARCHAR(50) NOT NULL,
                                    ds_questao VARCHAR(50) NOT NULL,
                                    id_criterio_area VARCHAR(50) NOT NULL,
                                    dt_cadastro DATETIME NOT NULL,
                                    dt_alteracao DATETIME NOT NULL,
                                    id_status INT NOT NULL,
                                    PRIMARY KEY(id_questao),
                                    FOREIGN KEY (id_status) REFERENCES tb_status(id_status),
                                    FOREIGN KEY (id_criterio_area) REFERENCES tb_criterio_area(id_criterio_area),
                                    INDEX (ds_questao)
                                    );
                                    
    -- cria tabela de controle avaliativo
                                    CREATE TABLE IF NOT EXISTS tb_marcadores_avaliativos (
                                    id_marcador VARCHAR(50) NOT NULL,
                                    ds_marcador VARCHAR(50) NOT NULL,
                                    periodo INT NOT NULL,
                                    dt_inicio DATETIME NOT NULL,
                                    dt_fim DATETIME NOT NULL,
                                    dt_limite DATETIME NOT NULL,
                                    dt_cadastro DATETIME NOT NULL,
                                    dt_alteracao DATETIME NOT NULL,
                                    id_status INT NOT NULL,
                                    PRIMARY KEY(id_marcador),
                                    FOREIGN KEY (id_status) REFERENCES tb_status(id_status),
                                    INDEX (ds_marcador, dt_inicio, dt_fim, dt_limite, periodo)
                                    );

-- cria tabela avalicao
                                    CREATE TABLE IF NOT EXISTS tb_avaliacao (
                                    id_avaliacao VARCHAR(50) NOT NULL,
                                    id_marcador VARCHAR(50) NOT NULL,
                                    id_usuario VARCHAR(50) NOT NULL,
                                    id_avaliador VARCHAR(50) NOT NULL,
                                    dt_cadastro DATETIME NOT NULL,
                                    dt_alteracao DATETIME NOT NULL,
                                    id_status INT NOT NULL,
                                    PRIMARY KEY(id_avaliacao),
                                    FOREIGN KEY (id_status) REFERENCES tb_status(id_status)
                                    );
                                    
-- cria tabela questoes avaliadas
                                    CREATE TABLE IF NOT EXISTS tb_questoes_avaliadas (
                                    id_questao_avaliada VARCHAR(50) NOT NULL,
                                    id_marcador VARCHAR(50) NOT NULL,
                                    id_usuario VARCHAR(50) NOT NULL,
                                    id_questao VARCHAR(50) NOT NULL,
                                    id_escala VARCHAR(50) NOT NULL,
                                    dt_cadastro DATETIME NOT NULL,
                                    id_status INT NOT NULL,
                                    PRIMARY KEY(id_questao_avaliada),
                                    FOREIGN KEY (id_status) REFERENCES tb_status(id_status)
                                    );                                     
                                    END`;

    t.scriptExecute = `CALL CreateAllTables();`;

    t.start = async() => {
        return await t.DataBase.query(t.scriptCreateProc)
            .then(() => { t.DataBase.query(t.scriptExecute); },
                (err) => {
                    return t.DataBase.close().then(() => {
                        throw `$Create Tables: ${err}`;
                    });
                }
            )
            .then(() => {
                return true;
            })
            .catch((err) => {
                console.log(`Create Tables - MESSAGE: ${err.message}`);
            });
    };

    var execute = async() => {
        let status = await t.start();
        t.DataBase.close();
        return status;
    };

    return await execute();
};