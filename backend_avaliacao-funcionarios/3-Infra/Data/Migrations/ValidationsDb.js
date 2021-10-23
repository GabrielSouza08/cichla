/* infra/data/creates/CreateDataBase*/
require('dotenv').config()
const { DB_DATABASE } = process.env;

module.exports = ValidationDb = function() {

    var t = this;
    t.connection = require("../../../4-Shared/dbConn");

    t.scriptBaseStatusConfirmation = `
                                      SELECT 
                                      SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA as data
                                      WHERE SCHEMA_NAME="${DB_DATABASE}"
                                    `;


    t.StatusDataBaseCreate = function() {
        var status = false;

        var data = t.connection(false).query(t.scriptBaseStatusConfirmation,
            function(error, results) {
                if (error) throw new Error(`Erro na validação do da existencia da base de dados`);

                return status;
            }
        );
        if (data)
            status = true;

        return status;
    }

    var start = function() {
        return t.StatusDataBaseCreate();
    };

    return start();
}