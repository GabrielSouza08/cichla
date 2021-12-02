/* Application/Controllers/CriterionController.js */
module.exports = (application) => {
    application.post("/criterio/cadastrar", (req, res) => {
        let _criterionServices = new application.Domain.Services.CriterionService();
        let _criterionRepository = new application.Infra.Data.Repositories.CriterionDAO();
        try {
            _criterionServices.Include(req, res, _criterionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
            );
        }
    });

    application.post("/criterio/relacao-area", (req, res) => {
        let _criterionServices = new application.Domain.Services.CriterionService();
        let _criterionRepository = new application.Infra.Data.Repositories.CriterionDAO();
        try {
            _criterionServices.ControlRelationshipAreaCriterion(req, res, _criterionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
            );
        }
    });

    application.get("/criterio", (req, res) => {
        let _criterionServices = new application.Domain.Services.CriterionService();
        let _criterionRepository = new application.Infra.Data.Repositories.CriterionDAO();
        try {
            _criterionServices.Get(res, _criterionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo consulta. error: ${err.message}`
            );
        }
    });

    application.get("/criterio/relacao-area", (req, res) => {
        let _criterionServices = new application.Domain.Services.CriterionService();
        let _criterionRepository = new application.Infra.Data.Repositories.CriterionDAO();
        try {
            _criterionServices.GetRelationshipAreaCriterion(res, _criterionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo consulta. error: ${err.message}`
            );
        }
    });

    application.put("/criterio", (req, res) => {
        let _criterionServices = new application.Domain.Services.CriterionService(
            application
        );
        let _criterionRepository = new application.Infra.Data.Repositories.CriterionDAO();

        try {
            _criterionServices.Update(req, res, _criterionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de atualização. error: ${err.message}`
            );
        }
    });

    application.delete("/criterio/:id", (req, res) => {
        let _criterionServices = new application.Domain.Services.CriterionService(
            application
        );
        let _criterionRepository = new application.Infra.Data.Repositories.CriterionDAO();

        try {
            _criterionServices.Disable(req, res, _criterionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de desabilitação. error: ${err.message}`
            );
        }
    });

    application.put("/criterio/ativar", (req, res) => {
        let _criterionServices = new application.Domain.Services.CriterionService(
            application
        );
        let _criterionRepository = new application.Infra.Data.Repositories.CriterionDAO();

        try {
            _criterionServices.Activate(req, res, _criterionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de ativação. error: ${err.message}`
            );
        }
    });

    this.NotificationTemplate = function(_status, _data, _message) {
        return {
            success: _status,
            data: _data,
            msg: [{ text: _message }],
        };
    };
};