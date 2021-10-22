// const conn = require("../../config/dbConn");


CreateDataBase = require("../../3-Infra/Data/Migrations/CreateDataBase.js");
CreateTables = require("../../3-Infra/Data/Migrations/CreateDependentTables.js");

CreateDataBase();
setTimeout(function() { CreateTables(); }, 3000);
console.log("pronto!");

module.exports = (application) => {
    application.get("/usuarios", (req, res) => {
        let Usuarios = new application.app.models.UsuariosDAO();

        Usuarios.getUsuarios(req, res);
    });
    application.post("/usuarios/cadastrar", (req, res) => {
        let Usuarios = new application.app.models.UsuariosDAO();
        Usuarios.cadastrarUser(req, res);
    });
    application.put("/usuarios/:id", (req, res) => {
        let Usuarios = new application.app.models.UsuariosDAO();
        Usuarios.atualizarUser(req, res);
    });
    application.delete("/usuarios/:id", (req, res) => {
        let Usuarios = new application.app.models.UsuariosDAO();
        Usuarios.deletarUser(req, res);
    });
    application.post("/usuarios/autenticar", (req, res) => {
        let Usuarios = new application.app.models.UsuariosDAO();
        Usuarios.autenticarUser(req, res);
    });
};