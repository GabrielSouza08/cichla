require('dotenv').config()
const { DB_DATABASE } = process.env;


(async() => {
    ValidationDb = require("../../3-Infra/Data/Migrations/ValidationsDb.js");
    CreateDataBase = require("../../3-Infra/Data/Migrations/CreateDataBase.js");
    CreateTables = require("../../3-Infra/Data/Migrations/CreateTables.js");

    let status = await ValidationDb();
    if (!status) {
        await CreateDataBase();

        await CreateTables()
            .then(async() => {
                setTimeout(function() {
                    CreateDataFeed = require("../../3-Infra/Data/Migrations/CreateDataFeed.js");
                    CreateDataFeed();
                    console.log(`BASE DADOS CRIADA. NOME: ${DB_DATABASE}.`);
                    console.log(`DADOS DE CONFIGURAÇÃO CARREGADOS.`);
                }, 4000)
            });

    } else
        console.log(`BASE DADOS CONFIRMADA. NOME: ${DB_DATABASE}.`);

})()