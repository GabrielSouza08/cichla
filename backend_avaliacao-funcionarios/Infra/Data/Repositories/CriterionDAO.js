const dbConn = require("../../../Shared/DbConnectionMySQL");
const uuid = require("uuid");

function CriterionDAO() {}

CriterionDAO.prototype.Include = async function(req) {
    let criterion = req.body;
    criterion.id = uuid.v1();

    let conn = new dbConn(true);

    query = `INSERT INTO TB_CRITERIOS
    (
      id_criterio,
      ds_criterio,
      dt_cadastro,
      dt_alteracao,
      id_status
    )
    VALUES 
    (
        '${criterion.id}',
        '${criterion.description}',
        curdate(),
        curdate(),
        1
    );`;

    conn.query(query).then(() => {});
    conn.close();
};

CriterionDAO.prototype.IncludeRelationshipAreaCriterion = async function(element) {
    let relationship = element;
    relationship.id = uuid.v1();

    let conn = new dbConn(true);

    query = `INSERT INTO TB_CRITERIO_AREA
    (
        id_criterio_area,
        id_criterio,
        id_area,
        peso,
        dt_criacao
    )
    VALUES 
    (
        '${relationship.id}',
        '${relationship.CriterionId}',
        '${relationship.AreaId}',
        ${relationship.Weight},
        curdate()
    );`;

    conn.query(query).then(() => {});
    conn.close();
};

CriterionDAO.prototype.Get = async() => {
    let conn = new dbConn(true);
    let query = `SELECT 
                    TA.ID_CRITERIO AS id,
                      TA.DS_CRITERIO AS name,
                      DATE_FORMAT(TA.DT_CADASTRO ,'%d/%m/%Y') AS registerDate,
                      DATE_FORMAT(TA.DT_ALTERACAO,'%d/%m/%Y')AS changeDate,
                      TA.ID_STATUS AS statusCode
                  FROM TB_CRITERIOS AS TA
                  WHERE TA.ID_STATUS = 1;`;
    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return data;
};

CriterionDAO.prototype.GetRelationshipAreaCriterion = async() => {
    let conn = new dbConn(true);
    let query = `SELECT 
                    TCA.ID_CRITERIO_AREA AS id,
                    TC.ID_CRITERIO AS criterionId,
                    TC.DS_CRITERIO AS criterionName,
                    TA.ID_AREA AS areaId,
                    TA.DS_AREA AS areaName,
                    TCA.PESO AS weight,
                    DATE_FORMAT(TCA.DT_CRIACAO,'%d/%m/%Y') AS registerDate
                FROM TB_CRITERIO_AREA AS TCA
                INNER JOIN TB_AREAS AS TA
                ON TCA.ID_AREA = TA.ID_AREA
                INNER JOIN TB_CRITERIOS AS TC
                ON TCA.ID_CRITERIO = TC.ID_CRITERIO;`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return data;
};

CriterionDAO.prototype.GetIdByDescription = async(name = '') => {
    let conn = new dbConn(true);
    let query = `SELECT ID_CRITERIO AS id FROM TB_CRITERIOS WHERE DS_CRITERIO = '${name}';`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return data;
};

CriterionDAO.prototype.UpdateStatus = async(status, id) => {
    let conn = new dbConn(true);
    let query = `UPDATE TB_CRITERIOS
                 SET ID_STATUS = ${status}, 
                 DT_ALTERACAO =  curdate() 
                 WHERE ID_CRITERIO = '${id}'`;
    conn.query(query).then(() => {});
    conn.close();
};

CriterionDAO.prototype.ChangeRelationshipAreaCriterion = async function(element) {
    let relation = element;

    let conn = new dbConn(true);

    query = `UPDATE TB_CRITERIO_AREA 
             SET PESO = ${relation.Weight}
             WHERE ID_AREA = '${relation.AreaId}'
             AND ID_CRITERIO = '${relation.CriterionId}';`;

    conn.query(query).then(() => {});
    conn.close();
};

CriterionDAO.prototype.RemoveRelationshipAreaCriterion = async function(element) {
    let relation = element;

    let conn = new dbConn(true);

    query = `DELETE FROM TB_CRITERIO_AREA 
             WHERE ID_AREA = '${relation.AreaId}'
             AND ID_CRITERIO = '${relation.CriterionId}';`;

    conn.query(query).then(() => {});
    conn.close();
};

//#region Metodos Auxiliares
CriterionDAO.prototype.ValidateByName = async(description) => {
    let conn = new dbConn(true);
    let query = `  SELECT ID_STATUS AS status FROM TB_CRITERIOS  WHERE ds_criterio = '${description}'`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return AnalyzeResult(data);
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
    return CriterionDAO;
};