const dbConn = require("../../../Shared/DbConnectionMySQL");
var shared = require('../../../Shared/Constants.js');

var _shared = new shared();

function ScaleDAO() {}


ScaleDAO.prototype.Get = async() => {
    let conn = new dbConn(true);
    let query = `SELECT 				
                ID_ESCALA as id,
                DS_ESCALA AS description, 
                NOTA AS value, 
                'Evaluation Colaborator' AS type,
                DATE_FORMAT(DT_CADASTRO,'%d/%m/%Y') AS registerDate,
                DATE_FORMAT(DT_ALTERACAO,'%d/%m/%Y') AS changeDate,
                ID_STATUS as statusCode
                FROM TB_ESCALAS`;

    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return data;
};


ScaleDAO.prototype.Update = async(description, id) => {
    let conn = new dbConn(true);
    let query = `UPDATE TB_ESCALAS
                 SET DS_ESCALA = '${description}', 
                 DT_ALTERACAO =  curdate() 
                 WHERE ID_ESCALA = '${id}'`;

    conn.query(query).then(() => {});
    conn.close();
};

ScaleDAO.prototype.ValidateByDescription = async(description) => {
    let conn = new dbConn(true);
    let query = `  SELECT ID_STATUS AS status FROM TB_ESCALAS  WHERE DS_ESCALA = '${description}'`;
    let data = await conn.query(query).then((result) => {
        return result;
    });

    conn.close();
    return _shared.AnalyzeResult(data);
};

module.exports = () => {
    return ScaleDAO;
};