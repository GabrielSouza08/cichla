const dbConn = require("../../../Shared/DbConnectionMySQL");
const uuid = require("uuid");
var shared = require('../../../Shared/Constants.js');

var _shared = new shared();

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
    return _shared.AnalyzeResult(data);
};

DepartmentDAO.prototype.UpdateStatus = async(status, id) => {
    let conn = new dbConn(true);
    let query = `UPDATE TB_Departamentos
                 SET ID_STATUS = ${status} 
                 WHERE ID_departamento = '${id}'`;
    conn.query(query).then(() => {});
    conn.close();
};


//#endregion

module.exports = () => {
    return DepartmentDAO;
};