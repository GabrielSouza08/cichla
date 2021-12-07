const dbConn = require("../../../Shared/DbConnectionMySQL");
var shared = require('../../../Shared/Constants.js');

var _shared = new shared();
const uuid = require("uuid");

function EvaluationDAO() {}

EvaluationDAO.prototype.Include = async function(element, status) {
    let evalution = element;
    evalution.id = uuid.v1();

    let conn = new dbConn(true);

    query = `INSERT INTO TB_AVALIACAO
                (ID_AVALIACAO,
                ID_MARCADOR,
                ID_USUARIO,
                ID_AVALIADOR,
                DT_CADASTRO,
                DT_ALTERACAO,
                ID_STATUS)
                VALUES 
                (
                '${evalution.id}',
                '${evalution.markerId}',
                '${evalution.appraiseeId}',
                '${evalution.evaluatorId}',
                curdate(),
                curdate(),
                ${status});`;

    conn.query(query).then(() => {});
    conn.close();
};


EvaluationDAO.prototype.GetQuestions = async function(evaluatorId) {

    let conn = new dbConn(true);
    let query = `select 
    tu.id_usuario as appraiseeId,
    tu.id_usuario as userId,
    tu.nome as userName,
    tq.id_questao as questionId,
    tq.ds_questao as questionName,
    CASE
    WHEN tav.id_avaliacao IS NULL			
    THEN false
    ELSE true	
    END							AS statusEvaluation
    from tb_usuarios tu
    inner join tb_criterio_area tca
    on tu.id_area = tca.id_area
    inner join tb_areas ta
    on tu.id_area = ta.id_area
    inner join tb_questoes tq
    on tca.id_criterio = tq.id_criterio
    and tq.id_status = 1
    left join tb_avaliacao tav
    on tav.id_usuario = tu.id_usuario
    and tav.id_status = 3
    where tu.id_avaliador = '${evaluatorId}'
    and tu.id_status = 1;`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return data;
};

EvaluationDAO.prototype.GetCounQuestionByEvaluatorId = async function(evaluatorId) {

    let conn = new dbConn(true);
    let query = `SELECT 
    TU.ID_USUARIO AS appraiseeId,
    CASE
    WHEN TAV.ID_AVALIACAO IS NULL			
    THEN FALSE
    ELSE TRUE	
    END							AS statusEvaluation,
    COUNT(TQ.ID_QUESTAO) AS count
    FROM TB_USUARIOS TU
    INNER JOIN TB_CRITERIO_AREA TCA
    ON TU.ID_AREA = TCA.ID_AREA
    INNER JOIN TB_QUESTOES TQ
    ON TCA.ID_CRITERIO = TQ.ID_CRITERIO
    AND TQ.ID_STATUS = 1
    LEFT JOIN TB_AVALIACAO TAV
    ON TAV.ID_USUARIO = TU.ID_USUARIO
    AND TAV.ID_STATUS = 3
    WHERE TU.ID_AVALIADOR = '${evaluatorId}'
    AND TU.ID_STATUS = 1
    GROUP BY TU.ID_USUARIO,TAV.ID_AVALIACAO;`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return data;
};

EvaluationDAO.prototype.GetCounQuestionCompletedByEvaluatorId = async function(evaluatorId) {

    let conn = new dbConn(true);
    let query = `SELECT 
    TU.ID_USUARIO AS appraiseeId,
    COUNT(TQA.ID_QUESTAO)AS count
    FROM TB_USUARIOS TU
    LEFT JOIN TB_QUESTOES_AVALIADAS TQA
    ON TU.ID_USUARIO = TQA.ID_USUARIO
    AND TQA.ID_STATUS = 3
    WHERE TU.ID_AVALIADOR = '${evaluatorId}'
    AND TU.ID_STATUS = 1
    GROUP BY TU.ID_USUARIO;`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return data;
};

EvaluationDAO.prototype.GetEvaluationCompleted = async function(userId) {

    let conn = new dbConn(true);
    let query = `SELECT 
    TA.ID_AVALIACAO AS id,
    TA.ID_USUARIO AS appraiseeId,
    TQA.ID_QUESTAO AS questionId,
    TQ.DS_QUESTAO AS questionName,
    TQA.ID_ESCALA AS noteId,
    TE.DS_ESCALA AS noteName,
    TA.ID_STATUS AS statusCode
    FROM TB_AVALIACAO TA
    INNER JOIN TB_QUESTOES_AVALIADAS TQA
    ON TA.ID_USUARIO = TQA.ID_USUARIO
    AND TQA.ID_STATUS = 3
    INNER JOIN TB_QUESTOES TQ
    ON TQA.ID_QUESTAO = TQ.ID_QUESTAO
    INNER JOIN TB_ESCALAS TE
    ON TQA.ID_ESCALA = TE.ID_ESCALA
    WHERE TA.ID_USUARIO = '${userId}'
    AND TA.ID_STATUS = 3;`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return data;
};

EvaluationDAO.prototype.ObtainOriginalQuantitativeData = async function(userId, maxNote = false) {

    let params = (maxNote) ? '5' : 'TE.NOTA';
    let conn = new dbConn(true);
    let query = `SELECT 
                ${params} AS weight,
                TE.NOTA AS grade
                FROM TB_QUESTOES_AVALIADAS TQA
                INNER JOIN TB_USUARIOS TU 
                ON TU.ID_USUARIO = TQA.ID_USUARIO
                INNER JOIN TB_ESCALAS TE
                ON TE.ID_ESCALA = TQA.ID_ESCALA
                INNER JOIN TB_QUESTOES TQ
                ON TQ.ID_QUESTAO = TQA.ID_QUESTAO 
                INNER JOIN TB_CRITERIO_AREA TCA
                ON TCA.ID_CRITERIO =  TQ.ID_CRITERIO
                AND TCA.ID_AREA = TU.ID_AREA
                WHERE TQA.ID_STATUS = 3
                AND TU.ID_USUARIO = '${userId}';`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return data;
};

EvaluationDAO.prototype.ValidateByUserId = async(userId) => {
    let conn = new dbConn(true);
    let query = `SELECT 
                 TA.id_status AS status 
                 FROM tb_avaliacao  TA
                 INNER JOIN tb_marcadores_avaliativos TMA
                 ON TA.id_marcador = TMA.id_marcador
                 AND TMA.id_status = 1
                 WHERE TA.id_usuario = '${userId}';`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return _shared.AnalyzeResultEvaluation(data);
};

EvaluationDAO.prototype.GetIdByUserId = async(userId) => {
    let conn = new dbConn(true);
    let query = `SELECT 
                TA.ID_AVALIACAO AS id
                FROM TB_AVALIACAO  TA
                INNER JOIN TB_MARCADORES_AVALIATIVOS TMA
                ON TA.ID_MARCADOR = TMA.ID_MARCADOR
                AND TMA.ID_STATUS = 1
                WHERE TA.ID_USUARIO = '${userId}';`;

    let data = await conn.query(query).then((result) => {
        return (result.length > 0) ? result[0].id : undefined;
    });

    conn.close();
    return data;
};

EvaluationDAO.prototype.UpdateStatus = async(id, status) => {
    let conn = new dbConn(true);
    let query = `UPDATE TB_AVALIACAO
                    SET ID_STATUS = ${status}, 
                    DT_ALTERACAO =  curdate() 
                    WHERE ID_AVALIACAO = '${id}'`;
    conn.query(query).then(() => {});
    conn.close();
};


module.exports = () => {
    return EvaluationDAO;
};