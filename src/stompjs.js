import { Client } from "@stomp/stompjs";
const token = "test";
const serverUrl = "ws://localhost:8080/ws";
const client = new Client({
  brokerURL: serverUrl,
  connectHeaders: {
    Authorization: `Bearer ${token}`, // Add Bearer token here
  },
  onConnect: () => {
    console.log("Connected to WebSocket");

    // Subscribe to a destination topic (modify topic as per your backend)
    client.subscribe("/ping", (message) => {
      console.log(`Received: ${message.body}`);
    });
  },
  onDisconnect: () => {
    console.log("Disconnected from WebSocket");
  },
  onStompError: (frame) => {
    console.log(`Broker Error: ${frame.headers["message"]}`);
  },
  onWebSocketError: (error) => {
    console.log(`WebSocket Error: ${error}`);
  },
});

client.activate();
