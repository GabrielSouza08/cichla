const dbConn = require("../../../Shared/DbConnectionMySQL");
const uuid = require("uuid");

function DepartmentDAO() {}

DepartmentDAO.prototype.Include = async function(req) {
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
                        curdate(),
                        curdate(),
                        1
                    );`;

    conn.query(query).then(() => {});
    conn.close();
};

DepartmentDAO.prototype.Get = async() => {
    let conn = new dbConn(true);
    let query = `SELECT 
                    ID_DEPARTAMENTO AS id,
                    DS_DEPARTAMENTO AS name,
                    DATE_FORMAT(DT_CADASTRO ,'%d/%m/%Y') AS registerDate,
                    DATE_FORMAT(DT_ALTERACAO,'%d/%m/%Y')AS changeDate,
                    ID_STATUS AS statusCode
                FROM TB_DEPARTAMENTOS
                WHERE ID_STATUS = 1;`;
    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return data;
};
DepartmentDAO.prototype.ValidateByName = async(description) => {
    let conn = new dbConn(true);
    let query = `  SELECT * FROM TB_DEPARTAMENTOS  WHERE ds_departamento = '${description}' AND ID_STATUS = 1`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return AnalyzeResult(data);
};

DepartmentDAO.prototype.UpdateStatus = async(status, id) => {
    let conn = new dbConn(true);
    let query = `UPDATE TB_Departamentos
                 SET ID_STATUS = ${status} 
                 WHERE ID_departamento = '${id}'`;
    conn.query(query).then(() => {});
    conn.close();
};

//#region Metodos Auxiliares
var AnalyzeResult = function(array) {
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