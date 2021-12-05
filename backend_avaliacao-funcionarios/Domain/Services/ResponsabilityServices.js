var shared = require('../../Shared/Constants.js');

var _shared = new shared();

function ResponsabilityServices() {}

//#region  métodos principais DAO
ResponsabilityServices.prototype.Include = async(
    req,
    res,
    _responsabilityRepository
) => {
    var data = await _responsabilityRepository.ValidateByName(
        req.body.description
    );

    if (data.status == false && data.count == 0) {
        await _responsabilityRepository.Include(req);
        res.json(_shared.NotificationTemplate(true, [], `Dados cadastrados com sucesso!`));
    } else res.json(_shared.NotificationTemplate(true, [], `Este cargo já existe!`));
};

ResponsabilityServices.prototype.ControlRelationResponsibilityArea = async(
    req,
    res,
    _responsabilityRepository
) => {
    let list = req.body.relation
    console.log('relacao: ', req.body.relation)

    for (element in list) {
        element = list[element];

        if (element.Status == 'Include') {
            await _responsabilityRepository.IncludeRelationResponsibilityArea(element);
        } else if (element.Status == 'Remove') {
            await _responsabilityRepository.RemoveRelationResponsibilityArea(element);
        }
    }

    res.json(_shared.NotificationTemplate(true, [], `Dados de relação entre área e cargo atualizados com sucesso!`));
};

ResponsabilityServices.prototype.GetRelationResponsibilityArea = async(
    res,
    _responsabilityRepository
) => {
    let data = await _responsabilityRepository.GetResponsibilityArea();
    res.json(_shared.NotificationTemplate(true, data, `Lista de relacões de área e cargo.`));
};

ResponsabilityServices.prototype.ControlRelationResponsibilityPermission = async(
    req,
    res,
    _responsabilityRepository
) => {
    let list = req.body.relation

    for (element in list) {
        element = list[element];

        if (element.Status == 'Include') {
            await _responsabilityRepository.IncludeRelationResponsibilityPermission(element);
        } else if (element.Status == 'Remove') {
            await _responsabilityRepository.RemoveRelationResponsibilityPermission(element);
        }
    }

    res.json(_shared.NotificationTemplate(true, [], `Dados de relação entre permissão e cargo atualizados com sucesso!`));
};


ResponsabilityServices.prototype.GetResponsibilityPermission = async(
    res,
    _responsabilityRepository
) => {
    let data = await _responsabilityRepository.GetResponsibilityPermission();
    res.json(_shared.NotificationTemplate(true, data, `Lista de relacões de permissão e cargo.`));
};

ResponsabilityServices.prototype.GetPermission = async(
    res,
    _responsabilityRepository
) => {
    let data = await _responsabilityRepository.GetPermissions();
    res.json(_shared.NotificationTemplate(true, data, `Lista de permissão.`));
};


ResponsabilityServices.prototype.Get = async(
    res,
    _responsabilityRepository
) => {
    let data = await _responsabilityRepository.Get();
    res.json(_shared.NotificationTemplate(true, data, "Lista de cargos cadastrados!"));
};

ResponsabilityServices.prototype.Activate = async(
    req,
    res,
    _responsabilityRepository
) => {
    let statusActivate = 1;
    await UpdateStatus(statusActivate, req.body.id, _responsabilityRepository);
    res.json(_shared.NotificationTemplate(true, [], "Cargo ativado com sucesso!"));
};

ResponsabilityServices.prototype.Disable = async(
    req,
    res,
    _responsabilityRepository
) => {
    let statusDisable = 2;
    await UpdateStatus(statusDisable, req.params.id, _responsabilityRepository);
    res.json(_shared.NotificationTemplate(true, [], "Cargo desabilitado com sucesso!"));
};

//#endregion métodos principais DAO

//#region métodos de acesso ao banco auxiliares

var UpdateStatus = async function(status, id, _responsabilityRepository) {
    await _responsabilityRepository.UpdateStatus(status, id);
};

//#endregion métodos de acesso ao banco auxiliares

module.exports = () => {
    return ResponsabilityServices;
};