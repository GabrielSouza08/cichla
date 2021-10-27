/* infra/data/creates/CreateDataFeed*/
require("dotenv").config();

module.exports = CreateDataBase = async () => {
  var t = this;
  let accessDb = require("../../../Shared/DbConnection");
  t.DataBese = new accessDb(true);

  t.scriptPopularSupplementalDataStatus = `
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
                                                (5,"Habilitado",curtime(),curtime(),1);
                                            `;

  // t.scriptPopularSupplementalDataProfile = `
  //                                               INSERT INTO tb_perfis
  //                                               (
  //                                               id_perfil,
  //                                               ds_perfil,
  //                                               range_permissoes,
  //                                               dt_cadastro,
  //                                               dt_alteracao,
  //                                               id_status
  //                                               )
  //                                               VALUES
  //                                               (1,"Administrador","1,2,3,4,5,6",curtime(),curtime(),1),
  //                                               (2,"RH-Master","1,2,3,4,5,6",curtime(),curtime(),1),
  //                                               (3,"Avaliador-Master","1,2,3,4,6",curtime(),curtime(),1),
  //                                               (4,"Avaliador","3,6",curtime(),curtime(),1),
  //                                               (5,"Colaborador","6",curtime(),curtime(),1);
  //                                           `;

  t.scriptPopularSupplementalDataPermissions = `
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
                                                `;

  t.start = async () => {
    return await t.DataBese.query(t.scriptPopularSupplementalDataStatus)
      .then(
        () => {
          t.DataBese.query(t.scriptPopularSupplementalDataPermissions);
          //t.DataBese.query(t.scriptPopularSupplementalDataProfile);
        },
        (err) => {
          return t.DataBese.close().then(() => {
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

  var execute = async () => {
    let status = await t.start();
    await t.DataBese.close();
    return status;
  };

  return await execute();
};
