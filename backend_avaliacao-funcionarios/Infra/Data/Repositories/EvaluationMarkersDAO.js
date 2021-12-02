const dbConn = require("../../../Shared/DbConnectionMySQL");
const uuid = require("uuid");

function EvaluationMarkersDAO() {}

EvaluationMarkersDAO.prototype.Include = async function(req) {
    let eMarker = req.body;
    eMarker.id = uuid.v1();

    let conn = new dbConn(true);

    query = `INSERT INTO TB_MARCADORES_AVALIATIVOS   
    (
      id_marcador,
      ds_marcador,
      dt_cadastro,
      dt_alteracao,
      id_status
    )
    VALUES 
    (
        '${eMarker.id}',
        '${eMarker.description}',
        curdate(),
        curdate(),
        1
    );`;

    conn.query(query).then(() => {});
};
EvaluationMarkersDAO.prototype.Get = async() => {
    let conn = new dbConn(true);
    let query = `SELECT 
                      * FROM TB_MARCADORES_AVALIATIVOS`;

    return conn.query(query).then((result) => {
        return result;
    });
};
EvaluationMarkersDAO.prototype.ValidateByName = async(description) => {
    let conn = new dbConn(true);
    let query = `  SELECT * FROM TB_MARCADORES_AVALIATIVOS  WHERE ds_marcador = '${description}'`;
    return await conn.query(query).then(async(result) => {
        return AnalyzeResult(result);
    });
};

EvaluationMarkersDAO.prototype.UpdateStatus = async(status, id) => {
    let conn = new dbConn(true);
    let query = `UPDATE TB_MARCADORES_AVALIATIVOS
                 SET ID_STATUS = ${status} 
                 WHERE ID_MARCADOR = '${id}'`;
    conn.query(query).then(() => {});
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
    return EvaluationMarkersDAO;
};