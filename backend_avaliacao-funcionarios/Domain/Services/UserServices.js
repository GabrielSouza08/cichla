var shared = require('../../Shared/Constants.js');

var _shared = new shared();
var crypto = require("crypto");

function UserServices() {}

//#region  métodos principais DAO
UserServices.prototype.Include = async(req, res, _userRepository) => {
    var data = await _userRepository.ExistenceValidationByEmail(req.body.email);

    if (data.status == false && data.count == 0) {
        req.body.password = EncryptCharacters(req.body.password);

        await _userRepository.Include(req);
        res.json(_shared.NotificationTemplate(true, [], `Dados cadastrados com sucesso!`));
    } else await resultHandlerInclude(req, res, data, _userRepository);
};

UserServices.prototype.Get = async(req, res, _userRepository) => {
    let data = await _userRepository.Get(req.params.userActive);
    res.json(_shared.NotificationTemplate(true, data, "Lista de usuários cadastrados!"));
};

UserServices.prototype.GetEvaluator = async(res, _userRepository) => {
    let data = await _userRepository.GetEvaluator();
    res.json(_shared.NotificationTemplate(true, data, "Lista de avaliadores cadastrados!"));
};

UserServices.prototype.Update = async(req, res, _userRepository) => {
    let isChangeEmail = req.body.isChangeEmail;
    let isChangePassword = req.body.isChangePassword;

    //verifica a existencia do email
    var data = await _userRepository.ExistenceValidationByEmail(req.body.email);

    let status =
        isChangeEmail == true && data.status == false && data.count == 0 ?
        true :
        isChangeEmail == false && data.status == true && data.count == 1 ?
        true :
        false;

    if (status) {
        Update(req, isChangePassword, _userRepository);
        res.json(_shared.NotificationTemplate(true, {}, "Usuário atualizado."));
    } else {
        let message =
            data.status == false && data.count == 1 ?
            `Usuário está desabilitado, ative-o para atualizar os dados.!` :
            data.count > 1 ?
            `Este usuário não pode ser edidato, contate RH. Dados dupliados!` :
            data.status == true && data.count == 1 ?
            `O ${req.body.email} já está cadastrado com outro usuário, tente outro e-mail!` :
            "";

        res.json(_shared.NotificationTemplate(false, [], message));
    }
};

UserServices.prototype.Activate = async(req, res, _userRepository) => {
    let statusActivate = 1;
    await UpdateStatus(statusActivate, req.params.id, _userRepository);
    res.json(_shared.NotificationTemplate(true, [], "Usuário ativado com sucesso!"));
};

UserServices.prototype.Disable = async(req, res, _userRepository) => {
    let statusDisable = 2;
    await UpdateStatus(statusDisable, req.params.id, _userRepository);
    res.json(_shared.NotificationTemplate(true, [], "Usuário desabilitado com sucesso!"));
};

UserServices.prototype.Authenticator = async(req, res, _userRepository) => {
    let data = await _userRepository.Authenticator(req.body.email);

    if (data.analysis.status) {
        let result = data.result[0];
        let permissions = await _userRepository.GetPermissions(
            result.responsibilityId
        );
        permissions = permissions == undefined ? [] : permissions;

        result.permissions = permissions;
        let accessPermissions = permissions.length >= 1 ? true : false;

        let accessValidation =
            result.password == EncryptCharacters(req.body.password);

        let status = accessPermissions && accessValidation;

        let object = status ? result : [];

        let message = status ?
            `Atenticação concluída, credencial válida!` :
            accessValidation == false ?
            `Senha está errada!` :
            accessPermissions == false ?
            `Atenticação concluída, usuário não possui privilegios para acesso!` :
            "";

        res.json(_shared.NotificationTemplate(status, object, message));
    } else {
        let message =
            data.analysis.status == false && data.analysis.count == 1 ?
            `Atenticação concluída, usuário não possui mais acesso ao sistema!` :
            data.analysis.count > 1 ?
            `Não foi possivel autenticar, pois houve uma biforcação de acesso!` :
            data.analysis.count == 0 ?
            `Não foi possivel autenticar, usuário inexistente!` :
            "";

        res.json(_shared.NotificationTemplate(false, [], message));
    }
};

//#endregion métodos principais DAO

//#region métodos de acesso ao banco auxiliares

var Update = async(req, isChangePassword, _userRepository) => {
    req.body.password = EncryptCharacters(req.body.password);
    await _userRepository.Update(req, isChangePassword);
};

var GetIdByEmail = async(email, _userRepository) => {
    return await _userRepository.GetIdByEmail(email);
};

var UpdateStatus = async function(status, id, _userRepository) {
    await _userRepository.UpdateStatus(status, id);
};

//#endregion métodos de acesso ao banco auxiliares

//#region métodos logicos auxiliares
var EncryptCharacters = function(value) {
    let encrypt = crypto.createHash("md5").update(value).digest("hex");
    return encrypt;
};

var resultHandlerInclude = async function(req, res, data, _userRepository) {
    //usuário localizado, distinto e ativo
    if (data.status && data.count == 1) {
        res.json(
            _shared.NotificationTemplate(
                false, [],
                `Não é possivel cadastrar o usuário, pois o email: ${req.body.email.toUpperCase()} já é existente.`
            )
        );
    }
    //usuário localizado, multiplo e status indefinido.
    else if (data.count == 2) {
        res.json(
            _shared.NotificationTemplate(
                false, [],
                `O email: ${req.body.email.toUpperCase()} está duplicado. Entre em contato com o RH para para melhor solução.`
            )
        );
    }
    //usuário localizado, distinto e inativo. Então atualiza e ativa
    else if (data.status == false && data.count == 1) {
        let id_sattus = 1;
        let isChangePassword = true;
        req.body.id = await GetIdByEmail(req.body.email, _userRepository);
        await UpdateStatus(id_sattus, req.body.id, _userRepository);
        await Update(req, isChangePassword, _userRepository);

        res.json(
            _shared.NotificationTemplate(true, [], "Usuário localizado, atualizado e ativado")
        );
    }
};
//#endregion métodos auxiliares logicos
module.exports = () => {
    return UserServices;
};