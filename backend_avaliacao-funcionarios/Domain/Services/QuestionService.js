function QuestionService() {}

//#region  métodos principais DAO
QuestionService.prototype.Include = async(req, res, _questionRepository) => {

    var data = await _questionRepository.ValidateByDescription(req.body.description);
    if (data.status == false && data.count == 0) {
        await _questionRepository.Include(req);
        res.json(NotificationTemplate(true, [], `Dados cadastrados com sucesso!`));
    } else await resultHandlerInclude(req, res, data, _questionRepository);
};

QuestionService.prototype.Update = async(req, res, _questionRepository) => {
    var data = await _questionRepository.ValidateByDescription(req.body.description);

    if (data.status == false && data.count == 0) {
        await _questionRepository.Update(req);
        res.json(NotificationTemplate(true, [], `Questão atualizada com sucesso!`));
    } else res.json(NotificationTemplate(false, [], `Já existe uma questão com essa descrição!`));
};

QuestionService.prototype.Get = async(res, _questionRepository) => {
    let data = await _questionRepository.Get();
    res.json(NotificationTemplate(true, data, "Lista de questões cadastradas!"));
};

QuestionService.prototype.GetByAreaId = async(req, res, _questionRepository) => {
    let data = await _questionRepository.GetByAreaId(req.params.areaId);
    res.json(NotificationTemplate(true, data, "Lista de questões cadastradas!"));
};

QuestionService.prototype.GetQuantity = async(res, _questionRepository) => {
    let data = await _questionRepository.GetQuantity();
    res.json(NotificationTemplate(true, data, "Lista de questões e quantidades a partir do critério!"));
};

QuestionService.prototype.Activate = async(req, res, _questionRepository) => {
    let statusActivate = 1;
    await UpdateStatus(statusActivate, req.body.id, _questionRepository);
    res.json(NotificationTemplate(true, [], "Questão ativada com sucesso!"));
};

QuestionService.prototype.Disable = async(req, res, _questionRepository) => {
    let statusDisable = 2;
    await UpdateStatus(statusDisable, req.params.id, _questionRepository);
    res.json(NotificationTemplate(true, [], "Questão desabilitada com sucesso!"));
};

//#endregion métodos principais DAO

//#region métodos de acesso ao banco auxiliares

var UpdateStatus = async function(status, id, _questionRepository) {
    await _questionRepository.UpdateStatus(status, id);
};

//#endregion métodos de acesso ao banco auxiliares

//#region métodos auxiliares logicos
var resultHandlerInclude = async function(req, res, data, _questionRepository) {
    //área localizada, distinto e ativo
    if (data.status && data.count == 1) {
        res.json(
            NotificationTemplate(
                false, [],
                `Não é possivel cadastrar a questão, pois já é existente.`
            )
        );
    }
    //área localizada, multiplo e status indefinido.
    else if (data.count == 2) {
        res.json(
            NotificationTemplate(
                false, [],
                `A questão: ${req.body.description.toUpperCase()} está duplicada. Entre em contato com o RH para para melhor solução.`
            )
        );
    }
    //área localizada, distinto e inativo. Então atualiza e ativa
    else if (data.status == false && data.count == 1) {
        let id_sattus = 1;
        let id = await _questionRepository.GetIdByDescription(req.body.description);
        id = (id == undefined) ? '' : id[0].id;
        await _questionRepository.UpdateStatus(id_sattus, id)

        res.json(
            NotificationTemplate(true, [], "Questão localizada, atualizada e ativada")
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
    return QuestionService;
};