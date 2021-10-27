/* infra/data/creates/CreateDataBase*/
require("dotenv").config();
const { DB_DATABASE } = process.env;

module.exports = ValidationDb = async () => {
  var t = this;
  let accessDb = require("../../../Shared/DbConnection");
  t.DataBese = new accessDb(false);

  t.scriptBaseStatusConfirmation = `
                                      SELECT 
                                      SCHEMA_NAME as data
                                      FROM INFORMATION_SCHEMA.SCHEMATA
                                      WHERE SCHEMA_NAME="${DB_DATABASE}"
                                    `;

  t.validation = async () => {
    let someRows = [Object];
    return await t.DataBese.query(t.scriptBaseStatusConfirmation)
      .then(
        (rows) => {
          someRows = rows;
        },
        (err) => {
          return t.DataBese.close().then(() => {
            throw `$Validation: ${err}`;
          });
        }
      )
      .then(() => {
        if (someRows[0]) return true;
        else return false;
      })
      .catch((err) => {
        console.log("Validation Database - MESSAGE:", err.message);
      });
  };

  var execute = async () => {
    let status = await t.validation();
    t.DataBese.close();
    return status;
  };

  return await execute();
};
