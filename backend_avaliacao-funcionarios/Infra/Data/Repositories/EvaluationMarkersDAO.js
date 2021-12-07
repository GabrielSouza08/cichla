const dbConn = require("../../../Shared/DbConnectionMySQL");
const uuid = require("uuid");
var shared = require('../../../Shared/Constants.js');

var _shared = new shared();

function EvaluationMarkersDAO() {}

EvaluationMarkersDAO.prototype.Include = async function(element, status) {
    let eMarker = element;
    eMarker.id = uuid.v1();

    let conn = new dbConn(true);

    query = `INSERT INTO TB_MARCADORES_AVALIATIVOS   
    (
        ID_MARCADOR,
        DS_MARCADOR,
        PERIODO,
        DT_INICIO,
        DT_FIM,
        DT_LIMITE,
        DT_CADASTRO,
        DT_ALTERACAO,
        ID_STATUS
    )
    VALUES 
    (
        '${eMarker.id}',
        '${eMarker.description}',
        ${eMarker.period},
        '${eMarker.initialDate}',
        '${eMarker.endDate}',
        '${eMarker.limiteDate}',
        curdate(),
        curdate(),
        ${status}
    );`;

    conn.query(query).then(() => {});
    conn.close();
};

EvaluationMarkersDAO.prototype.Get = async(statusId) => {
    let conn = new dbConn(true);
    let query = `SELECT 
                ID_MARCADOR AS id,
                DS_MARCADOR AS  description,
                PERIODO AS period,
                DATE_FORMAT(DT_INICIO,'%d/%m/%Y') AS initialDate,
                DATE_FORMAT(DT_FIM,'%d/%m/%Y') AS endDate,
                DATE_FORMAT(DT_LIMITE,'%d/%m/%Y') AS limiteDate,
                DATE_FORMAT(DT_CADASTRO,'%d/%m/%Y') AS registerDate,
                DATE_FORMAT(DT_ALTERACAO,'%d/%m/%Y') AS changeDate,
                ID_STATUS AS statusCode
                FROM TB_MARCADORES_AVALIATIVOS
                WHERE ID_STATUS = ${statusId}`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return data;
};

EvaluationMarkersDAO.prototype.GetCount = async() => {
    let conn = new dbConn(true);
    let query = `SELECT COUNT(*) AS count FROM TB_MARCADORES_AVALIATIVOS  `;

    let data = await conn.query(query).then((result) => {
        return result[0].count;
    });

    conn.close();
    return data;
};

EvaluationMarkersDAO.prototype.ValidateByDescription = async(description) => {
    let conn = new dbConn(true);
    let query = `  SELECT ID_STATUS AS status FROM TB_MARCADORES_AVALIATIVOS  WHERE ds_marcador = '${description}'`;
    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return _shared.AnalyzeResult(data);
};

EvaluationMarkersDAO.prototype.UpdateStatus = async(status, id) => {
    let conn = new dbConn(true);
    let query = `UPDATE TB_MARCADORES_AVALIATIVOS
                 SET ID_STATUS = ${status} 
                 WHERE ID_MARCADOR = '${id}'`;
    conn.query(query).then(() => {});
    conn.close();
};

module.exports = () => {
    return EvaluationMarkersDAO;
};