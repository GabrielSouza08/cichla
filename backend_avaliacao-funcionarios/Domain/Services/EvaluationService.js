var crypto = require("crypto");

function EvaluationService() {}

//#region  métodos principais DAO
EvaluationService.prototype.Initialize = async(req, res, _repositories) => {
    _questionRepository = new _repositories.QuestionDAO();

    data = await _questionRepository.Get(req.body.areaId)

    console.log('dados da questão: ', data)

    res.json(NotificationTemplate(true, [], `Inicializado!`));
};

var NotificationTemplate = function(_status, _data, _message) {
    return {
        success: _status,
        data: _data,
        msg: [{ text: _message }],
    };
};

module.exports = () => {
    return EvaluationService;
};