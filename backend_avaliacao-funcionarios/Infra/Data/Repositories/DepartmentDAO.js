const dbConn = require("../../../Shared/DbConnection");
const uuid = require("uuid");

function DepartmentDAO() {}

DepartmentDAO.prototype.Include = async function (req) {
  let department = req.body;
  department.id = uuid.v1();

  let conn = new dbConn(true);

  query = `INSERT INTO tb_departamentos  
                    (
                      id_departamento,
                      ds_departamento,
                      dt_cadastro,
                      dt_alteracao,
                      id_status
                    )
                    VALUES 
                    (
                        '${department.id}',
                        '${department.ds_departament}',
                        
                        curtime(),
                        curtime(),
                        1
                    );`;

  conn.query(query).then(() => {});
};

DepartmentDAO.prototype.Get = async () => {
  let conn = new dbConn(true);
  let query = `SELECT 
                      * FROM TB_DEPARTAMENTOS`;

  return conn.query(query).then((result) => {
    return result;
  });
};
AreaDAO.prototype.ValidateByName = async (description) => {
  let conn = new dbConn(true);
  let query = `  SELECT * FROM TB_AREAS  WHERE ds_area = '${description}'`;
  return await conn.query(query).then(async (result) => {
    return AnalyzeResult(result);
  });
};

DepartmentDAO.prototype.UpdateStatus = async (status, id) => {
  let conn = new dbConn(true);
  let query = `UPDATE TB_USUARIOS 
                 SET ID_STATUS = ${status} 
                 WHERE ID_USUARIO = '${id}'`;
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
  return DepartmentDAO;
};
