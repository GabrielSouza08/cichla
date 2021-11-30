/* Application/Controllers/AreaController.js */
module.exports = (application) => {
    application.post("/area/cadastrar", (req, res) => {
        let _questionServices = new application.Domain.Services.QuestionService();
        let _questionRepository = new application.Infra.Data.Repositories.AreaDAO();
        try {
            _questionServices.Include(req, res, _questionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
            );
        }
    });

    application.get("/area: areaId", (req, res) => {
        let _questionServices = new application.Domain.Services.QuestionService();
        let _questionRepository = new application.Infra.Data.Repositories.AreaDAO();
        try {
            _questionServices.Get(req, res, _questionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo consulta. error: ${err.message}`
            );
        }
    });

    application.put("/area", (req, res) => {
        let _questionServices = new application.Domain.Services.QuestionService(
            application
        );
        let _questionRepository = new application.Infra.Data.Repositories.AreaDAO();

        try {
            _questionServices.Update(req, res, _questionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de atualização. error: ${err.message}`
            );
        }
    });

    application.delete("/area/:id", (req, res) => {
        let _questionServices = new application.Domain.Services.QuestionService(
            application
        );
        let _questionRepository = new application.Infra.Data.Repositories.AreaDAO();

        try {
            _questionServices.Disable(req, res, _questionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de desabilitação. error: ${err.message}`
            );
        }
    });

    application.put("/area/ativar", (req, res) => {
        let _questionServices = new application.Domain.Services.QuestionService(
            application
        );
        let _questionRepository = new application.Infra.Data.Repositories.AreaDAO();

        try {
            _questionServices.Activate(req, res, _questionRepository);
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