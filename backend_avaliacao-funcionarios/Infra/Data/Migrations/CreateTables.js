/* infra/data/creates/CreateTables*/

module.exports = CreateTables = async () => {
  var t = this;
  let accessDb = require("../../../Shared/DbConnection");
  t.DataBase = new accessDb(true);

  t.scriptIncludeTableStatus = `
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
                                `;

  t.scriptIncludeTableResponsability = `
                                          -- Cria tabela de cargos
                                          CREATE TABLE IF NOT EXISTS tb_cargos (
                                          id_cargo VARCHAR (50) NOT NULL,
                                          ds_cargo VARCHAR (50) NOT NULL,
                                          dt_cadastro DATETIME NOT NULL,
                                          dt_alteracao DATETIME NOT NULL,
                                          id_status int NOT NULL,
                                          PRIMARY KEY(id_cargo),
                                          INDEX (ds_cargo(10))
                                          );
                                        `;

  t.scriptIncludeTableArea = `
                                -- cria tabela areas
                                CREATE TABLE IF NOT EXISTS tb_areas (
                                id_area VARCHAR (50) NOT NULL,
                                ds_area VARCHAR (50) NOT NULL,
                                dt_cadastro DATETIME NOT NULL,
                                dt_alteracao DATETIME NOT NULL,
                                id_status int NOT NULL,
                                PRIMARY KEY(id_area),
                                INDEX (ds_area(10))
                                );
                              `;

  t.scriptIncludeTableDepartment = `
                                        -- cria tabela departamentos
                                        CREATE TABLE IF NOT EXISTS tb_departamentos (
                                        id_departamento VARCHAR (50) NOT NULL,
                                        ds_departamento VARCHAR (50) NOT NULL,
                                        dt_cadastro DATETIME NOT NULL,
                                        dt_alteracao DATETIME NOT NULL,
                                        id_status int NOT NULL,
                                        PRIMARY KEY(id_departamento),
                                        INDEX (ds_departamento(10))
                                        );
                                    `;

  t.scriptIncludeTablePermissions = `
                                        -- cria tabela permissoes
                                        CREATE TABLE IF NOT EXISTS tb_permissoes (
                                        id_permissao INT NOT NULL,
                                        ds_permissao VARCHAR (50) NOT NULL,
                                        dt_cadastro DATETIME NOT NULL,
                                        dt_alteracao DATETIME NOT NULL,
                                        id_status int NOT NULL,
                                        PRIMARY KEY(id_permissao)
                                        );
                                    `;

  // t.scriptIncludeTableProfile = `
  //                                   -- cria tabela perfis
  //                                   CREATE TABLE IF NOT EXISTS tb_perfis (
  //                                   id_perfil INT NOT NULL,
  //                                   ds_perfil VARCHAR (50) NOT NULL,
  //                                   range_permissoes VARCHAR (50) NOT NULL,
  //                                   dt_cadastro DATETIME NOT NULL,
  //                                   dt_alteracao DATETIME NOT NULL,
  //                                   id_status int NOT NULL,
  //                                   PRIMARY KEY(id_perfil),
  //                                   INDEX (ds_perfil, range_permissoes(10))
  //                                   );
  //                               `;

  t.scriptIncludeTablePermissionsToResponsabilities = `
                                -- cria tabela que relaciona cargos às permissões
                                CREATE TABLE IF NOT EXISTS tb_cargos_permissoes (
                                id VARCHAR(50) NOT NULL,
                                id_cargo VARCHAR (50) NOT NULL,
                                id_permissao VARCHAR (50) NOT NULL,
                                dt_criacao VARCHAR (100) NOT NULL
                                );
                              `;

  t.scriptIncludeTableUsers = `
                                -- cria tabela usuarios
                                CREATE TABLE IF NOT EXISTS tb_usuarios (
                                id_usuario VARCHAR(50) NOT NULL,
                                nome VARCHAR (70) NOT NULL,
                                email VARCHAR (50) NOT NULL,
                                senha VARCHAR (100) NOT NULL,
                                perfil char (1) NOT NULL,
                                id_avaliador varchar (50),
                                id_cargo varchar (50),
                                id_area varchar (50),
                                id_departamento varchar (50),
                                dt_cadastro DATETIME NOT NULL,
                                dt_alteracao DATETIME NOT NULL,
                                id_status int NOT NULL,
                                PRIMARY KEY(id_usuario),
                                INDEX (nome, email, senha(20))
                                );
                            `;

  t.start = async () => {
    return await t.DataBase.query(t.scriptIncludeTableStatus)
      .then(() => {
        t.DataBase.query(t.scriptIncludeTableResponsability);
        t.DataBase.query(t.scriptIncludeTableArea);
        t.DataBase.query(t.scriptIncludeTableDepartment);
        t.DataBase.query(t.scriptIncludeTablePermissions);
        t.DataBase.query(t.scriptIncludeTablePermissionsToResponsabilities);
      })
      .then(
        () => {
          t.DataBase.query(t.scriptIncludeTableUsers);
        },
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

  var execute = async () => {
    let status = await t.start();
    t.DataBase.close();
    return status;
  };

  return await execute();
};
