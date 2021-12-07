class Constants {
    constructor() {}

    GetEnumMonth() {
        let object = {};

        object.january = 1;
        object.february = 2;
        object.march = 3;
        object.april = 4;
        object.may = 5;
        object.june = 6;
        object.july = 7;
        object.august = 8;
        object.september = 9;
        object.october = 10;
        object.november = 11;
        object.december = 12;

        return object;
    }

    GetEnumPeriod() {
        let object = {};

        object.semester = 6;
        object.quarter = 3;

        return object;
    }

    GetEnumStatus() {
        let object = {};

        object.enabled = 1;
        object.disabled = 2;
        object.rated = 3;
        object.pending = 4;
        object.inWaiting = 5;

        return object;
    }

    NotificationTemplate(_status, _data, _message) {
        return {
            success: _status,
            data: _data,
            msg: [{ text: _message }],
        };
    }

    AnalyzeResult(array) {
        /* 
          verifica o resultado em quantidade e status.
          qt:0  - id_status:indefinido -> false -> inexistente
          qt:1  - id_status:2          -> false -> inativo
          qt:1  - id_status:1          -> true  -> ativo
          qt:>1 - id_status:1ou2       -> false -> multiplos
          */
        let index = array[0] == undefined ? 0 : array.length;

        if (index == 0) return { status: false, count: index };

        return {
            status: index == 1 && array[index - 1].status == 1 ? true : false,
            count: index,
        };
    };

    AnalyzeResultEvaluation(array) {
        /* 
          verifica o resultado em quantidade e status.
          qt:0  - id_status:indefinido -> false -> inexistente
          qt:1  - id_status:2          -> false -> inativo
          qt:1  - id_status:4          -> false  -> pendente
          qt:1  - id_status:3          -> true  -> avaliado
          qt:>1 - id_status:1ou2       -> false -> multiplos
          */
        let index = array[0] == undefined ? 0 : array.length;

        if (index == 0) return { status: false, count: index };

        return {
            status: index == 1 && array[index - 1].status == 3 ? true : false,
            count: index,
            statusCode: array[index - 1].status
        };
    };

}

module.exports = Constants;