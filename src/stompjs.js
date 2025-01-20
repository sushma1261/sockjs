import { Client } from "@stomp/stompjs";
import "./style.css";

let retryCount = 0;
const maxRetries = 3;

const inputBox = document.getElementById("input-box");
const token = document.getElementById("token");
const useToken = document.getElementById("use-token");
const inputContent = document.getElementById("input-content");
const inputPublishPath = document.getElementById("input-path-publish");

const connectButton = document.getElementById("connect");
const disconnectButton = document.getElementById("disconnect");
const subscribeButton = document.getElementById("subscribe");
const publishButton = document.getElementById("publish");
const messages = document.getElementById("messages");
const jsonError = document.getElementById("jsonError");
const serverUrl = token.value
  ? "ws://localhost:8080/ws?token=" + token.value
  : "ws://localhost:8080/ws";

subscribeButton.addEventListener("click", function () {
  const inputValue = inputBox.value;
  console.log(inputValue);
  const frag = document.createDocumentFragment();
  const div = document.createElement("div");
  div.innerHTML = "Sending: " + inputValue;
  frag.appendChild(div);
  messages.appendChild(frag);
  client.subscribe(`${inputValue}`, (message) => {
    console.log(`Received: ${message.body}`);
    const frag = document.createDocumentFragment();
    const div = document.createElement("div");
    div.innerHTML =
      "Received for: " + inputValue + " <br/ > Message: " + message.body;
    frag.appendChild(div);
    messages.appendChild(frag);
  });
});

publishButton.addEventListener("click", function () {
  const inputValue = inputPublishPath.value;
  const content = inputContent.value;
  console.log(inputValue, content);
  const frag = document.createDocumentFragment();
  const div = document.createElement("div");
  div.innerHTML = "Sending: " + inputValue + " Content: " + content;
  frag.appendChild(div);
  messages.appendChild(frag);
  client.publish({
    destination: inputValue,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(JSON.parse(content)),
  });
});

// document.addEventListener("DOMContentLoaded", function () {
//   const form = document.getElementById("inputForm");

//   form.addEventListener("submit", function (event) {
//     // Prevent the form from submitting and reloading the page
//     event.preventDefault();

//     const inputValue = inputBox.value;
//     console.log(inputValue);
//   });
// });
// Function to handle retries
// const attemptReconnect = () => {
//   if (retryCount < maxRetries) {
//     retryCount++;
//     console.log(
//       `Retrying connection... Attempt ${retryCount} of ${maxRetries}`
//     );
//     setTimeout(() => client.activate(), 3000); // Retry after 3 seconds
//   } else {
//     console.log("Max retry attempts reached. Giving up.");
//   }
// };
// attemptReconnect();
// Activate the client initially

connectButton.addEventListener("click", function () {
  console.log(token.value);
  client.brokerURL = useToken.checked
    ? "ws://localhost:8080/ws?token=" + token.value
    : "ws://localhost:8080/ws";
  client.activate();
});

disconnectButton.addEventListener("click", function () {
  console.log("Disconnecting");
  client.deactivate();
});

const client = new Client({
  connectHeaders: {
    Authorization: `Bearer ${token}`,
    custom: "test",
    "Sec-Fetch-Site": "same-site", // Ensure appropriate fetch site context (Same-site)
    "Sec-Fetch-Mode": "cors",
  },
  // webSocketFactory: () => new SockJS("http://localhost:8080/ws"),

  onConnect: () => {
    console.log("Connected to WebSocket");
    retryCount = 0; // Reset retry count on successful connection
    const frag = document.createDocumentFragment();
    const div = document.createElement("div");
    div.innerHTML = "Connected...";
    frag.appendChild(div);
    messages.appendChild(frag);
    updateStatus(true);
  },
  onDisconnect: () => {
    console.log("Disconnected from WebSocket");
    updateStatus(false);
  },
  onStompError: (frame) => {
    console.log(`Broker Error: ${frame.headers["message"]}`);
    attemptReconnect();
  },
  onWebSocketError: (error) => {
    client.connectHeaders;
    console.log(`WebSocket Error: ${error}`, client.connectHeaders);
    attemptReconnect();
  },
});

function updateStatus(isConnected) {
  const statusDiv = document.getElementById("status");
  if (isConnected) {
    statusDiv.textContent = "Status: Connected";
    statusDiv.className = "connected";
  } else {
    statusDiv.textContent = "Status: Disconnected";
    statusDiv.className = "disconnected";
  }
}
