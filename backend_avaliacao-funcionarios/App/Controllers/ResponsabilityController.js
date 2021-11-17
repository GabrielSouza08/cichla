/* Application/Controllers/ResponsabilityController.js */
module.exports = (application) => {
  application.post("/cargo/cadastrar", (req, res) => {
    let _responsabilityServices =
      new application.Domain.Services.ResponsabilityServices(application);
    let _responsabilityRepository =
      new application.Infra.Data.Repositories.ResponsabilityDAO();
    try {
      _responsabilityServices.Include(req, res, _responsabilityRepository);
    } catch (err) {
      res = this.NotificationTemplate(
        false,
        [],
        `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
      );
    }
  });

  application.get("/cargo", (req, res) => {
    let _responsabilityServices =
      new application.Domain.Services.ResponsabilityServices(application);
    let _responsabilityRepository =
      new application.Infra.Data.Repositories.ResponsabilityDAO();
    try {
      _responsabilityServices.Get(res, _responsabilityRepository);
    } catch (err) {
      res = this.NotificationTemplate(
        false,
        [],
        `Ocorreu uma exceção no processo consulta. error: ${err.message}`
      );
    }
  });

  application.delete("/cargo/:id", (req, res) => {
    let _responsabilityServices =
      new application.Domain.Services.ResponsabilityServices(application);
    let _responsabilityRepository =
      new application.Infra.Data.Repositories.ResponsabilityDAO();

    try {
      _responsabilityServices.Disable(req, res, _responsabilityRepository);
    } catch (err) {
      res = this.NotificationTemplate(
        false,
        [],
        `Ocorreu uma exceção no processo de desabilitação. error: ${err.message}`
      );
    }
  });

  application.put("/cargo/ativar", (req, res) => {
    let _responsabilityServices =
      new application.Domain.Services.ResponsabilityServices(application);
    let _responsabilityRepository =
      new application.Infra.Data.Repositories.ResponsabilityDAO();

    try {
      _responsabilityServices.Activate(req, res, _responsabilityRepository);
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
