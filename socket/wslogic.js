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

const img = (ws) => {
  ws.recieve("userimg", data => {
    ws.send(data);
  });
}

const setting = (ws) => {
  ws.recieve("settingupdate", data => {
    ws.send(data);
  });
}
const interactions = (ws) => {
  chat(ws);
  join(ws);
  img(ws);
  setting(ws);
}
module.exports = interactions;