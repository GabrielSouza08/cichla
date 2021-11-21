const dbConn = require("../../../Shared/DbConnection");
const uuid = require("uuid");

function ResponsabilityDAO() {}

ResponsabilityDAO.prototype.Include = async function (req) {
  let responsability = req.body;
  responsability.id = uuid.v1();

  let conn = new dbConn(true);

  query = `INSERT INTO tb_cargos  
                    (
                      id_cargo,
                      ds_cargo,
                      dt_cadastro,
                      dt_alteracao,
                      id_status
                    )
                    VALUES 
                    (
                        '${cargo.id}',
                        '${cargo.ds_responsability}',
                        
                        curtime(),
                        curtime(),
                        1
                    );`;

  conn.query(query).then(() => {});
};

ResponsabilityDAO.prototype.Get = async () => {
  let conn = new dbConn(true);
  let query = `select c.id_cargo,
                c.ds_cargo,
                c.dt_cadastro,
                c.dt_alteracao,
                c.id_status,
                a.id_area,
                a.ds_area
                from tb_cargos as c
                inner join tb_cargos_area as ca
                on c.id_cargo = ca.id_cargo
                inner join tb_areas as a
                on a.id_area = ca.id_area
                `;

  return conn.query(query).then((result) => {
    return result;
  });
};
ResponsabilityDAO.prototype.ValidateByName = async (description) => {
  let conn = new dbConn(true);
  let query = `  SELECT * FROM TB_CARGOS  WHERE ds_cargo = '${description}'`;
  return await conn.query(query).then(async (result) => {
    return AnalyzeResult(result);
  });
};

ResponsabilityDAO.prototype.UpdateStatus = async (status, id) => {
  let conn = new dbConn(true);
  let query = `UPDATE TB_CARGOS 
                 SET ID_STATUS = ${status} 
                 WHERE ID_CARGO = '${id}'`;
  conn.query(query).then(() => {});
};

//#region Metodos Auxiliares
var AnalyzeResult = function (array) {
  /* 
    verifica o resultado em quantidade e status.
    qt:0  - id_status:indefinido -> false -> inexistente
    qt:1  - id_status:2          -> false -> inativo
    qt:1  - id_status:1          -> true  -> ativo
    qt:>1 - id_status:1ou2       -> false -> multiplos
    */
  let index = array[0] == undefined ? 0 : array.length;

  if (index == 0) return { status: false, count: index };

  return {
    status: index == 1 && array[index - 1].status == 1 ? true : false,
    count: index,
  };
};

//#endregion

module.exports = () => {
  return ResponsabilityDAO;
};
