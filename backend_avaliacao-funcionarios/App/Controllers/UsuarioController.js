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
    let UsuariosDAO = new application.App.Models.UsuariosDAO();
    UsuariosDAO.atualizarUser(req, res);
  });
  application.delete("/usuarios/:id", (req, res) => {
    let UsuariosDAO = new application.app.models.UsuariosDAO();
    UsuariosDAO.desativarUser(req, res);
  });
  application.post("/usuarios/autenticar", (req, res) => {
    let UsuariosDAO = new application.App.Models.UsuariosDAO();
    UsuariosDAO.autenticarUser(req, res);
  });
  application.put("/usuarios/ativar/:id", (req, res) => {
    let UsuariosDAO = new application.App.Models.UsuariosDAO();
    UsuariosDAO.ativarUser(req, res);
  });
};
