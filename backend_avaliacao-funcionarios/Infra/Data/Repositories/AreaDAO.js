const dbConn = require("../../../Shared/DbConnectionMySQL");
const uuid = require("uuid");
var shared = require('../../../Shared/Constants.js');

var _shared = new shared();

function AreaDAO() {}

AreaDAO.prototype.Include = async function(req) {
    let area = req.body;
    area.id = uuid.v1();

    let conn = new dbConn(true);

    query = `INSERT INTO TB_AREAS
    (
      id_area,
      ds_area,
      id_departamento,
      dt_cadastro,
      dt_alteracao,
      id_status
    )
    VALUES 
    (
        '${area.id}',
        '${area.description}',
        '${area.idDepartment}',
        curdate(),
        curdate(),
        1
    );`;

    conn.query(query).then(() => {});
    conn.close();
};

AreaDAO.prototype.Get = async() => {
    let conn = new dbConn(true);
    let query = `SELECT 
                    TA.ID_AREA AS id,
                      TA.DS_AREA AS name,
                      TA.ID_DEPARTAMENTO AS departmentId,
                      TD.DS_DEPARTAMENTO AS departmentName,
                      DATE_FORMAT(TA.DT_CADASTRO ,'%d/%m/%Y') AS registerDate,
                      DATE_FORMAT(TA.DT_ALTERACAO,'%d/%m/%Y')AS changeDate,
                      TA.ID_STATUS AS statusCode
                  FROM TB_AREAS AS TA
                  LEFT JOIN TB_DEPARTAMENTOS AS TD 
                  ON TA.ID_DEPARTAMENTO = TD.ID_DEPARTAMENTO 
                  WHERE TA.ID_STATUS = 1;`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();

    return data;
};

AreaDAO.prototype.GetIdByDescription = async(name = '') => {
    let conn = new dbConn(true);
    let query = `SELECT ID_AREA AS id FROM TB_AREAS WHERE DS_AREA = '${name}';`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();

    return data;
};

AreaDAO.prototype.UpdateStatus = async(status, id) => {
    let conn = new dbConn(true);
    let query = `UPDATE TB_AREAS
                 SET ID_STATUS = ${status}, 
                 DT_ALTERACAO =  curdate() 
                 WHERE ID_AREA = '${id}'`;
    conn.query(query).then(() => {});
    conn.close();
};

//#region Metodos Auxiliares
AreaDAO.prototype.ValidateByName = async(description) => {
    let conn = new dbConn(true);
    let query = `  SELECT ID_STATUS AS status FROM TB_AREAS  WHERE ds_area = '${description}'`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return _shared.AnalyzeResult(data);
};

//#endregion

module.exports = () => {
    return AreaDAO;
};