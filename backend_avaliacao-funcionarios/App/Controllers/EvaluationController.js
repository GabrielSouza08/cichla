/* Application/Controllers/AreaController.js */
module.exports = (application) => {
    application.post("/avaliacao", (req, res) => {
        let _evaluationServices = new application.Domain.Services.EvaluationService();
        let _repositories = application.Infra.Data.Repositories;
        try {
            _evaluationServices.Initialize(req, res, _repositories);
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