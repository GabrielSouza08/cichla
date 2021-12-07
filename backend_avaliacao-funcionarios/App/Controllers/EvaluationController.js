/* Application/Controllers/AreaController.js */
module.exports = (application) => {
    application.post("/avaliacao", (req, res) => {
        let _evaluationServices = new application.Domain.Services.EvaluationService();
        let _repositories = application.Infra.Data.Repositories;
        try {
            _evaluationServices.RegisterOrChange(req, res, _repositories);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
            );
        }
    });

    application.get("/questoes-avalicao/:evaluatorId", (req, res) => {
        let _evaluationServices = new application.Domain.Services.EvaluationService();
        let _repositories = application.Infra.Data.Repositories;
        try {
            _evaluationServices.GetQuestions(req, res, _repositories);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
            );
        }
    });

    application.get("/avaliacao/relatorio/:evaluatorId", (req, res) => {
        let _evaluationServices = new application.Domain.Services.EvaluationService();
        let _repositories = application.Infra.Data.Repositories;
        try {
            _evaluationServices.GetEvaluationCompleted(req, res, _repositories);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
            );
        }
    });

    application.get("/escalas", (req, res) => {
        let _evaluationServices = new application.Domain.Services.EvaluationService();
        let _repositories = application.Infra.Data.Repositories;
        try {
            _evaluationServices.GetScales(req, res, _repositories);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
            );
        }
    });

    application.put("/escalas", (req, res) => {
        let _evaluationServices = new application.Domain.Services.EvaluationService();
        let _repositories = application.Infra.Data.Repositories;
        try {
            _evaluationServices.UpdateScales(req, res, _repositories);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
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