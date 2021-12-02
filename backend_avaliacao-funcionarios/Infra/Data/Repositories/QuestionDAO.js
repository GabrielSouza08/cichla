const dbConn = require("../../../Shared/DbConnectionMySQL");
const uuid = require("uuid");

function QuestionDAO() {}

QuestionDAO.prototype.Include = async function(req) {
    let question = req.body;
    question.id = uuid.v1();

    let conn = new dbConn(true);

    query = `INSERT INTO 
    (
    )
    VALUES 
    (
        '${question}',
        '${question}',
        '${question}',
        curdate(),
        curdate(),
        1
    );`;

    conn.query(query).then(() => {});
};

QuestionDAO.prototype.Get = async(areaId) => {
    let conn = new dbConn(true);
    let query = `SELECT 
                0 AS grade,
                TQ.DS_QUESTAO AS description,
                TCA.PESO AS weight
                FROM TB_QUESTOES TQ
                INNER JOIN TB_CRITERIO_AREA TCA
                ON TQ.ID_CRITERIO = TCA.ID_CRITERIO
                WHERE TCA.ID_AREA = '${areaId}';`;

    return conn.query(query).then((result) => {
        return result;
    });
};

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
    return QuestionDAO;
};