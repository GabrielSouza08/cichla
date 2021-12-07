require('dotenv').config()
const { DB_DATABASE } = process.env;


(async() => {
    ValidationDb = require("./ValidationsDb.js");
    CreateDataBase = require("./CreateDataBase.js");
    CreateTables = require("./CreateTables.js");

    let status = await ValidationDb();
    if (!status) {
        await CreateDataBase();

        await CreateTables()
            .then(async() => {
                setTimeout(function() {
                    CreateDataFeed = require("./CreateDataFeed.js");
                    CreateDataFeed();
                    console.log(`BASE DADOS CRIADA. NOME: ${DB_DATABASE}.`);
                    console.log(`DADOS DE CONFIGURAÇÃO CARREGADOS.`);
                }, 4000)
            });

    } else
        console.log(`BASE DADOS CONFIRMADA. NOME: ${DB_DATABASE}.`);

})()