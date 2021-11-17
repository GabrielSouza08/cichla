const dbConn = require("../../../Shared/DbConnection");
const uuid = require("uuid");

function AreaDAO() {}

AreaDAO.prototype.Include = async function (req) {
  let area = req.body;
  area.id = uuid.v1();

  let conn = new dbConn(true);

  query = `INSERT INTO TB_AREAS
    (
      id_area,
      ds_area,
      dt_cadastro,
      dt_alteracao,
      id_status
    )
    VALUES 
    (
        '${area.id}',
        '${area.description}',
        curtime(),
        curtime(),
        1
    );`;

  conn.query(query).then(() => {});
};

AreaDAO.prototype.Get = async () => {
  let conn = new dbConn(true);
  let query = `SELECT 
                * from TB_AREAS      
                `;

  return conn.query(query).then((result) => {
    return result;
  });
};

AreaDAO.prototype.UpdateStatus = async (status, id) => {
  let conn = new dbConn(true);
  let query = `UPDATE TB_AREAS
                 SET ID_STATUS = ${status} 
                 WHERE ID_AREA = '${id}'`;
  conn.query(query).then(() => {});
};

//#region Metodos Auxiliares
AreaDAO.prototype.ValidateByName = async (description) => {
  let conn = new dbConn(true);
  let query = `  SELECT * FROM TB_AREAS  WHERE ds_area = '${description}'`;
  return await conn.query(query).then(async (result) => {
    return AnalyzeResult(result);
  });
};
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
  return AreaDAO;
};
