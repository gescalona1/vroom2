const Message = require(__dirname + "/messagetype/Message.js");
const WebSocketServer = require("ws").Server;

module.exports = class {
    constructor(port) {
        this.wss = new WebSocketServer({port: port});
        this.listeners = new Map();

        this.wss.on("connection", ws => {
            console.info("websocket connection open");
        
            const userId = new Date().getTime();

            ws.on("message", (data, flags) => {
                data = JSON.parse(data);
                const messageType = data["type"];
                if (messageType == undefined) return; //cause an error
                const callbacks = this.listeners.get(messageType);
                if (callbacks == undefined || callbacks.length == 0) return;
                for (const callback of callbacks) callback(data);
            });
        
            ws.on("close", () => {
                console.log("websocket connection close");
            });
        });
    }

    send(message) {
        if (!(message instanceof Message)) return;
        this.ws.send(JSON.stringify(message.toJSON()));
    }

    recieve(messagetype, callback) {
        const arr = this.listeners.get(messagetype);
        if (arr == undefined) arr = [];
        arr.push(callback);
        this.listeners.set(messagetype, arr);
    }

    close() {
        for(const client of this.wss.clients){
            client.close();
        }
        
        this.wss.close();
    }
}