/* Application/Controllers/ResponsabilityController.js */
module.exports = (application) => {
  application.post("/cargo/cadastrar", (req, res) => {
    let _cargoServices = new application.Domain.Services.CargoServices(
      application
    );
    let _cargoRepository = new application.Infra.Data.Repositories.CargoDAO();
    try {
      _cargoServices.Include(req, res, _cargoRepository);
    } catch (err) {
      res = this.NotificationTemplate(
        false,
        [],
        `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
      );
    }
  });

  application.get("/cargo", (req, res) => {
    let _cargoServices = new application.Domain.Services.CargoServices(
      application
    );
    let _cargoRepository = new application.Infra.Data.Repositories.CargoDAO();
    try {
      _cargoServices.Get(res, _cargoRepository);
    } catch (err) {
      res = this.NotificationTemplate(
        false,
        [],
        `Ocorreu uma exceção no processo consulta. error: ${err.message}`
      );
    }
  });

  application.delete("/cargo/:id", (req, res) => {
    let _cargoServices = new application.Domain.Services.CargoServices(
      application
    );
    let _cargoRepository = new application.Infra.Data.Repositories.CargoDAO();

    try {
      _cargoServices.Disable(req, res, _cargoRepository);
    } catch (err) {
      res = this.NotificationTemplate(
        false,
        [],
        `Ocorreu uma exceção no processo de desabilitação. error: ${err.message}`
      );
    }
  });

  application.put("/cargo/ativar", (req, res) => {
    let _cargoServices = new application.Domain.Services.CargoServices(
      application
    );
    let _cargoRepository = new application.Infra.Data.Repositories.CargoDAO();

    try {
      _cargoServices.Activate(req, res, _cargoRepository);
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
