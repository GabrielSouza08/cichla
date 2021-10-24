/* infra/data/creates/CreateDataFeed*/
require('dotenv').config()

module.exports = CreateDataBase = async() => {

    var t = this;
    let accessDb = require("../../../4-Shared/dbConn");
    t.DataBese = new accessDb(true);

    t.scriptPopularSupplementalDataStatus = `
                                                INSERT INTO tb_status
                                                (
                                                ds_status,
                                                dt_cadastro,
                                                dt_alteracao,
                                                status
                                                )
                                                VALUES 
                                                ("Habilitado",curtime(),curtime(),1),
                                                ("Desabilitado",curtime(),curtime(),1),
                                                ("Avaliado",curtime(),curtime(),1),
                                                ("Pendente",curtime(),curtime(),1),
                                                ("Habilitado",curtime(),curtime(),1);
                                            `;

    t.scriptPopularSupplementalDataProfile = `
                                                INSERT INTO tb_perfis
                                                (
                                                ds_perfil,
                                                range_permissoes,
                                                dt_cadastro,
                                                dt_alteracao,
                                                id_status
                                                )
                                                VALUES 
                                                ("Administrador","1,2,3,4,5,6",curtime(),curtime(),1),
                                                ("RH-Master","1,2,3,4,5,6",curtime(),curtime(),1),
                                                ("Avaliador-Master","1,2,3,4,6",curtime(),curtime(),1),
                                                ("Avaliador","3,6",curtime(),curtime(),1),
                                                ("Colaborador","6",curtime(),curtime(),1);
                                            `;


    t.scriptPopularSupplementalDataPermissions = `
                                                    INSERT INTO tb_permissoes
                                                    (
                                                    ds_permissao,
                                                    dt_cadastro,
                                                    dt_alteracao,
                                                    id_status
                                                    )
                                                    VALUES 
                                                    ("Acessar Dashborad",curtime(),curtime(),1),
                                                    ("Acessar Dados Cadastrais",curtime(),curtime(),1),
                                                    ("Acessar Sua Avaliação",curtime(),curtime(),1),
                                                    ("Acessar Controle dados complementares",curtime(),curtime(),1),
                                                    ("Acessar Controle De Dados Avaliativos",curtime(),curtime(),1),
                                                    ("Acessar Tela De Avaliação",curtime(),curtime(),1);
                                                `;

    t.start = async() => {
        return await t.DataBese.query(t.scriptPopularSupplementalDataStatus)
            .then(() => {
                t.DataBese.query(t.scriptPopularSupplementalDataPermissions);
                t.DataBese.query(t.scriptPopularSupplementalDataProfile);
            }, err => {
                return t.DataBese.close().then(() => { throw `$Create Feed: ${err}`; })
            })
            .then(() => {
                return true;
            }).catch(err => {
                console.log(`Create Feed - MESSAGE: ${err}`);
            });
    }

    var execute = async() => {
        let status = await t.start();
        await t.DataBese.close();
        return status;
    };

    return await execute();
}