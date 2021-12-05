const ObjectId = require("mongodb").ObjectId;
const _connection = require("../../../Shared/DbConnectionMongoDb");
const dbConn = require("../../../Shared/DbConnectionMySQL");
const uuid = require("uuid");

function EvaluationDAO() {}

EvaluationDAO.prototype.GetQuestions = async function(evaluatorId) {

    let conn = new dbConn(true);
    let query = `select 
    tu.id_usuario as relationshipId,
    tu.id_usuario as departmentId,
    tu.nome as departmentName,
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

    return conn.query(query).then((result) => { return result; });
};

module.exports = () => {
    return EvaluationDAO;
};