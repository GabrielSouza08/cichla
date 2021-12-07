/* Application/Controllers/evaluationController.js */
module.exports = (application) => {
    application.post("/marcador/cadastrar", (req, res) => {
        let _EvaluationMarkersServices =
            new application.Domain.Services.EvaluationMarkersServices(application);
        let _evaluationRepository =
            new application.Infra.Data.Repositories.EvaluationMarkersDAO();
        try {
            _EvaluationMarkersServices.Include(req, res, _evaluationRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
            );
        }
    });

    application.get("/marcador", (req, res) => {
        let _EvaluationMarkersServices =
            new application.Domain.Services.EvaluationMarkersServices(application);
        let _evaluationRepository =
            new application.Infra.Data.Repositories.EvaluationMarkersDAO();
        try {
            _EvaluationMarkersServices.Get(res, _evaluationRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo consulta. error: ${err.message}`
            );
        }
    });

    application.delete("/marcador/:id", (req, res) => {
        let _EvaluationMarkersServices =
            new application.Domain.Services.EvaluationMarkersServices(application);
        let _evaluationRepository =
            new application.Infra.Data.Repositories.EvaluationMarkersDAO();

        try {
            _EvaluationMarkersServices.Disable(req, res, _evaluationRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de desabilitação. error: ${err.message}`
            );
        }
    });

    application.put("/marcador/ativar", (req, res) => {
        let _EvaluationMarkersServices =
            new application.Domain.Services.EvaluationMarkersServices(application);
        let _evaluationRepository =
            new application.Infra.Data.Repositories.EvaluationMarkersDAO();

        try {
            _EvaluationMarkersServices.Activate(req, res, _evaluationRepository);
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