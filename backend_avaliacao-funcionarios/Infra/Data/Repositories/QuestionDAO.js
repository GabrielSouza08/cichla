const dbConn = require("../../../Shared/DbConnectionMySQL");
const uuid = require("uuid");
var shared = require('../../../Shared/Constants.js');

var _shared = new shared();

function QuestionDAO() {}

QuestionDAO.prototype.Include = async function(req) {
    let question = req.body;
    question.id = uuid.v1();

    let conn = new dbConn(true);

    query = `INSERT INTO TB_QUESTOES
                (
                id_questao,
                ds_questao,
                id_criterio,
                dt_cadastro,
                dt_alteracao,
                id_status
                )
                VALUES 
                (
                '${question.id}',
                '${question.description}',
                '${question.criterionId}',
                curdate(),
                curdate(),
                1);`;

    conn.query(query).then(() => {});
    conn.close();
};

QuestionDAO.prototype.Update = async function(req) {
    let question = req.body;
    console.log(question);
    let conn = new dbConn(true);

    query = `UPDATE TB_QUESTOES SET
            ds_questao = '${question.description}',
            dt_alteracao = curdate()              
            WHERE id_questao = '${question.id}'`;

    console.log(query);
    conn.query(query).then(() => {});
    conn.close();
};

QuestionDAO.prototype.UpdateStatus = async(status, id) => {
    let conn = new dbConn(true);
    let query = `UPDATE TB_QUESTOES
                 SET ID_STATUS = ${status}, 
                 DT_ALTERACAO =  curdate() 
                 WHERE id_questao = '${id}'`;
    conn.query(query).then(() => {});
    conn.close();
};


QuestionDAO.prototype.Get = async() => {
    let conn = new dbConn(true);
    let query = `SELECT 			
                TQ.ID_QUESTAO AS id,
                TQ.DS_QUESTAO AS description,
                TC.ID_CRITERIO AS criterionId,
                TC.DS_CRITERIO AS criterionName,
                DATE_FORMAT(TQ.DT_CADASTRO ,'%d/%m/%Y') AS registerDate,
                DATE_FORMAT(TQ.DT_ALTERACAO,'%d/%m/%Y') AS changeDate,
                TQ.ID_STATUS AS statusCode
                FROM TB_QUESTOES TQ 
                INNER JOIN TB_CRITERIOS TC
                ON TC.ID_CRITERIO = TQ.ID_CRITERIO
                WHERE TQ.ID_STATUS = 1;`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return data;
};

QuestionDAO.prototype.GetByAreaId = async(areaId) => {
    let conn = new dbConn(true);
    let query = `SELECT 
                0 AS grade,
                TQ.DS_QUESTAO AS description,
                TCA.PESO AS weight
                FROM TB_QUESTOES TQ
                INNER JOIN TB_CRITERIO_AREA TCA
                ON TQ.ID_CRITERIO = TCA.ID_CRITERIO
                WHERE TCA.ID_AREA = '${areaId}';`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return data;
};

QuestionDAO.prototype.GetQuantity = async() => {
    let conn = new dbConn(true);
    let query = `SELECT 
                COUNT(DS_QUESTAO) AS descriptionQuantity,
                ID_CRITERIO AS criterionId,
                ID_STATUS AS statusCode
                FROM TB_QUESTOES
                WHERE ID_STATUS = 1
                GROUP BY ID_CRITERIO, ID_STATUS;`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return data;
};

QuestionDAO.prototype.GetIdByDescription = async(name = '') => {
    let conn = new dbConn(true);
    let query = `SELECT ID_QUESTAO AS id FROM TB_QUESTOES WHERE DS_QUESTAO = '${name}';`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return data;
};

QuestionDAO.prototype.ValidateByDescription = async(description) => {
    let conn = new dbConn(true);
    let query = `  SELECT ID_STATUS AS status FROM TB_QUESTOES  WHERE DS_QUESTAO = '${description}'`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return _shared.AnalyzeResult(data);
};

module.exports = () => {
    return QuestionDAO;
};