const dbConn = require("../../../Shared/DbConnectionMySQL");
const uuid = require("uuid");

function ResponsabilityDAO() {}

ResponsabilityDAO.prototype.Include = async function(req) {
    let responsability = req.body;
    responsability.id = uuid.v1();

    let conn = new dbConn(true);

    query = `INSERT INTO tb_cargos  
                    (
                      id_cargo,
                      ds_cargo,
                      dt_cadastro,
                      dt_alteracao,
                      id_status
                    )
                    VALUES 
                    (
                        '${responsability.id}',
                        '${responsability.description}',
                        
                        curtime(),
                        curtime(),
                        1
                    );`;

    conn.query(query).then(() => {});
};
ResponsabilityDAO.prototype.IncludeRelationResponsabilityArea = async function(
    req
) {
    let relation = req.body;
    relation.id = uuid.v1();

    let conn = new dbConn(true);

    query = `INSERT INTO tb_cargos_area 
                    (
                      id_cargo_area,
                      id_cargo,
                      id_area,
                      dt_cadastro
                      
                    )
                    VALUES 
                    (
                        '${relation.id}',
                        '${relation.id_responsability}',
                        '${relation.id_area}',
                        
                        curtime()
                        
                    );`;

    conn.query(query).then(() => {});
};

ResponsabilityDAO.prototype.IncludeRelationResponsabilityPermission = async function(req) {
    let relation = req.body;
    relation.id = uuid.v1();

    let conn = new dbConn(true);

    query = `INSERT INTO tb_cargos_permissoes
                    (
                      id_cargo_permissao,
                      id_cargo,
                      id_permissao,
                      dt_cadastro
                      
                    )
                    VALUES 
                    (
                        '${relation.id}',
                        '${relation.id_responsability}',
                        '${relation.id_permission}',
                        
                        curtime()
                        
                    );`;

    conn.query(query).then(() => {});
};

ResponsabilityDAO.prototype.Get = async() => {
    let conn = new dbConn(true);
    let query = `SELECT 
                  ID_CARGO AS id,
                    DS_CARGO AS name,
                    DATE_FORMAT(DT_CADASTRO ,'%d/%m/%Y') AS registerDate,
                    ID_STATUS AS statusCode
                FROM TB_CARGOS 
                WHERE ID_STATUS = 1;`;

    return conn.query(query).then((result) => {
        return result;
    });
};
ResponsabilityDAO.prototype.GetPermissions = async() => {
    let conn = new dbConn(true);
    let query = `select * from tb_permissoes
                `;

    return conn.query(query).then((result) => {
        return result;
    });
};

ResponsabilityDAO.prototype.GetResponsibilityArea = async() => {
    let conn = new dbConn(true);
    let query = `SELECT 
                    ID_CARGO_AREA AS id,
                    TG.ID_CARGO AS responsibilityId,
                    TG.DS_CARGO AS responsibilityName,
                    TA.ID_AREA AS areaId,
                    TA.DS_AREA AS areaName,
                    DATE_FORMAT(TGA.DT_CRIACAO ,'%d/%m/%Y') AS registerDate
                FROM TB_CARGOS_AREA TGA
                LEFT JOIN TB_AREAS TA 
                ON TGA.ID_AREA = TA.ID_AREA
                LEFT JOIN TB_CARGOS TG
                ON TGA.ID_CARGO = TG.ID_CARGO;`;

    return conn.query(query).then((result) => {
        return result;
    });
};
ResponsabilityDAO.prototype.ValidateByName = async(description) => {
    let conn = new dbConn(true);
    let query = `  SELECT ID_STATUS AS status FROM TB_CARGOS  WHERE ds_cargo = '${description}'`;
    return await conn.query(query).then(async(result) => {
        return AnalyzeResult(result);
    });
};

ResponsabilityDAO.prototype.UpdateStatus = async(status, id) => {
    let conn = new dbConn(true);
    let query = `UPDATE TB_CARGOS 
                 SET ID_STATUS = ${status} 
                 WHERE ID_CARGO = '${id}'`;
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
    return ResponsabilityDAO;
};