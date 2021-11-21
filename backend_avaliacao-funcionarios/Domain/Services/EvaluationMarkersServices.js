function EvaluationMarkersServices() {}

//#region  métodos principais DAO
EvaluationMarkersServices.prototype.Include = async (
  req,
  res,
  _evaluationRepository
) => {
  var data = await _evaluationRepository.ValidateByName(req.body.ds_cargo);

  if (data.status == false && data.count == 0) {
    await _evaluationRepository.Include(req);
    res.json(NotificationTemplate(true, [], `Dados cadastrados com sucesso!`));
  } else
    res.json(
      NotificationTemplate(true, [], `Este marcador avaliativo já existe!`)
    );
};
EvaluationMarkersServices.prototype.Get = async (
  res,
  _evaluationRepository
) => {
  let data = await _evaluationRepository.Get();
  res.json(
    NotificationTemplate(
      true,
      data,
      "Lista de marcadores avaliativos cadastrados!"
    )
  );
};

EvaluationMarkersServices.prototype.Activate = async (
  req,
  res,
  _evaluationRepository
) => {
  let statusActivate = 1;
  await UpdateStatus(statusActivate, req.body.id, _evaluationRepository);
  res.json(
    NotificationTemplate(true, [], "Marcador avaliativo ativado com sucesso!")
  );
};

EvaluationMarkersServices.prototype.Disable = async (
  req,
  res,
  _evaluationRepository
) => {
  let statusDisable = 2;
  await UpdateStatus(statusDisable, req.params.id, _evaluationRepository);
  res.json(
    NotificationTemplate(
      true,
      [],
      "Marcador avaliativo desabilitado com sucesso!"
    )
  );
};

//#region métodos de acesso ao banco auxiliares

var UpdateStatus = async function (status, id, _evaluationRepository) {
  await _evaluationRepository.UpdateStatus(status, id);
};

//#endregion métodos de acesso ao banco auxiliares

//#region métodos logicos auxiliares

var NotificationTemplate = function (_status, _data, _message) {
  return {
    status: _status,
    data: _data,
    msg: [{ text: _message }],
  };
};

//#endregion métodos auxiliares logicos
module.exports = () => {
  return EvaluationMarkersServices;
};
