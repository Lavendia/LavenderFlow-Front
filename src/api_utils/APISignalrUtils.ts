import * as signalR from "@microsoft/signalr";

export const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/lavenderFlowHub")
    // Remove withAutomaticReconnect — your manual timer handles this
    .build();

let reconnectionTimer: ReturnType<typeof setInterval> | null = null;

export function startReconnectionTimer() {
    if (reconnectionTimer) return;

    reconnectionTimer = setInterval(async () => {
        if (connection.state !== signalR.HubConnectionState.Disconnected) return;

        console.warn("SignalR disconnected. Attempting to reconnect...");
        try {
            await connection.start();
            console.log("SignalR reconnected successfully");
        } catch (error) {
            console.error("SignalR reconnection attempt failed:", error);
        }
    }, 5000);
}

export function stopReconnectionTimer() {
    if (reconnectionTimer) {
        clearInterval(reconnectionTimer);
        reconnectionTimer = null;
    }
}

connection.onreconnected((connectionId?: string) => {
    console.log("SignalR reconnected with ID:", connectionId);
});

connection.onreconnecting((error?: Error) => {
    console.warn("SignalR attempting to reconnect:", error?.message);
});

connection.onclose(() => {
    console.warn("SignalR connection closed. Starting reconnection timer...");
    startReconnectionTimer();
});