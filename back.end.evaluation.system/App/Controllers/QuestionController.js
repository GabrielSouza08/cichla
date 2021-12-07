/* Application/Controllers/AreaController.js */
module.exports = (application) => {
    application.post("/questao/cadastrar", (req, res) => {
        let _questionServices = new application.Domain.Services.QuestionService();
        let _questionRepository = new application.Infra.Data.Repositories.QuestionDAO();
        try {
            _questionServices.Include(req, res, _questionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
            );
        }
    });

    application.get("/questao", (req, res) => {
        let _questionServices = new application.Domain.Services.QuestionService();
        let _questionRepository = new application.Infra.Data.Repositories.QuestionDAO();
        try {
            _questionServices.Get(res, _questionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo consulta. error: ${err.message}`
            );
        }
    });

    application.get("/questao/by-area/:areaId", (req, res) => {
        let _questionServices = new application.Domain.Services.QuestionService();
        let _questionRepository = new application.Infra.Data.Repositories.QuestionDAO();
        try {
            _questionServices.GetByAreaId(req, res, _questionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo consulta. error: ${err.message}`
            );
        }
    });

    application.get("/questao/quantidade", (req, res) => {
        let _questionServices = new application.Domain.Services.QuestionService();
        let _questionRepository = new application.Infra.Data.Repositories.QuestionDAO();
        try {
            _questionServices.GetQuantity(res, _questionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo consulta. error: ${err.message}`
            );
        }
    });

    application.put("/questao/editar", (req, res) => {
        let _questionServices = new application.Domain.Services.QuestionService(
            application
        );
        let _questionRepository = new application.Infra.Data.Repositories.QuestionDAO();

        try {
            _questionServices.Update(req, res, _questionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de atualização. error: ${err.message}`
            );
        }
    });

    application.delete("/questao/:id", (req, res) => {
        let _questionServices = new application.Domain.Services.QuestionService(
            application
        );
        let _questionRepository = new application.Infra.Data.Repositories.QuestionDAO();

        try {
            _questionServices.Disable(req, res, _questionRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de desabilitação. error: ${err.message}`
            );
        }
    });

    application.put("/questao/ativar", (req, res) => {
        let _questionServices = new application.Domain.Services.QuestionService(
            application
        );
        let _questionRepository = new application.Infra.Data.Repositories.QuestionDAO();

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