const ws = new WebSocket('ws://localhost:5001');



const channel = data["params"]["owner"] + data["params"]["classroom"]; //client's channel
console.log(channel);
const uuid = data["user"]["email"]; //client's uuid (email XD)
const userJoin = {
  type: "userjoin",
  data: {
    uuid: uuid,
    channel: channel
  }
}
const knownUUIDs = [uuid];

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

if (document.getElementById("videoenforcer") != null) {
  document.getElementById("videoenforcer").onclick = () => {
    const oldValue = !document.getElementById("videoenforcer").checked;
    const newValue = !oldValue;
    const settingUpdate = {
      type: "settingupdate",
      data: {
        type: "video",
        old: oldValue,
        new: newValue,
        channel: channel
      }
    };
    ws.send(JSON.stringify(settingUpdate));
    const message = {
      type: "usermessage",
      data: {
        avatar: data.avatar,
        name: "ADMIN",
        value: `Updated mandatory video settings: ${oldValue} --> ${newValue}`,
        channel: channel
      }
    };
    ws.send(JSON.stringify(message));
  }
}

document.getElementById("videocheck").onclick = () => {
  const value = document.getElementById("videocheck").checked;
  if (value === false) {
    stopVideo();
  } else {
    startVideo();
  }
}

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


const video = document.querySelector("video");

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;
});


const getFrame = () => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const data = canvas.toDataURL('image/png');
  return data;
}

const startVideo = () => {
  console.log("we kinda can't do anything about this one");
}

const stopVideo = () => {
  video.srcObject.getTracks().forEach(track => {
    track.stop();
  });
}

//handle user join
const handleUserJoin = (userJoinData) => {
  if (knownUUIDs.includes(userJoinData["data"].uuid)) return;
  console.log("found another person!");
  knownUUIDs.push(userJoinData["data"].uuid);
  console.log("append");
  $("#zoomi").append(`<div class="col-sm-4"> <img style="width: 100%; height: auto" id=${userJoinData["data"].uuid}></img></div>`);
  ws.send(JSON.stringify(userJoin));
};

const handleSettingUpdate = (settingData) => {
  if (settingData["data"].new == true) {
    startVideo();
    document.getElementById("videocheck").disabled = true;
    document.getElementById("videocheck").checked = true;
    data.classroom.enforceVideo = true;
  } else {
    document.getElementById("videocheck").disabled = false;
    data.classroom.enforceVideo = false;
  }
}

const FPS = 3;
ws.onopen = (d) => { 
  console.log("connected to ws server"); 
  console.log(userJoin);
  ws.send(JSON.stringify(userJoin));
  const settingUpdate = { //mimic a setting change, except not really
    type: "settingupdate",
    data: {
      type: "video",
      old: false,
      new: data.classroom.enforceVideo,
      channel: channel
    }
  };
  if (data.user.email != data.classroom.owner) { handleSettingUpdate(settingUpdate); }

  const imgUpdate = {
    type: "userimg",
    data: {
      uuid: uuid,
      channel: channel
    }
  };
  
  
  const t = setInterval(() => {
    //if (video.srcObject.getTracks()[0].readyState === "ended") return;
    imgUpdate["data"]["image"] = getFrame();
    ws.send(JSON.stringify(imgUpdate));
  }, 1000/FPS);
  
  
}

const handleImageUpdate = (imageData) => {
  if (imageData["data"]["uuid"] == uuid) return;
  if (!knownUUIDs.includes(imageData["data"]["uuid"])) return;
  document.getElementById(imageData["data"]["uuid"]).src = imageData["data"]["image"];
}

ws.onmessage = function incoming(socketData) {
  socketData = JSON.parse(socketData.data);
  if (channel !== socketData["data"]["channel"]) return;
  if (socketData["type"] === "usermessage") {
    handleChat(socketData)
  } else if (socketData["type"] === "userjoin") {
    handleUserJoin(socketData);
  } else if (socketData["type"] === "userimg") {
    handleImageUpdate(socketData);
  } else if (socketData["type"] === "settingupdate") {
    handleSettingUpdate(socketData);
  }
};
