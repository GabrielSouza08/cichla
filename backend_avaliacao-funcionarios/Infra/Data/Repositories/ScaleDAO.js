const dbConn = require("../../../Shared/DbConnectionMySQL");

function ScaleDAO() {}


ScaleDAO.prototype.Get = async() => {
    let conn = new dbConn(true);
    let query = `SELECT 				
                    ID_ESCALA as id,
                    DS_ESCALA AS name, 
                    NOTA AS grade 
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