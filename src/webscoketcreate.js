const ws = new WebSocket("ws://localhost:8080/ws");

ws.onopen = () => {
  console.log("Connected to WebSocket server");
  ws.send("Hello Server");
};

ws.onmessage = (event) => {
  console.log("Message from server:", event.data);
  document.getElementById("messages").innerHTML += `<p>${event.data}</p>`;
};

ws.onclose = () => {
  console.log("WebSocket connection closed");
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

document.getElementById("sendMessage").addEventListener("click", () => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send("Hello from client!");
  } else {
    console.warn("WebSocket is not open.");
  }
});
