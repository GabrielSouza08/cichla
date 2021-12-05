var crypto = require("crypto");

function EvaluationService() {}

//#region  métodos principais DAO
EvaluationService.prototype.Initialize = async(req, res, _repositories) => {
    _questionRepository = new _repositories.QuestionDAO();

    data = await _questionRepository.Get(req.body.areaId)

    res.json(_shared.NotificationTemplate(true, [], `Inicializado!`));
};

EvaluationService.prototype.GetQuestions = async(req, res, _repositories) => {
    _evaluationRepository = new _repositories.EvaluationDAO();

    data = await _evaluationRepository.GetQuestions(req.params.evaluatorId)

    res.json(_shared.NotificationTemplate(true, data, `Lista de questoes!`));
};

EvaluationService.prototype.GetScales = async(req, res, _repositories) => {
    _scaleRepository = new _repositories.ScaleDAO();

    data = await _scaleRepository.Get()

    res.json(_shared.NotificationTemplate(true, data, `Lista de escalas!`));
};

EvaluationService.prototype.UpdateScales = async(req, res, _repositories) => {
    _scaleRepository = new _repositories.ScaleDAO();

    var data = await _scaleRepository.ValidateByDescription(req.body.description);

    if (data.status == false && data.count == 0) {
        await _scaleRepository.Update(req.body.description, req.body.id);
        res.json(_shared.NotificationTemplate(true, [], `Escala atualizada com sucesso!`));
    } else res.json(_shared.NotificationTemplate(true, [], `Já existe uma escala com esse nome!`));


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

module.exports = () => {
    return EvaluationService;
};