/* importar o módulo do framework express */
const express = require("express");
var cors = require('cors')

/* importar o módulo do consign */
const consign = require("consign");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    app.use(cors());
    next()
});

/* configurar o middleware body-parser */

consign().include("1-App/Controllers").then("3-Infra/Data/Repositories").into(app);

module.exports = app;