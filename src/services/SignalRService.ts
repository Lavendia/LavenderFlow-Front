import * as signalR from "@microsoft/signalr"

type HandlerMap = {
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
    onAssignmentUpdated?: (assignment: any) => void
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
    onLabelAddedToCard?: (cardLabel: any) => void
    onLabelRemovedFromCard?: (cardLabelId: number) => void
    onChatMessageCreated?: (message: any) => void
    onChatMessageUpdated?: (message: any) => void
    onChatMessageDeleted?: (messageId: number) => void
}

type HandlerKey = keyof HandlerMap

class SignalRService {
    private connection: signalR.HubConnection | null = null
    private subscribers = new Map<string, Map<HandlerKey, Function>>()

    private emit(event: HandlerKey, ...args: any[]) {
        this.subscribers.forEach(handlerMap => {
            const fn = handlerMap.get(event)
            if (fn) fn(...args)
        })
    }

    subscribe(subscriberId: string, handlers: Partial<HandlerMap>) {
        if (!this.subscribers.has(subscriberId)) {
            this.subscribers.set(subscriberId, new Map())
        }
        const map = this.subscribers.get(subscriberId)!
        for (const [key, fn] of Object.entries(handlers) as [HandlerKey, Function | undefined][]) {
            if (fn === undefined) {
                map.delete(key)
            } else {
                map.set(key, fn)
            }
        }
    }

    unsubscribe(subscriberId: string) {
        this.subscribers.delete(subscriberId)
    }

    setHandlers(handlers: Partial<HandlerMap>) {
        this.subscribe("board", handlers)
    }

    async connect(boardId: string) {
        try {
            if (this.connection) {
                const state = this.connection.state
                if (state === signalR.HubConnectionState.Connected ||
                    state === signalR.HubConnectionState.Connecting ||
                    state === signalR.HubConnectionState.Reconnecting) return
            }

            this.connection = new signalR.HubConnectionBuilder()
                .withUrl("http://localhost:5000/lavenderFlowHub", {
                    accessTokenFactory: () => localStorage.getItem("authToken") || ""
                })
                .withAutomaticReconnect()
                .build()

            this.connection.on("BoardCreated",          (b)   => this.emit("onBoardCreated", b))
            this.connection.on("BoardUpdated",          (b)   => this.emit("onBoardUpdated", b))
            this.connection.on("BoardDeleted",          (id)  => this.emit("onBoardDeleted", id))
            this.connection.on("UserAddedToBoard",      (u)   => this.emit("onUserAddedToBoard", u))
            this.connection.on("BoardUserUpdated",      (u)   => this.emit("onBoardUserUpdated", u))
            this.connection.on("UserRemovedFromBoard",  (id)  => this.emit("onUserRemovedFromBoard", id))
            this.connection.on("CardCreated",           (c)   => this.emit("onCardCreated", c))
            this.connection.on("CardUpdated",           (c)   => this.emit("onCardUpdated", c))
            this.connection.on("CardDeleted",           (id)  => this.emit("onCardDeleted", id))
            this.connection.on("AssignmentCreated",     (a)   => this.emit("onAssignmentCreated", a))
            this.connection.on("AssignmentDeleted",     (id)  => this.emit("onAssignmentDeleted", id))
            this.connection.on("ChecklistCreated",      (cl)  => this.emit("onChecklistCreated", cl))
            this.connection.on("ChecklistUpdated",      (cl)  => this.emit("onChecklistUpdated", cl))
            this.connection.on("ChecklistDeleted",      (id)  => this.emit("onChecklistDeleted", id))
            this.connection.on("ChecklistItemCreated",  (i)   => this.emit("onChecklistItemCreated", i))
            this.connection.on("ChecklistItemUpdated",  (i)   => this.emit("onChecklistItemUpdated", i))
            this.connection.on("ChecklistItemDeleted",  (id)  => this.emit("onChecklistItemDeleted", id))
            this.connection.on("ListCreated",           (l)   => this.emit("onListCreated", l))
            this.connection.on("ListUpdated",           (l)   => this.emit("onListUpdated", l))
            this.connection.on("ListDeleted",           (id)  => this.emit("onListDeleted", id))
            this.connection.on("LabelAddedToCard",      (la)  => this.emit("onLabelAddedToCard", la))
            this.connection.on("LabelRemovedFromCard",  (lr)  => this.emit("onLabelRemovedFromCard", lr))
            this.connection.on("ChatMessageCreated",    (m)   => this.emit("onChatMessageCreated", m))
            this.connection.on("ChatMessageUpdated",    (m)   => this.emit("onChatMessageUpdated", m))
            this.connection.on("ChatMessageDeleted",    (id)  => this.emit("onChatMessageDeleted", id))

            await this.connection.start()
            await this.connection.invoke("JoinBoard", Number(boardId))
            console.log("SignalR connected and joined board:", boardId)

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
            this.subscribers.clear()
        } catch (error) {
            console.error("SignalR disconnection failed:", error)
        }
    }

    getConnection() {
        return this.connection
    }
}

export const signalRService = new SignalRService()