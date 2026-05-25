import * as signalR from "@microsoft/signalr"

interface SignalRHandlers {
    onBoardCreated?: (board: any) => void
    onBoardUpdated?: (board: any) => void
    onBoardDeleted?: (boardId: number) => void
    onUserAddedToBoard?: (user: any) => void
    onBoardUserUpdated?: (user: any) => void
    onUserRemovedFromBoard?: (userId: number) => void
    onCardCreated?: (card: any) => void
    onCardUpdated?: (card: any) => void
    onCardDeleted?: (cardId: number) => void
    onAssignmentCreated?: (assignment: any) => void
    onAssignmentDeleted?: (assignmentId: number) => void
    onChecklistCreated?: (checklist: any) => void
    onChecklistUpdated?: (checklist: any) => void
    onChecklistDeleted?: (checklistId: number) => void
    onChecklistItemCreated?: (item: any) => void
    onChecklistItemUpdated?: (item: any) => void
    onChecklistItemDeleted?: (itemId: number) => void
    onListCreated?: (list: any) => void
    onListUpdated?: (list: any) => void
    onListDeleted?: (listId: number) => void
    onChatMessageCreated?: (message: any) => void
    onChatMessageUpdated?: (message: any) => void
    onChatMessageDeleted?: (messageId: number) => void
}

class SignalRService {
    private connection: signalR.HubConnection | null = null
    private handlers: SignalRHandlers = {}

    async connect(boardId: string) {
        try {
            if (this.connection) {
                const state = this.connection.state
                if (state === signalR.HubConnectionState.Connected) {
                    await this.connection.invoke("JoinBoard", Number(boardId))
                    return
                }
                if (state === signalR.HubConnectionState.Connecting ||
                    state === signalR.HubConnectionState.Reconnecting) {
                    return
                }
            }
            try {
                this.connection = new signalR.HubConnectionBuilder()
                    .withUrl("http://localhost:5000/lavenderFlowHub", {
                        accessTokenFactory: () => localStorage.getItem("authToken") || ""
                    })
                    .withAutomaticReconnect()
                    .build()

                // Board events
                this.connection.on("BoardCreated", (board) => this.handlers.onBoardCreated?.(board))
                this.connection.on("BoardUpdated", (board) => this.handlers.onBoardUpdated?.(board))
                this.connection.on("BoardDeleted", (boardId) => this.handlers.onBoardDeleted?.(boardId))

                // Board user events
                this.connection.on("UserAddedToBoard", (user) => this.handlers.onUserAddedToBoard?.(user))
                this.connection.on("BoardUserUpdated", (user) => this.handlers.onBoardUserUpdated?.(user))
                this.connection.on("UserRemovedFromBoard", (userId) => this.handlers.onUserRemovedFromBoard?.(userId))

                // Card events
                this.connection.on("CardCreated", (card) => this.handlers.onCardCreated?.(card))
                this.connection.on("CardUpdated", (card) => this.handlers.onCardUpdated?.(card))
                this.connection.on("CardDeleted", (cardId) => this.handlers.onCardDeleted?.(cardId))

                // Assignment events
                this.connection.on("AssignmentCreated", (assignment) => this.handlers.onAssignmentCreated?.(assignment))
                this.connection.on("AssignmentDeleted", (assignmentId) => this.handlers.onAssignmentDeleted?.(assignmentId))

                // Checklist events
                this.connection.on("ChecklistCreated", (checklist) => this.handlers.onChecklistCreated?.(checklist))
                this.connection.on("ChecklistUpdated", (checklist) => this.handlers.onChecklistUpdated?.(checklist))
                this.connection.on("ChecklistDeleted", (checklistId) => this.handlers.onChecklistDeleted?.(checklistId))

                // Checklist item events
                this.connection.on("ChecklistItemCreated", (item) => this.handlers.onChecklistItemCreated?.(item))
                this.connection.on("ChecklistItemUpdated", (item) => this.handlers.onChecklistItemUpdated?.(item))
                this.connection.on("ChecklistItemDeleted", (itemId) => this.handlers.onChecklistItemDeleted?.(itemId))

                // List events
                this.connection.on("ListCreated", (list) => this.handlers.onListCreated?.(list))
                this.connection.on("ListUpdated", (list) => this.handlers.onListUpdated?.(list))
                this.connection.on("ListDeleted", (listId) => this.handlers.onListDeleted?.(listId))

                // Chat Messages
                this.connection.on("ChatMessageCreated", (message) => this.handlers.onChatMessageCreated?.(message))
                this.connection.on("ChatMessageUpdated", (message) => this.handlers.onChatMessageUpdated?.(message))
                this.connection.on("ChatMessageDeleted", (messageId) => this.handlers.onChatMessageDeleted?.(messageId))


                await this.connection.start()

                // Join board group
                if (this.connection) {
                    await this.connection.invoke("JoinBoard", Number(boardId))
                }

                console.log("SignalR connected and joined board:", boardId)
            } catch (error) {
                console.error("SignalR connection failed:", error)
            }
        } catch (error: any) {
            if (error?.message?.includes("stopped during negotiation")) return
            console.error("SignalR connection failed:", error)
        }
}

    async disconnect(boardId: string) {
        try {
            if (this.connection?.state === signalR.HubConnectionState.Connected) {
                await this.connection.invoke("LeaveBoard", Number(boardId))
            }
            await this.connection?.stop()
        } catch (error) {
            console.error("SignalR disconnection failed:", error)
        }
    }

    setHandlers(handlers: SignalRHandlers) {
        this.handlers = { ...this.handlers, ...handlers }
    }

    getConnection() {
        return this.connection
    }
}

export const signalRService = new SignalRService()
