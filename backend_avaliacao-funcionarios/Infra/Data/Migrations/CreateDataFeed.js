/* infra/data/creates/CreateDataFeed*/
require("dotenv").config();

module.exports = CreateDataBase = async() => {
    var t = this;
    let accessDb = require("../../../Shared/DbConnectionMySQL");
    t.DataBase = new accessDb(true);

    t.scriptCreateDataFead = `CREATE PROCEDURE CreateDataFead()
                                              BEGIN
                                              INSERT INTO tb_status
                                              (
                                              id_status,
                                              ds_status,
                                              dt_cadastro,
                                              dt_alteracao,
                                              status
                                              )
                                              VALUES 
                                              (1,"Habilitado",curtime(),curtime(),1),
                                              (2,"Desabilitado",curtime(),curtime(),1),
                                              (3,"Avaliado",curtime(),curtime(),1),
                                              (4,"Pendente",curtime(),curtime(),1),
                                              (5,"Em aguardo",curtime(),curtime(),1);
                                                                              
                                              INSERT INTO tb_permissoes
                                              (
                                              id_permissao,
                                              ds_permissao,
                                              dt_cadastro,
                                              dt_alteracao,
                                              id_status
                                              )
                                              VALUES 
                                              (1,"Acessar Dashborad",curtime(),curtime(),1),
                                              (2,"Acessar Dados Cadastrais",curtime(),curtime(),1),
                                              (3,"Acessar Sua Avaliação",curtime(),curtime(),1),
                                              (4,"Acessar Controle dados complementares",curtime(),curtime(),1),
                                              (5,"Acessar Controle De Dados Avaliativos",curtime(),curtime(),1),
                                              (6,"Acessar Tela De Avaliação",curtime(),curtime(),1);
                                              
                                              INSERT INTO tb_escalas
                                              (
                                              id_escala,
                                              ds_escala,
                                              nota,
                                              dt_cadastro,
                                              dt_alteracao,
                                              id_status
                                              )
                                              VALUES 
                                              (1,"Distante do requerido",1,curtime(),curtime(),1),
                                              (2,"Próximo do requerido",2,curtime(),curtime(),1),
                                              (3,"Atende mas pode melhorar",3,curtime(),curtime(),1),
                                              (4,"Atende completamente o requerido",4,curtime(),curtime(),1),
                                              (5,"Supera o requerido",5,curtime(),curtime(),1);
                                                                              
                                              END`;

    t.scriptExecute = `CALL CreateDataFead();`;


    t.start = async() => {
        return await t.DataBase.query(t.scriptCreateDataFead)
            .then(
                () => {
                    t.DataBase.query(t.scriptExecute);
                },
                (err) => {
                    return t.DataBase.close().then(() => {
                        throw `$Create Feed: ${err}`;
                    });
                }
            )
            .then(() => {
                return true;
            })
            .catch((err) => {
                console.log(`Create Feed - MESSAGE: ${err}`);
            });
    };

    var execute = async() => {
        let status = await t.start();
        await t.DataBase.close();
        return status;
    };

    return await execute();
};