const dbConn = require("../../../Shared/DbConnectionMySQL");

function ScaleDAO() {}


ScaleDAO.prototype.Get = async() => {
    let conn = new dbConn(true);
    let query = `SELECT 				
                    ID_ESCALA as id,
                    DS_ESCALA AS name, 
                    NOTA AS grade 
                FROM TB_ESCALAS`;

    return conn.query(query).then((result) => {
        return result;
    });
};


ScaleDAO.prototype.Update = async(description, id) => {
    let conn = new dbConn(true);
    let query = `UPDATE TB_ESCALAS
                 SET DS_ESCALA = '${description}', 
                 DT_ALTERACAO =  curdate() 
                 WHERE ID_ESCALA = '${id}'`;

    conn.query(query).then(() => {});
};

ScaleDAO.prototype.ValidateByDescription = async(description) => {
    let conn = new dbConn(true);
    let query = `  SELECT ID_STATUS AS status FROM TB_ESCALAS  WHERE DS_ESCALA = '${description}'`;
    return await conn.query(query).then(async(result) => {
        return AnalyzeResult(result);
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

module.exports = () => {
    return ScaleDAO;
};