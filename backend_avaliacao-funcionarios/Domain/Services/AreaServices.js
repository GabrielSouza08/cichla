var crypto = require("crypto");

function AreaServices() {}

//#region  métodos principais DAO
AreaServices.prototype.Include = async (req, res, _areaRepository) => {
  var data = await _areaRepository.ValidatebyName(req.body.description);

  if (data.status == false && data.count == 0) {
    await _areaRepository.Include(req);
    res.json(NotificationTemplate(true, [], `Dados cadastrados com sucesso!`));
  } else await res.json(NotificationTemplate(true, [], `Área ja existe!`));
};

AreaServices.prototype.Get = async (res, _areaRepository) => {
  let parameters = undefined; //req.params;
  let data = await _areaRepository.Get(parameters);
  res.json(NotificationTemplate(true, data, "Lista de areas cadastradas!"));
};

AreaServices.prototype.Activate = async (req, res, _areaRepository) => {
  let statusActivate = 1;
  await UpdateStatus(statusActivate, req.body.id, _areaRepository);
  res.json(NotificationTemplate(true, [], "Área ativada com sucesso!"));
};

AreaServices.prototype.Disable = async (req, res, _areaRepository) => {
  let statusDisable = 2;
  await UpdateStatus(statusDisable, req.params.id, _areaRepository);
  res.json(NotificationTemplate(true, [], "Área desabilitada com sucesso!"));
};

//#endregion métodos principais DAO

//#region métodos de acesso ao banco auxiliares

var UpdateStatus = async function (status, id, _areaRepository) {
  await _areaRepository.UpdateStatus(status, id);
};

//#endregion métodos de acesso ao banco auxiliares

//#endregion métodos auxiliares logicos
var NotificationTemplate = function (_status, _data, _message) {
  return {
    status: _status,
    data: _data,
    msg: [{ text: _message }],
  };
};
module.exports = () => {
  return AreaServices;
};
