export const APICard = {
    async getCards() {
        const response = await fetch("/api/cards", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        return await response.json()
    },
    async getCardById(id: string) {
        const response = await fetch(`/api/cards/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        return await response.json()
    },
    async getCardsByListId(listId: string) {
        const response = await fetch(`/api/cards/list/${listId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        return await response.json()
    },
    async createCard(name: string, order: number, listItemId: number, description: string, deadline?: string) {
        const response = await fetch("/api/cards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({ name, order, description, deadline, listItemId })
        })
        return await response.json()
    },
    async updateCard(id: string, data: { name?: string, order?: number, archived?: boolean, listItemId?: number, description?: string, deadline?: string }) {
        const response = await fetch(`/api/cards/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify(data)
        })
        return await response.json()
    },
    async deleteCard(id: string) {
        const response = await fetch(`/api/cards/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        return
    }
}