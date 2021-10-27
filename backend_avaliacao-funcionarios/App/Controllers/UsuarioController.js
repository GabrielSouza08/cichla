module.exports = (application) => {
  application.get("/usuarios", (req, res) => {
    let UsuariosDAO = new application.App.Models.UsuariosDAO();
    UsuariosDAO.consultarUsers(req, res);
  });
  application.post("/usuarios/cadastrar", (req, res) => {
    let UsuariosDAO = new application.App.Models.UsuariosDAO();
    UsuariosDAO.inserirUser(req, res);
  });
  application.put("/usuarios/:id", (req, res) => {
    let Usuarios = new application.App.Models.UsuariosDAO();
    Usuarios.atualizarUser(req, res);
  });
  application.delete("/usuarios/:id", (req, res) => {
    let Usuarios = new application.app.models.UsuariosDAO();
    Usuarios.desativarUser(req, res);
  });
  application.post("/usuarios/autenticar", (req, res) => {
    let Usuarios = new application.App.Models.UsuariosDAO();
    Usuarios.autenticarUser(req, res);
  });
};
