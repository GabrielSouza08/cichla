var crypto = require("crypto");

function EvaluationService() {}

//#region  métodos principais DAO
EvaluationService.prototype.Initialize = async(req, res, _repositories) => {
    _questionRepository = new _repositories.QuestionDAO();

    data = await _questionRepository.Get(req.body.areaId)

    res.json(NotificationTemplate(true, [], `Inicializado!`));
};


EvaluationService.prototype.GetScales = async(req, res, _repositories) => {
    _scaleRepository = new _repositories.ScaleDAO();

    data = await _scaleRepository.Get()

    res.json(NotificationTemplate(true, data, `Lista de escalas!`));
};

EvaluationService.prototype.UpdateScales = async(req, res, _repositories) => {
    _scaleRepository = new _repositories.ScaleDAO();

    var data = await _scaleRepository.ValidateByDescription(req.body.description);

    if (data.status == false && data.count == 0) {
        await _scaleRepository.Update(req.body.description, req.body.id);
        res.json(NotificationTemplate(true, [], `Escala atualizada com sucesso!`));
    } else res.json(NotificationTemplate(true, [], `Já existe uma escala com esse nome!`));


};

//#endregion  métodos principais DAO

//#region métodos logicos auxiliares
var FinalGrade = function(data, _questionRepository) {
    // Todo: nota maxima 
    questionsSpotMax = self._questionRepository.questionsSpotMax()

    gradeEvaluation = CalculatorSpot(data.questions)
    gradeMax = CalculatorSpot(questionsSpotMax)

    return (gradeEvaluation / gradeMax) * 100
}

var CalculatorSpot = function(questions) {
    spot = 0

    for (question in questions) {
        spot += question.grade * question.weight
    }

    return spot
}

var NotificationTemplate = function(_status, _data, _message) {
    return {
        success: _status,
        data: _data,
        msg: [{ text: _message }],
    };
};

//#endregion métodos auxiliares logicos

module.exports = () => {
    return EvaluationService;
};