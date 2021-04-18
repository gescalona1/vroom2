const WebSocketServer = require("ws").Server;

module.exports = class {
    constructor(port) {
        this.wss = new WebSocketServer({port: port});
        this.listeners = new Map();

        this.wss.on("connection", ws => {
            console.info("websocket connection open");
            ws.on("message", (data, flags) => {

                data = JSON.parse(data);
                const messageType = data["type"];
                console.log("SERVER RECIEVED A MESSAGE!")
                if (messageType == undefined) return; //cause an error
                console.log("passed undefined");
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
        const d = JSON.stringify(message);
        console.log(this.wss.clients);
        this.wss.clients.forEach(function each(client) {
            client.send(d);
         });
    }

    recieve(messagetype, callback) {
        let arr = this.listeners.get(messagetype);
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