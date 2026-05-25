export const APIChatMessage = {
    async getChatMessages() {
        const response = await fetch("/api/chatmessages", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })

        return await response.json()
    },

    async getChatMessageById(id: string) {
        const response = await fetch(`/api/chatmessages/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })

        return await response.json()
    },

    async getChatMessagesByCardId(cardId: string) {
        const response = await fetch(`/api/chatmessages/card/${cardId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })

        return await response.json()
    },

    async createChatMessage(text: string, cardId: number, userId: number) {
        const response = await fetch("/api/chatmessages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({
                text,
                cardId,
                userId
            })
        })

        return await response.json()
    },

    async updateChatMessage(
        id: string,
        data: {
            text?: string
        }
    ) {
        const response = await fetch(`/api/chatmessages/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify(data)
        })

        return await response.json()
    },

    async deleteChatMessage(id: string) {
        await fetch(`/api/chatmessages/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
    }
}