var shared = require('../../Shared/Constants.js');

var _shared = new shared();

function EvaluationMarkersServices() {}

//#region  métodos principais DAO
EvaluationMarkersServices.prototype.Include = async(
    req,
    res,
    _evaluationRepository
) => {
    var data = await _evaluationRepository.ValidateByName(req.body.ds_cargo);

    if (data.status == false && data.count == 0) {
        await _evaluationRepository.Include(req);
        res.json(_shared.NotificationTemplate(true, [], `Dados cadastrados com sucesso!`));
    } else
        res.json(
            _shared.NotificationTemplate(true, [], `Este marcador avaliativo já existe!`)
        );
};
EvaluationMarkersServices.prototype.Get = async(
    res,
    _evaluationRepository
) => {
    let data = await _evaluationRepository.Get();
    res.json(
        _shared.NotificationTemplate(
            true,
            data,
            "Lista de marcadores avaliativos cadastrados!"
        )
    );
};

EvaluationMarkersServices.prototype.Activate = async(
    req,
    res,
    _evaluationRepository
) => {
    let statusActivate = 1;
    await UpdateStatus(statusActivate, req.body.id, _evaluationRepository);
    res.json(
        _shared.NotificationTemplate(true, [], "Marcador avaliativo ativado com sucesso!")
    );
};

EvaluationMarkersServices.prototype.Disable = async(
    req,
    res,
    _evaluationRepository
) => {
    let statusDisable = 2;
    await UpdateStatus(statusDisable, req.params.id, _evaluationRepository);
    res.json(
        _shared.NotificationTemplate(
            true, [],
            "Marcador avaliativo desabilitado com sucesso!"
        )
    );
};

//#region métodos de acesso ao banco auxiliares

var UpdateStatus = async function(status, id, _evaluationRepository) {
    await _evaluationRepository.UpdateStatus(status, id);
};

//#endregion métodos de acesso ao banco auxiliares

module.exports = () => {
    return EvaluationMarkersServices;
};