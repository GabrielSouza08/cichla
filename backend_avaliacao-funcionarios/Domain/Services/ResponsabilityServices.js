var crypto = require("crypto");

function ResponsabilityServices() {}

//#region  métodos principais DAO
ResponsabilityServices.prototype.Include = async (
  req,
  res,
  _cargoRepository
) => {
  var data = await _cargoRepository.ValidateByName(req.body.ds_cargo);

  if (data.status == false && data.count == 0) {
    await _cargoRepository.Include(req);
    res.json(NotificationTemplate(true, [], `Dados cadastrados com sucesso!`));
  } else res.json(NotificationTemplate(true, [], `Este cargo já existe!`));
};

ResponsabilityServices.prototype.Get = async (res, _cargoRepository) => {
  let data = await _cargoRepository.Get();
  res.json(NotificationTemplate(true, data, "Lista de cargos cadastrados!"));
};

ResponsabilityServices.prototype.Activate = async (
  req,
  res,
  _cargoRepository
) => {
  let statusActivate = 1;
  await UpdateStatus(statusActivate, req.body.id, _cargoRepository);
  res.json(NotificationTemplate(true, [], "Cargo ativado com sucesso!"));
};

ResponsabilityServices.prototype.Disable = async (
  req,
  res,
  _cargoRepository
) => {
  let statusDisable = 2;
  await UpdateStatus(statusDisable, req.params.id, _cargoRepository);
  res.json(NotificationTemplate(true, [], "Cargo desabilitado com sucesso!"));
};

//#endregion métodos principais DAO

//#region métodos de acesso ao banco auxiliares

var UpdateStatus = async function (status, id, _cargoRepository) {
  await _cargoRepository.UpdateStatus(status, id);
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
  return ResponsabilityServices;
};
