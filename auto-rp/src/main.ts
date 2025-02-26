import './style.css';
// TODO Ugly...
import "../node_modules/quill/dist/quill.snow.css";
import "../node_modules/quill/dist/quill.core.css";
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

import Quill from 'quill';

let messages = [];

const quill = new Quill('#editor', {
  theme: 'snow'
});

const setLoadingState = (statusMessage: string) => {
  const elem = document.getElementById("loadingstate");
  if(elem !== null){
    elem.innerText = statusMessage;
  }
}


const addMessageBox = (message: string, generated: boolean) => {
  const messageCard = document.createElement("div");
  messageCard.innerText = message;
  messageCard.className = "storymessage " + (generated ? "generated":"manual");
  document.getElementById("wholestory")?.append(messageCard)
};

const editorElem = document.getElementById("editor");
const performCompletion = async () => {
  const newMessage = quill.getText().trim();
  if (newMessage.length !== 0) {
    // if no message from the user, ignore it and keep generating
    messages.push(newMessage);
    addMessageBox(newMessage, false);
  }
  setLoadingState("Loading...")
  try {
    const response = await fetch("/api/continue", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({messages})
    });
    const generated_msg = await response.json();
    addMessageBox(generated_msg.new_message, true);
    messages.push(generated_msg.new_message);
    quill.setText("");
    setLoadingState(`Response generated in ${generated_msg.elapsed} seconds`);
  }
  catch(error){
    window.alert(error);
    return;
  }

};

if (editorElem !== null){
  const btnSend = document.createElement("button");
  btnSend.innerText = "Send";
  editorElem.after(btnSend);
  btnSend.addEventListener("click", performCompletion);

  let autoSend:boolean = false;
  const btnSendContinuously = document.createElement("button");
  btnSendContinuously.innerText = "Send periodically";
  editorElem.after(btnSendContinuously);
  const sendStep = async () =>{
    await performCompletion();
    if (autoSend){
      setTimeout(sendStep, 2000);
    }
  }
  btnSendContinuously.addEventListener("click", async () =>{
    autoSend = !autoSend;
    if(autoSend){
      btnSendContinuously.innerText = "Stop sending automatically"
      await sendStep();
    }
    else {
      btnSendContinuously.innerText = "Send periodically"
    }
  });
}
else{
  console.error("no editor element??")
}