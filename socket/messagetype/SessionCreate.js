const Message = require("./Message.js");

module.exports = class extends Message {
    constructor(url, owner) {
        super("sessioncreate", url);
        this.owner = owner;
    }

    toJSON() {
        const s = super.toJSON();
        s["owner"] = this.owner;
        return s;
    }
}