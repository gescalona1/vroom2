const Message = require("./Message.js");

module.exports = class extends Message {
    constructor(url, user, sessionid) {
        super("userjoin", url);
        this.user = user;
        this.sessionid = sessionid;
    }

    toJSON() {
        const s = super.toJSON();
        s["user"] = this.user;
        s["sessionid"] = this.sessionid;
        return s;
    }
}