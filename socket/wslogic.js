const chat = (ws) => {
  ws.recieve("usermessage", data => {
    console.log("send it back " + data);
    ws.send(data);
  });
}

const join = (ws) => {
  ws.recieve("userjoin", data => {
    ws.send(data);
  });
}
const interactions = (ws) => {
  chat(ws);
  join(ws);
}
module.exports = interactions;