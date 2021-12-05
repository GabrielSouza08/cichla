var shared = require('../../Shared/Constants.js');

var _shared = new shared();

function DepartmentServices() {}

//#region  métodos principais DAO
DepartmentServices.prototype.Include = async(
    req,
    res,
    _departmentRepository
) => {
    var data = await _departmentRepository.ValidateByName(req.body.ds_department);

    if (data.status == false && data.count == 0) {
        await _departmentRepository.Include(req);
        res.json(_shared.NotificationTemplate(true, [], `Dados cadastrados com sucesso!`));
    } else res.json(_shared.NotificationTemplate(false, [], `Departamento já existe!`));
};

DepartmentServices.prototype.Get = async(res, _departmentRepository) => {
    let data = await _departmentRepository.Get();
    res.json(
        _shared.NotificationTemplate(true, data, "Lista de departamentos cadastrados!")
    );
};

DepartmentServices.prototype.Activate = async(
    req,
    res,
    _departmentRepository
) => {
    let statusActivate = 1;
    await UpdateStatus(statusActivate, req.body.id, _departmentRepository);
    res.json(_shared.NotificationTemplate(true, [], "Departamento ativado com sucesso!"));
};

DepartmentServices.prototype.Disable = async(
    req,
    res,
    _departmentRepository
) => {
    let statusDisable = 2;
    await UpdateStatus(statusDisable, req.params.id, _departmentRepository);
    res.json(
        _shared.NotificationTemplate(true, [], "Departamento desabilitado com sucesso!")
    );
};

//#endregion métodos principais DAO

//#region métodos de acesso ao banco auxiliares

var UpdateStatus = async function(status, id, _departmentRepository) {
    await _departmentRepository.UpdateStatus(status, id);
};

//#endregion métodos de acesso ao banco auxiliares

module.exports = () => {
    return DepartmentServices;
};