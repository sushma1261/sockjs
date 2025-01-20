import { Client } from "@stomp/stompjs";
import "./style.css";
const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NjcwNDY1MS1mYjMyLTQ0MjctOGZhNi1jYmZmNTI2YTg3NWQiLCJpYXQiOjE3MzczMzY4NjIsImV4cCI6MTczNzk0MTY2Mn0.nugMjgooq5Ad8MMmFz9SX0SEl7cXIIi7N5emO1aB06o";
const serverUrl = "ws://localhost:8080/ws";
let retryCount = 0;
const maxRetries = 3;

const inputBox = document.getElementById("input-box");
const inputContent = document.getElementById("input-content");
const inputPublishPath = document.getElementById("input-path-publish");

const subscribeButton = document.getElementById("subscribe");
const publishButton = document.getElementById("publish");
const messages = document.getElementById("messages");

const client = new Client({
  brokerURL: serverUrl,
  // webSocketFactory: () => {
  //   const socket = new WebSocket(serverUrl, ["Authorization"], {
  //     Headers: {
  //       Authorization: `Bearer ${token}`,
  //       custom: "test",
  //       "Sec-Fetch-Site": "same-site", // Ensure appropriate fetch site context (Same-site)
  //       "Sec-Fetch-Mode": "cors",
  //     },
  //   });
  //   socket.withCredentials = true; // Ensure cookies/auth headers are sent
  //   return socket;
  // },
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
    // // Subscribe to a destination topic (modify topic as per your backend)
    // client.subscribe("/ping", (message) => {
    //   console.log(`Received: ${message.body}`);
    // });
  },
  onDisconnect: () => {
    console.log("Disconnected from WebSocket");
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
    body: { messages: content },
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

client.activate();
