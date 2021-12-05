/* Application/Controllers/ResponsabilityController.js */
var shared = require('../../Shared/Constants.js');

var _shared = new shared();

module.exports = (application) => {
    application.post("/cargo/cadastrar", (req, res) => {
        let _responsabilityServices =
            new application.Domain.Services.ResponsabilityServices(application);
        let _responsabilityRepository =
            new application.Infra.Data.Repositories.ResponsabilityDAO();
        try {
            _responsabilityServices.Include(req, res, _responsabilityRepository);
        } catch (err) {
            res = _shared.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
            );
        }
    });
    application.post("/cargo/cadastrar-cargo-area", (req, res) => {
        let _responsabilityServices =
            new application.Domain.Services.ResponsabilityServices(application);
        let _responsabilityRepository =
            new application.Infra.Data.Repositories.ResponsabilityDAO();
        try {
            _responsabilityServices.ControlRelationResponsibilityArea(
                req,
                res,
                _responsabilityRepository
            );
        } catch (err) {
            res = _shared.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
            );
        }
    });
    application.post("/cargo/cadastrar-cargo-permissao", (req, res) => {
        let _responsabilityServices =
            new application.Domain.Services.ResponsabilityServices(application);
        let _responsabilityRepository =
            new application.Infra.Data.Repositories.ResponsabilityDAO();
        try {
            _responsabilityServices.ControlRelationResponsibilityPermission(
                req,
                res,
                _responsabilityRepository
            );
        } catch (err) {
            res = _shared.NotificationTemplate(
                false, [],
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
            res = _shared.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo consulta. error: ${err.message}`
            );
        }
    });
    application.get("/cargo/relacao-area", (req, res) => {
        let _responsabilityServices =
            new application.Domain.Services.ResponsabilityServices(application);
        let _responsabilityRepository =
            new application.Infra.Data.Repositories.ResponsabilityDAO();
        try {
            _responsabilityServices.GetRelationResponsibilityArea(res, _responsabilityRepository);
        } catch (err) {
            res = _shared.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo consulta. error: ${err.message}`
            );
        }
    });
    application.get("/cargo/relacao-permissao", (req, res) => {
        let _responsabilityServices =
            new application.Domain.Services.ResponsabilityServices(application);
        let _responsabilityRepository =
            new application.Infra.Data.Repositories.ResponsabilityDAO();
        try {
            _responsabilityServices.GetResponsibilityPermission(res, _responsabilityRepository);
        } catch (err) {
            res = _shared.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo consulta. error: ${err.message}`
            );
        }
    });
    application.get("/cargo/permissao", (req, res) => {
        let _responsabilityServices =
            new application.Domain.Services.ResponsabilityServices(application);
        let _responsabilityRepository =
            new application.Infra.Data.Repositories.ResponsabilityDAO();
        try {
            _responsabilityServices.GetPermission(res, _responsabilityRepository);
        } catch (err) {
            res = _shared.NotificationTemplate(
                false, [],
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
            res = _shared.NotificationTemplate(
                false, [],
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
            res = _shared.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de ativação. error: ${err.message}`
            );
        }
    });
}