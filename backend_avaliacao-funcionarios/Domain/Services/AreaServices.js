var shared = require('../../Shared/Constants.js');

var _shared = new shared();

function AreaServices() {}

//#region  métodos principais DAO
AreaServices.prototype.Include = async(req, res, _areaRepository) => {
    var data = await _areaRepository.ValidateByName(req.body.description);

    if (data.status == false && data.count == 0) {
        await _areaRepository.Include(req);
        res.json(_shared.NotificationTemplate(true, [], `Dados cadastrados com sucesso!`));
    } else await resultHandlerInclude(req, res, data, _areaRepository);
};

AreaServices.prototype.Get = async(res, _areaRepository) => {
    let data = await _areaRepository.Get();
    res.json(_shared.NotificationTemplate(true, data, "Lista de areas cadastradas!"));
};

AreaServices.prototype.Activate = async(req, res, _areaRepository) => {
    let statusActivate = 1;
    await UpdateStatus(statusActivate, req.body.id, _areaRepository);
    res.json(_shared.NotificationTemplate(true, [], "Área ativada com sucesso!"));
};

AreaServices.prototype.Disable = async(req, res, _areaRepository) => {
    let statusDisable = 2;
    await UpdateStatus(statusDisable, req.params.id, _areaRepository);
    res.json(_shared.NotificationTemplate(true, [], "Área desabilitada com sucesso!"));
};

//#endregion métodos principais DAO

//#region métodos de acesso ao banco auxiliares

var UpdateStatus = async function(status, id, _areaRepository) {
    await _areaRepository.UpdateStatus(status, id);
};

//#endregion métodos de acesso ao banco auxiliares

//#region métodos auxiliares logicos
var resultHandlerInclude = async function(req, res, data, _areaRepository) {
    //área localizada, distinto e ativo
    if (data.status && data.count == 1) {
        res.json(
            _shared.NotificationTemplate(
                false, [],
                `Não é possivel cadastrar a área, pois já é existente.`
            )
        );
    }
    //área localizada, multiplo e status indefinido.
    else if (data.count == 2) {
        res.json(
            _shared.NotificationTemplate(
                false, [],
                `A Área: ${req.body.description.toUpperCase()} está duplicada. Entre em contato com o RH para para melhor solução.`
            )
        );
    }
    //área localizada, distinto e inativo. Então atualiza e ativa
    else if (data.status == false && data.count == 1) {
        let id_sattus = 1;
        let id = await _areaRepository.GetIdByDescription(req.body.description);

        id = (id == undefined) ? '' : id[0].id;

        await _areaRepository.UpdateStatus(id_sattus, id)

        res.json(
            _shared.NotificationTemplate(true, [], "Área localizada, atualizada e ativada")
        );
    }
};
//#endregion métodos auxiliares logicos

module.exports = () => {
    return AreaServices;
};