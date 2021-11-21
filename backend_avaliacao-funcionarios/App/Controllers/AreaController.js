/* Application/Controllers/AreaController.js */
module.exports = (application) => {
  application.post("/area/cadastrar", (req, res) => {
    let _areaServices = new application.Domain.Services.AreaServices();
    let _areaRepository = new application.Infra.Data.Repositories.AreaDAO();
    try {
      _areaServices.Include(req, res, _areaRepository);
    } catch (err) {
      res = this.NotificationTemplate(
        false,
        [],
        `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
      );
    }
  });

  application.get("/area", (req, res) => {
    let _areaServices = new application.Domain.Services.AreaServices();
    let _areaRepository = new application.Infra.Data.Repositories.AreaDAO();
    try {
      _areaServices.Get(res, _areaRepository);
    } catch (err) {
      res = this.NotificationTemplate(
        false,
        [],
        `Ocorreu uma exceção no processo consulta. error: ${err.message}`
      );
    }
  });

  application.put("/area", (req, res) => {
    let _areaServices = new application.Domain.Services.AreaServices(
      application
    );
    let _areaRepository = new application.Infra.Data.Repositories.AreaDAO();

    try {
      _areaServices.Update(req, res, _areaRepository);
    } catch (err) {
      res = this.NotificationTemplate(
        false,
        [],
        `Ocorreu uma exceção no processo de atualização. error: ${err.message}`
      );
    }
  });

  application.delete("/area/:id", (req, res) => {
    let _areaServices = new application.Domain.Services.AreaServices(
      application
    );
    let _areaRepository = new application.Infra.Data.Repositories.AreaDAO();

    try {
      _areaServices.Disable(req, res, _areaRepository);
    } catch (err) {
      res = this.NotificationTemplate(
        false,
        [],
        `Ocorreu uma exceção no processo de desabilitação. error: ${err.message}`
      );
    }
  });

  application.put("/area/ativar", (req, res) => {
    let _areaServices = new application.Domain.Services.AreaServices(
      application
    );
    let _areaRepository = new application.Infra.Data.Repositories.AreaDAO();

    try {
      _areaServices.Activate(req, res, _areaRepository);
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
