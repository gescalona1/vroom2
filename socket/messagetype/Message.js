module.exports = class {
    constructor(type, url) {
        this.type = type;
        this.url = url;
    }

    toJSON() {
        return {
            type: this.type,
            url: this.url
        };
    }
}