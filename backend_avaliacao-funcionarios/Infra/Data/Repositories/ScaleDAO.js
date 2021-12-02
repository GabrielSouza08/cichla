const dbConn = require("../../../Shared/DbConnectionMySQL");

function ScaleDAO() {}


ScaleDAO.prototype.Get = async() => {
    let conn = new dbConn(true);
    let query = `SELECT 
                    DS_ESCALA AS name, 
                    NOTA AS grade 
                FROM TB_ESCALAS`;

    return conn.query(query).then((result) => {
        return result;
    });
};


ScaleDAO.prototype.Update = async(status, id) => {
    let conn = new dbConn(true);
    let query = `UPDATE TB_ESCALAS
                 SET DS_ESCALA = ${description}, 
                 DT_ALTERACAO =  curdate() 
                 WHERE ID_ESCALA = '${id}'`;

    conn.query(query).then(() => {});
};

module.exports = () => {
    return ScaleDAO;
};