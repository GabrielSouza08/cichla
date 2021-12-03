var crypto = require("crypto");

function CriterionService() {}

//#region  métodos principais DAO
CriterionService.prototype.Include = async(req, res, _criterionRepository) => {
    var data = await _criterionRepository.ValidateByName(req.body.description);

    if (data.status == false && data.count == 0) {
        await _criterionRepository.Include(req);
        res.json(NotificationTemplate(true, [], `Dados cadastrados com sucesso!`));
    } else await resultHandlerInclude(req, res, data, _criterionRepository);
};

CriterionService.prototype.ControlRelationshipAreaCriterion = async(req, res, _criterionRepository) => {
    let list = req.body.relationship

    for (element in list) {
        element = list[element];

        if (element.Status == 'Include') {
            await _criterionRepository.IncludeRelationshipAreaCriterion(element);
        } else if (element.Status == 'Remove') {
            await _criterionRepository.RemoveRelationshipAreaCriterion(element);
        } else if (element.Status == 'Change') {
            await _criterionRepository.ChangeRelationshipAreaCriterion(element);
        }
    }

    res.json(NotificationTemplate(true, [], `Dados atualizados!`));
};

CriterionService.prototype.Get = async(res, _criterionRepository) => {
    let data = await _criterionRepository.Get();
    res.json(NotificationTemplate(true, data, "Lista de criterios cadastradas!"));
};

CriterionService.prototype.GetRelationshipAreaCriterion = async(res, _criterionRepository) => {
    let data = await _criterionRepository.GetRelationshipAreaCriterion();
    res.json(NotificationTemplate(true, data, "Lista de relação de criterios e área cadastradas!"));
};

CriterionService.prototype.Activate = async(req, res, _criterionRepository) => {
    let statusActivate = 1;
    await UpdateStatus(statusActivate, req.body.id, _criterionRepository);
    res.json(NotificationTemplate(true, [], "Criterios ativada com sucesso!"));
};

CriterionService.prototype.Disable = async(req, res, _criterionRepository) => {
    let statusDisable = 2;
    await UpdateStatus(statusDisable, req.params.id, _criterionRepository);
    res.json(NotificationTemplate(true, [], "Criterios desabilitada com sucesso!"));
};

//#endregion métodos principais DAO

//#region métodos de acesso ao banco auxiliares

var UpdateStatus = async function(status, id, _criterionRepository) {
    await _criterionRepository.UpdateStatus(status, id);
};

//#endregion métodos de acesso ao banco auxiliares

//#region métodos auxiliares logicos
var resultHandlerInclude = async function(req, res, data, _criterionRepository) {
    //área localizada, distinto e ativo
    if (data.status && data.count == 1) {
        res.json(
            NotificationTemplate(
                false, [],
                `Não é possivel cadastrar o criterio, pois já é existente.`
            )
        );
    }
    //área localizada, multiplo e status indefinido.
    else if (data.count == 2) {
        res.json(
            NotificationTemplate(
                false, [],
                ` O Criterio : ${req.body.description.toUpperCase()} está duplicada. Entre em contato com o RH para para melhor solução.`
            )
        );
    }
    //área localizada, distinto e inativo. Então atualiza e ativa
    else if (data.status == false && data.count == 1) {
        let id_sattus = 1;
        let id = await _criterionRepository.GetIdByDescription(req.body.description);
        id = id[0].id;

        console.log(id)
        await _criterionRepository.UpdateStatus(id_sattus, id)

        res.json(
            NotificationTemplate(true, [], "Criterio localizado, atualizado e ativado")
        );
    }
};
//#endregion métodos auxiliares logicos

var NotificationTemplate = function(_status, _data, _message) {
    return {
        success: _status,
        data: _data,
        msg: [{ text: _message }],
    };
};

module.exports = () => {
    return CriterionService;
};