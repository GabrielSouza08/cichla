/* Application/Controllers/DepartmentController.js */
module.exports = (application) => {
    application.post("/departamento/cadastrar", (req, res) => {
        let _departmentServices =
            new application.Domain.Services.DepartmentServices(application);
        let _departmentRepository =
            new application.Infra.Data.Repositories.DepartmentDAO();
        try {
            _departmentServices.Include(req, res, _departmentRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de cadastro. error: ${err.message}`
            );
        }
    });

    application.get("/departamento", (req, res) => {
        let _departmentServices =
            new application.Domain.Services.DepartmentServices(application);
        let _departmentRepository =
            new application.Infra.Data.Repositories.DepartmentDAO();
        try {
            _departmentServices.Get(res, _departmentRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo consulta. error: ${err.message}`
            );
        }
    });

    application.delete("/departamento/:id", (req, res) => {
        let _departmentServices =
            new application.Domain.Services.DepartmentServices(application);
        let _departmentRepository =
            new application.Infra.Data.Repositories.DepartmentDAO();

        try {
            _departmentServices.Disable(req, res, _departmentRepository);
        } catch (err) {
            res = this.NotificationTemplate(
                false, [],
                `Ocorreu uma exceção no processo de desabilitação. error: ${err.message}`
            );
        }
    });

    application.put("/departamento/ativar", (req, res) => {
        let _departmentServices =
            new application.Domain.Services.DepartmentServices(application);
        let _departmentRepository =
            new application.Infra.Data.Repositories.DepartmentDAO();

        try {
            _departmentServices.Activate(req, res, _departmentRepository);
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