/* Application/Controllers/UserControllers.js */
module.exports = (application) => {
  application.post("/usuarios/cadastrar", (req, res) => {
    let _userServices = new application.Domain.Services.UserServices(
      application
    );
    let _userRepository = new application.Infra.Data.Repositories.UserDAO();
    try {
      _userServices.Include(req, res, _userRepository);
    } catch (err) {
      res = this.NotificationTemplate(
        false,
        [],
        `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
      );
    }
  });

  application.get("/usuarios", (req, res) => {
    let _userServices = new application.Domain.Services.UserServices(
      application
    );
    let _userRepository = new application.Infra.Data.Repositories.UserDAO();
    try {
      _userServices.Get(res, _userRepository);
    } catch (err) {
      res = this.NotificationTemplate(
        false,
        [],
        `Ocorreu uma exceção no processo consulta. error: ${err.message}`
      );
    }
  });

  application.post("/usuarios/autenticar", (req, res) => {
    let _userServices = new application.Domain.Services.UserServices(
      application
    );
    let _userRepository = new application.Infra.Data.Repositories.UserDAO();

    try {
      _userServices.Authenticator(req, res, _userRepository);
    } catch (err) {
      res = this.NotificationTemplate(
        false,
        [],
        `Ocorreu uma exceção no processo de autenticação. error: ${err.message}`
      );
    }
  });

  application.put("/usuarios", (req, res) => {
    let _userServices = new application.Domain.Services.UserServices(
      application
    );
    let _userRepository = new application.Infra.Data.Repositories.UserDAO();

    try {
      _userServices.Update(req, res, _userRepository);
    } catch (err) {
      res = this.NotificationTemplate(
        false,
        [],
        `Ocorreu uma exceção no processo de atualização. error: ${err.message}`
      );
    }
  });

  application.delete("/usuarios/:id", (req, res) => {
    let _userServices = new application.Domain.Services.UserServices(
      application
    );
    let _userRepository = new application.Infra.Data.Repositories.UserDAO();

    try {
      _userServices.Disable(req, res, _userRepository);
    } catch (err) {
      res = this.NotificationTemplate(
        false,
        [],
        `Ocorreu uma exceção no processo de remoção. error: ${err.message}`
      );
    }
  });

  application.put("/usuarios/ativar/:id", (req, res) => {
    let _userServices = new application.Domain.Services.UserServices(
      application
    );
    let _userRepository = new application.Infra.Data.Repositories.UserDAO();

    try {
      _userServices.Activate(req, res, _userRepository);
    } catch (err) {
      res = this.NotificationTemplate(
        false,
        [],
        `Ocorreu uma exceção no processo de ativação. error: ${err.message}`
      );
    }
  });

  this.NotificationTemplate = function (_status, _data, _message) {
    return {
      status: _status,
      data: _data,
      msg: [{ text: _message }],
    };
  };
};
