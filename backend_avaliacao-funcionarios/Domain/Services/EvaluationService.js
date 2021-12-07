var crypto = require("crypto");
var shared = require('../../Shared/Constants.js');

var _shared = new shared();

function EvaluationService() {}

//#region  métodos principais DAO
EvaluationService.prototype.RegisterOrChange = async(req, res, _repositories) => {
    let _questionRepository = new _repositories.QuestionDAO();
    let _enumStatus = _shared.GetEnumStatus();

    let marker = await GetMarker(_repositories);

    if (marker.status) {

        if (req.body.type == 'Change') {

            let object = {
                markerId: marker.object.id,
                userId: req.body.listQuestionsEvaluation[0].appraiseeId
            }

            await _questionRepository.UpdateStatusEvaluationCompleted(object, _enumStatus.disabled).then(async() => {
                await setTimeout(async function() {
                    await req.body.listQuestionsEvaluation.forEach(async function(element) {
                        element.markerId = marker.object.id;
                        await _questionRepository.IncludeEvaluationCompleted(element);
                    });

                    await IncludeOrEnabeled(req.body.listQuestionsEvaluation, _repositories);
                }, 600)
            });


        } else {
            await req.body.listQuestionsEvaluation.forEach(async function(element) {
                element.markerId = marker.object.id;
                await _questionRepository.IncludeEvaluationCompleted(element);
            });

            await IncludeOrEnabeled(req.body.listQuestionsEvaluation, _repositories);
        }
        await res.json(_shared.NotificationTemplate(true, [], `Avaliação conluída!`));

    } else
        res.json(_shared.NotificationTemplate(false, [], `Periodo da avaliação inválido!`));

};

var GetMarker = async function(_repositories) {
    _markersEvaluationRepository = new _repositories.EvaluationMarkersDAO();
    let enumStatus = _shared.GetEnumStatus();

    let marker = await _markersEvaluationRepository.Get(enumStatus.enabled);

    marker = (marker.length > 0) ? marker[0] : undefined;

    return {
        object: marker,
        status: (marker != undefined) ? true : false
    }
}

var IncludeOrEnabeled = async function(objectArray, _repositories) {
    let _evaluationRespository = new _repositories.EvaluationDAO()
    let analisy = await _evaluationRespository.ValidateByUserId(objectArray[0].appraiseeId);
    let enumStatus = _shared.GetEnumStatus();

    if (analisy.status == false && analisy.count == 0)
        await _evaluationRespository.Include(objectArray[0], enumStatus.rated);

    else
    if (analisy.status == false && analisy.statusCode == enumStatus.pending ||
        analisy.status == true && analisy.statusCode == enumStatus.enabled) {
        let id = await _evaluationRespository.GetIdByUserId(objectArray[0].appraiseeId);

        await _evaluationRespository.UpdateStatus(id, enumStatus.rated);
    }
}

EvaluationService.prototype.GetEvaluationCompleted = async(req, res, _repositories) => {
    _evaluationRepository = new _repositories.EvaluationDAO();

    data = await _evaluationRepository.GetEvaluationCompleted(req.params.evaluatorId)

    await FinalResult(req.params.evaluatorId, _evaluationRepository, data, res);
};

EvaluationService.prototype.GetQuestions = async(req, res, _repositories) => {


    _evaluationRepository = new _repositories.EvaluationDAO();

    await QuestionAnalyzer(_repositories, req.params.evaluatorId).then(async() => {
        setTimeout(async function() {
            data = await _evaluationRepository.GetQuestions(req.params.evaluatorId)
            res.json(_shared.NotificationTemplate(true, data, `Lista de questoes!`));
        }, 300)

    });
};

var QuestionAnalyzer = async function(_repositories, evaluatorId) {

    let _questionRepository = new _repositories.QuestionDAO();
    let _evaluationRespository = new _repositories.EvaluationDAO();
    let _enumStatus = _shared.GetEnumStatus();

    let marker = await GetMarker(_repositories);

    if (marker.status) {
        questions = await _evaluationRepository.GetCounQuestionByEvaluatorId(evaluatorId);
        questionsCompleted = await _evaluationRepository.GetCounQuestionCompletedByEvaluatorId(evaluatorId);

        await questions.forEach(async function(question) {
            if (Boolean(question.statusEvaluation))
                await questionsCompleted.forEach(async function(questionCompleted) {

                    if (question.appraiseeId == questionCompleted.appraiseeId && question.count > questionCompleted.count) {

                        await _questionRepository.UpdateStatusEvaluationCompleted(questionCompleted.appraiseeId, marker.object.id, _enumStatus.disabled);

                        let id = await _evaluationRespository.GetIdByUserId(questionCompleted.appraiseeId);
                        await _evaluationRespository.UpdateStatus(id, _enumStatus.pending);
                    }
                });
        });
    }
}

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
var FinalResult = async function(userId, _evaluationRepository, data, res) {

    questionsSpotMax = await _evaluationRepository.ObtainOriginalQuantitativeData(userId, true);
    questionsSpot = await _evaluationRepository.ObtainOriginalQuantitativeData(userId, false);

    gradeEvaluation = CalculatorSpot(questionsSpot)
    gradeMax = CalculatorSpot(questionsSpotMax)

    let finalResult = (gradeEvaluation / gradeMax) * 100

    for (element in data)
        data[element].finalResult = finalResult

    res.json(_shared.NotificationTemplate(true, data, `Lista de avaliação!`));
}

var CalculatorSpot = function(questions) {
    spot = 0

    for (question in questions) {
        spot += questions[question].grade * questions[question].weight
    }

    return spot
}

module.exports = () => {
    return EvaluationService;
};