const dbConn = require("../../../Shared/DbConnection");
const uuid = require("uuid");

function UserDAO() {}

UserDAO.prototype.Include = async function(req) {
    let user = req.body;
    user.id = uuid.v1();

    let conn = new dbConn(true);

    query = `INSERT INTO tb_usuarios  
                    (
                      id_usuario,
                      nome,
                      email,
                      senha,
                      id_avaliador,
                      id_cargo,
                      id_area,
                      dt_cadastro,
                      dt_alteracao,
                      id_status
                    )
                    VALUES 
                    (
                        '${user.id}',
                        '${user.name}',
                        '${user.email}',
                        '${user.password}',
                        '${user.avaliatorId}',
                        '${user.responsibilitId}',
                        '${user.areaId}',
                        curtime(),
                        curtime(),
                        1
                    );`;

    conn.query(query).then(() => {});
};

UserDAO.prototype.GetIdByEmail = async function(email) {
    let conn = new dbConn(true);

    query = `SELECT Id_usuario as id
             FROM TB_USUARIOS
             WHERE EMAIL = "${email}";`;

    return conn.query(query).then((result) => { return result[0].id });
};

UserDAO.prototype.GetPermissions = async(id) => {
    let conn = new dbConn(true);
    let query = `SELECT 
    ID_PERMISSAO  		AS id		
    FROM TB_CARGOS_PERMISSOES
    WHERE ID_CARGO = "${id}"`;

    return conn.query(query).then((result) => { return result });
};


UserDAO.prototype.Authenticator = async(email) => {
    let conn = new dbConn(true);

    let query = `SELECT 
    USER.id_usuario AS id,
    USER.nome       As name,
    USER.email      AS email,
    USER.senha      AS password,
    USER.id_cargo   AS responsibilityId,
    USER.id_status   AS status

    FROM TB_USUARIOS AS USER
    INNER JOIN TB_CARGOS AS RESPONSIBILITY
    ON RESPONSIBILITY.ID_CARGO = USER.ID_CARGO
    WHERE USER.EMAIL = "${email}";`;

    return conn.query(query).then((result) => {
        return {
            result: [...result],
            analysis: AnalyzeResult(result)
        }
    });
};

UserDAO.prototype.Get = async(id = '') => {
    let filter = (id == '') ? "" : `WHERE ID_USUARIO = '${id}'`;
    let conn = new dbConn(true);
    let query = `SELECT 
                      USER.id_usuario      AS id,
                      USER.nome            AS name,
                      USER.email           AS email,
                      USER.senha           AS password,
                      USER.id_avaliador    AS evaluatorId,
                      AVALIATOR.nome       AS evaluatorName,
                      CARGO.id_cargo       AS responsibilityId,
                      CARGO.ds_cargo       AS nameReponsability,
                      USER.id_area         AS areaId,
                      AREA.ds_area         AS nameArea,
                      DPT.id_departamento  AS department,
                      DPT.ds_departamento  AS nameDepartament,
                      USER.dt_cadastro     AS registerDate,
                      USER.dt_alteracao    AS changeDate,
                      USER.id_status       AS statusCode,
                      STATUS.ds_status     AS typeStatus
                    FROM tb_usuarios AS USER
                    LEFT JOIN tb_cargos AS CARGO
                    ON USER.id_cargo = CARGO.id_cargo
                    LEFT JOIN tb_status as STATUS
                    ON USER.id_status = STATUS.id_status
                    LEFT JOIN tb_areas as AREA
                    ON USER.id_area = AREA.id_area
                    LEFT JOIN tb_departamentos AS DPT
                    ON AREA.id_departamento = DPT.id_departamento
                    LEFT JOIN tb_usuarios as AVALIATOR
                    ON USER.id_avaliador = AVALIATOR.id_usuario
                    ${filter}`;

    return conn.query(query).then((result) => { return result; });
};

UserDAO.prototype.UpdateStatus = async(status, id) => {
    let conn = new dbConn(true);
    let query = `UPDATE TB_USUARIOS 
                 SET ID_STATUS = ${status} 
                 WHERE ID_USUARIO = '${id}'`;
    conn.query(query).then(() => {});
};

UserDAO.prototype.Update = async function(req, isChangePassword) {
    let user = req.body;
    let parameter = (isChangePassword) ? `senha = '${user.password}',` : "";
    let conn = new dbConn(true);

    query = `UPDATE TB_USUARIOS SET
              ${parameter}
              nome = '${user.name}',
              email = '${user.email}',
              id_avaliador = '${user.avaliatorId}',
              id_cargo = '${user.responsibilityId}',
              id_area = '${user.areaId}',
              dt_alteracao = curtime()              
              WHERE ID_USUARIO = '${user.id}'
              `;

    conn.query(query).then(() => {});
};

UserDAO.prototype.ExistenceValidationByEmail = async function(email) {
    let conn = new dbConn(true);

    let query = `SELECT 
                    ID_STATUS AS status
                    FROM TB_USUARIOS
                    WHERE EMAIL = "${email}";`;

    return await conn.query(query)
        .then(async(result) => {
            return AnalyzeResult(result);
        });
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
    let index = (array[0] == undefined ? 0 : array.length)

    if (index == 0)
        return { status: false, count: index }

    return {
        status: (index == 1 && array[index - 1].status == 1) ? true : false,
        count: index
    }
};

//#endregion

module.exports = () => {
    return UserDAO;
};