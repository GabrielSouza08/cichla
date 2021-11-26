class Notifier {
    constructor() {}

    NotificationTemplate(_status, _data, _message) {
        return {
            success: _status,
            data: _data,
            msg: [{ text: _message }],
        };
    };
}

module.exports = Notifier;