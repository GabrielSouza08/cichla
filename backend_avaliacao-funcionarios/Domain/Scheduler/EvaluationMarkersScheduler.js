var cron = require('node-cron');
var moment = require('moment');
var shared = require('../../Shared/Constants.js');

var _shared = new shared();

module.exports = (application) => {

    //#region Métodos principais
    cron.schedule('*/5 * * * * *', async() => {

        let _markersRepository = new application.Infra.Data.Repositories.EvaluationMarkersDAO();

        await Include(_markersRepository);
        await Activate(_markersRepository);
        await Disable(_markersRepository);
    });

    //#endregion Métodos principais

    //#region  métodos auxiliares logicos

    var Disable = async function(_markersRepository) {
        let enumStatus = _shared.GetEnumStatus();
        let data = await _markersRepository.Get(enumStatus.enabled);

        data = (data.length >= 1) ? data[0] : [];

        if (data != undefined || data.length > 0) {
            await DisableCurrentEvaluationMarker(data, _markersRepository)
        }
    }

    var Activate = async function(_markersRepository) {
        let enumStatus = _shared.GetEnumStatus();
        let data = await _markersRepository.Get(enumStatus.inWaiting);

        data = (data.length >= 1) ? data[0] : [];

        if (data != undefined || data.length > 0) {
            await ActivateNewEvaluationMarker(data, _markersRepository)
        }
    }

    var Include = async function(_markersRepository) {
        let enumStatus = _shared.GetEnumStatus();
        let data = await _markersRepository.Get(enumStatus.enabled);

        data = (data.length >= 1) ? data[0] : [];

        if (data != undefined || data.length > 0) {
            await IncludeNewEvaluationMarker(data, _markersRepository)
        }
    }

    var IncludeNewEvaluationMarker = async function(data, _markersRepository) {

        let objectDescription = GetStatusAndDescription(data)

        if (objectDescription.status) {
            let analisy = await _markersRepository.ValidateByDescription(objectDescription.description)

            if (analisy.status == false && analisy.count == 0) {
                let object = await GetObjectFinal(objectDescription.description, data, _markersRepository);
                await _markersRepository.Include(object)
            }
        }
    }

    var ActivateNewEvaluationMarker = async function(data, _markersRepository) {
        if (AnalyzeTimeToActivateOrDisable(data.initialDate)) {

            if (analisy.status == false && analisy.count == 0) {
                let enumStatus = _shared.GetEnumStatus();
                await _markersRepository.UpdateStatus(enumStatus.enabled, data.id)
            }
        }
    }

    var DisableCurrentEvaluationMarker = async function(data, _markersRepository) {

        if (AnalyzeTimeToActivateOrDisable(data.endDate)) {

            if (analisy.status == false && analisy.count == 0) {
                let enumStatus = _shared.GetEnumStatus();
                await _markersRepository.UpdateStatus(enumStatus.disabled, data.id);
            }
        }
    }

    var AnalyzeTimeToActivateOrDisable = function(date) {

        datenow = moment().locale('pt-br');

        let currentDates = GetMonthAndYearInIntegerValues(date);
        let nowDates = GetMonthAndYearInIntegerValues(datenow.format('L'));

        return (currentDates.dateDay <= nowDates.dateDay && currentDates.dateMonth <= nowDates.dateMonth && currentDates.dateYear <= nowDates.dateYear)

    }

    var GetStatusAndDescription = function(object) {

        let enumDates = _shared.GetEnumMonth();
        let enumPeriod = _shared.GetEnumPeriod();

        datenow = moment().locale('pt-br');

        limitDates = GetMonthAndYearInIntegerValues(object.limiteDate);
        nowDates = GetMonthAndYearInIntegerValues(datenow.format('L'));

        let data = {}

        if (limitDates.dateMonth <= nowDates.dateMonth) {

            let period =
                (object.period < limitDates.dateMonth && object.period == enumPeriod.semester) ? 1 :
                (object.period > limitDates.dateMonth && object.period == enumPeriod.semester) ? 2 :
                (enumDates.october <= limitDates.dateMonth && enumDates.december >= limitDates.dateMonth && object.period == enumPeriod.quarter) ? 1 :
                (enumDates.january <= limitDates.dateMonth && enumDates.march >= limitDates.dateMonth && object.period == enumPeriod.quarter) ? 2 :
                (enumDates.april <= limitDates.dateMonth && enumDates.june >= limitDates.dateMonth && object.period == enumPeriod.quarter) ? 3 :
                (enumDates.july <= limitDates.dateMonth && enumDates.september >= limitDates.dateMonth && object.period == enumPeriod.quarter) ? 4 : 0;

            let year = (period != 1) ? nowDates.dateYear : nowDates.dateYear + 1;

            let descriptionMarker = `${period} periodo ${year}`;

            data.description = descriptionMarker;
            data.status = true;
            return data;
        }

        data.status = false;
        return data;
    }

    var GetMonthAndYearInIntegerValues = function(date) {
        let limitDateFormatted = moment(date, "DDMMYYYY");
        let data = {}

        data.dateDay = new Date(limitDateFormatted.format('L')).getDate();
        data.dateMonth = new Date(limitDateFormatted.format('L')).getMonth() + 1;
        data.dateYear = new Date(limitDateFormatted.format('L')).getFullYear();

        return data;
    }

    var GetObjectFinal = async function(description, data, _markersRepository) {
        let object = {};

        let dates = GetPeriodDates(description, data);

        object.description = description;
        object.period = data.period;
        object.initialDate = dates.initialDate;
        object.limiteDate = dates.limiteDate;
        object.endDate = dates.endDate;

        return object;
    }

    var GetPeriodDates = function(description, data) {
        let enumPeriod = _shared.GetEnumPeriod();
        let enumDates = _shared.GetEnumMonth();

        let object = {}

        let period = description.substring(0, 1);

        let endDates = GetMonthAndYearInIntegerValues(data.endDate)

        let year = (period == '1') ? endDates.dateYear + 1 : endDates.dateYear;

        if (data.period == enumPeriod.semester) {
            // para semestre no primeiro periodo
            if (period == '1') {
                object.initialDate = GetDateFormtPatterMysql('01', enumDates.january, year);
                object.limiteDate = GetDateFormtPatterMysql('15', enumDates.may, year);
                object.endDate = GetMonthWithLastDay(enumDates.june, year);
            }
            // para semestre no segundo periodo
            else if (period == '2') {
                object.initialDate = GetDateFormtPatterMysql('01', enumDates.july, year);
                object.limiteDate = GetDateFormtPatterMysql('15', enumDates.november, year);
                object.endDate = GetMonthWithLastDay(enumDates.december, year);
            }

        } else if (data.period == enumPeriod.quarter) {

            // para trimestre no primeiro periodo 
            if (period == '1') {
                object.initialDate = GetDateFormtPatterMysql('01', enumDates.january, year);
                object.limiteDate = GetDateFormtPatterMysql('15', enumDates.february, year);
                object.endDate = GetMonthWithLastDay(enumDates.march, year);
            }
            // para trimestre no segundo periodo 
            else if (period == '2') {
                object.initialDate = GetDateFormtPatterMysql('01', enumDates.april, year);
                object.limiteDate = GetDateFormtPatterMysql('15', enumDates.may, year);
                object.endDate = GetMonthWithLastDay(enumDates.june, year);
            }
            // para trimestre no terceiro periodo 
            else if (period == '3') {
                object.initialDate = GetDateFormtPatterMysql('01', enumDates.july, year);
                object.limiteDate = GetDateFormtPatterMysql('15', enumDates.august, year);
                object.endDate = GetMonthWithLastDay(enumDates.september, year);
            }
            // para trimestre no quarto periodo 
            else if (period == '4') {
                object.initialDate = GetDateFormtPatterMysql('01', enumDates.october, year);
                object.limiteDate = GetDateFormtPatterMysql('15', enumDates.november, year);
                object.endDate = GetMonthWithLastDay(enumDates.december, year);
            }
        }

        return object;
    }

    var GetDateFormtPatter = function(day, month, year) {
        let newMonth = (month < 10) ? `0${month}` : month;

        return `${day}/${newMonth}/${year}`;
    }

    var GetDateFormtPatterMysql = function(day, month, year) {
        let newMonth = (month < 10) ? `0${month}` : month;

        return `${year}-${newMonth}/${day}`;
    }

    var GetMonthWithLastDay = function(month, year) {
        let newEndDate = moment(GetDateFormtPatter('01', month, year), "DDMMYYYY");

        newEndDate.locale('pt-br');
        newEndDate.subtract(1, 'days').format('L')

        let newEndDates = GetMonthAndYearInIntegerValues(newEndDate.subtract(1, 'days').format('L'))
        let newDay = (newEndDates.dateDay < 10) ? `0${newEndDates.dateDay}` : newEndDates.dateDay;

        return GetDateFormtPatterMysql(newDay, month, year);
    }

    //#endregion métodos auxiliares logicos
}