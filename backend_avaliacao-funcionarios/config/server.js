/* importar o módulo do framework express */
const express = require("express");
const bodyParser = require("body-parser");
/* importar o módulo do consign */
const consign = require("consign");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* configurar o middleware body-parser */

consign().include("app/routes").then("app/models").into(app);

module.exports = app;
