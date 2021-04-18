const ws = new WebSocket('ws://localhost:5001');


const channel = data["params"]["owner"] + data["params"]["classroom"]; //client's channel
const uuid = data["user"]["email"]; //client's uuid (email XD)
const userJoin = {
  type: "userjoin",
  data: {
    uuid: uuid,
    channel: channel
  }
}
const knownUUIDs = [uuid];
ws.onopen = (data) => { 
  console.log("connected to ws server"); 
  console.log(userJoin);
  ws.send(JSON.stringify(userJoin));
}

//chat stuff
document.getElementById("btn-chat").onclick = () => {
  const name = (data.user.profile.name) ? data.user.profile.name : data.user.email;
  const time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  const value = document.getElementById('btn-input').value;
  const avatar = data.avatar;
  $("#bigchat").append(`
  <li class="right clearfix">
    <span class="chat-img pull-right">
      <img src="${avatar}" alt="User Avatar" class="img-circle" width="50" height="50"/>
    </span>
    <div class="chat-body clearfix">
      <div class="header">
          <small class=" text-muted"><span class="glyphicon glyphicon-time"></span>${time}</small>
          <strong class="pull-right primary-font">${name}</strong>
      </div>
      <p style="color: black;">
          ${value}
      </p>
    </div>
  </li>`);

  const chatMessage = {
    type: "usermessage",
    data: {
      avatar: data.avatar,
      name: name,
      value: value,
      channel: channel
    }
  };
  ws.send(JSON.stringify(chatMessage));
  document.getElementById('btn-input').value = "";
};

const handleChat = (msgData) => {
  const name = msgData["data"].name;
  const time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  const value = msgData["data"].value;
  const avatar = msgData["data"].avatar;
  if (data.avatar === avatar) return;
  const text = `
  <li class="right clearfix">
    <span class="chat-img pull-right">
      <img src="${avatar}" alt="User Avatar" class="img-circle" width="50" height="50"/>
    </span>
    <div class="chat-body clearfix">
      <div class="header">
          <small class=" text-muted"><span class="glyphicon glyphicon-time"></span>${time}</small>
          <strong class="pull-right primary-font">${name}</strong>
      </div>
      <p style="color: black;">
          ${value}
      </p>
    </div>
  </li>`;
  $("#bigchat").append(text);
}

//webcam stuff

const hasGetUserMedia = () => { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia); };
const constraints = {
  video: true,
  audio: false
};

/*
const video = document.querySelector("video");
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;
});
*/

const handleUserJoin = (userJoinData) => {
  console.log("found a person!");
  console.log(JSON.stringify(userJoinData));
  if (knownUUIDs.includes(userJoinData["data"].uuid)) return;
  console.log("found another person!");
  knownUUIDs.push(userJoinData["data"].uuid);
  $("#zoomi").append(`<div class="col-sm-4"><canvas id=${userJoinData["data"].uuid}></canvas></div>`);
  ws.send(JSON.stringify(userJoin));
};

ws.onmessage = function incoming(socketData) {
  socketData = JSON.parse(socketData.data);
  if (channel !== socketData["data"]["channel"]) return;
  if (socketData["type"] === "usermessage") {
    handleChat(socketData)
  } else if (socketData["type"] === "userjoin") {
    handleUserJoin(socketData);
  }
};
