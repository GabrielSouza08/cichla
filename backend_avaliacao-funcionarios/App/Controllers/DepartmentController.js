/* Application/Controllers/DepartmentController.js */
module.exports = (application) => {
    application.post("/departamento/cadastrar", (req, res) => {
        let _userServices = new application.Domain.Services.UserServices(application);
        let _userRepository = new application.Infra.Data.Repositories.UserDAO();
        try {
            _userServices.Include(req, res, _userRepository);
        } catch (err) {
            res = this.NotificationTemplate(false, [], `Ocorreu uma execeção no processo de cadastro. error: ${err.message}`)
        }
    });

    application.get("/departamento", (req, res) => {
        let _userServices = new application.Domain.Services.UserServices(application);
        let _userRepository = new application.Infra.Data.Repositories.UserDAO();
        try {
            _userServices.Get(res, _userRepository);
        } catch (err) {
            res = this.NotificationTemplate(false, [], `Ocorreu uma execeção no processo consulta. error: ${err.message}`)
        }
    });

    application.post("/departamento/autenticar", (req, res) => {
        let _userServices = new application.Domain.Services.UserServices(application);
        let _userRepository = new application.Infra.Data.Repositories.UserDAO();

        try {
            _userServices.Authenticator(req, res, _userRepository);
        } catch (err) {
            res = this.NotificationTemplate(false, [], `Ocorreu uma execeção no processo de autenticação. error: ${err.message}`)
        }
    });

    application.put("/departamento", (req, res) => {
        let _userServices = new application.Domain.Services.UserServices(application);
        let _userRepository = new application.Infra.Data.Repositories.UserDAO();

        try {
            _userServices.Update(req, res, _userRepository);
        } catch (err) {
            res = this.NotificationTemplate(false, [], `Ocorreu uma execeção no processo de atualização. error: ${err.message}`)
        }
    });

    application.delete("/departamento/:id", (req, res) => {
        let _userServices = new application.Domain.Services.UserServices(application);
        let _userRepository = new application.Infra.Data.Repositories.UserDAO();

        try {
            _userServices.Disable(req, res, _userRepository);
        } catch (err) {
            res = this.NotificationTemplate(false, [], `Ocorreu uma execeção no processo de desabilitação. error: ${err.message}`)
        }
    });

    application.put("/departamento/ativar", (req, res) => {
        let _userServices = new application.Domain.Services.UserServices(application);
        let _userRepository = new application.Infra.Data.Repositories.UserDAO();

        try {
            _userServices.Activate(req, res, _userRepository);
        } catch (err) {
            res = this.NotificationTemplate(false, [], `Ocorreu uma execeção no processo de ativação. error: ${err.message}`)
        }
    });

    this.NotificationTemplate = function(_status, _data, _message) {
        return {
            status: _status,
            data: _data,
            msg: [{ text: _message }],
        }
    }
};