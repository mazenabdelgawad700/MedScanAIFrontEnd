import * as signalR from "@microsoft/signalr";
import { API_BASE } from "../../utils/Constants.ts";

const getHubUrl = () => {
  const baseUrl = API_BASE.replace(/\/api\/?$/, "");
  return `${baseUrl}/appointmentHub`;
};

class SignalRService {
  constructor() {
    this.connection = null;
    this.started = false;
  }

  startConnection = async () => {
    if (this.started && this.connection) {
       console.log("SignalRService: Connection already started.");
       return;
    }

    console.log("SignalRService: Initializing connection to", getHubUrl());

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(getHubUrl(), {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }) 
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.onreconnecting(err => console.log("SignalRService: Reconnecting...", err));
    this.connection.onreconnected(id => console.log("SignalRService: Reconnected. Connection ID:", id));
    this.connection.onclose(err => {
      console.log("SignalRService: Connection closed.", err);
      this.started = false;
    });

    try {
      await this.connection.start();
      console.log("SignalRService: Connected successfully. ID:", this.connection.connectionId);
      this.started = true;
    } catch (err) {
      console.error("SignalRService: Connection Failed", err);
      this.started = false;
      setTimeout(this.startConnection, 5000);
    }
  };

  on = (methodName, newMethod) => {
    if (!this.connection) return;
    console.log(`SignalRService: Subscribing to '${methodName}'`);
    this.connection.on(methodName, (...args) => {
        console.log(`SignalRService: Received '${methodName}'`, args);
        newMethod(...args);
    });
  };

  off = (methodName, method) => {
    if (!this.connection) return;
    this.connection.off(methodName, method);
  };

  invoke = async (methodName, ...args) => {
    if (!this.connection) {
       console.error("SignalRService: Cannot invoke, connection is null.");
       return;
    }
    
    if (this.connection.state !== signalR.HubConnectionState.Connected) {
       console.warn(`SignalRService: Cannot invoke '${methodName}', state is: ${this.connection.state}`);
       // Optionally try to reconnect?
       return;
    }

    try {
        console.log(`SignalRService: Invoking '${methodName}' with args:`, args);
        return await this.connection.invoke(methodName, ...args);
    } catch (e) {
        console.error(`SignalRService: Error invoking '${methodName}'`, e);
    }
  };
}

export default new SignalRService();
