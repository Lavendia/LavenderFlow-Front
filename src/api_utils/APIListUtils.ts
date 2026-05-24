export const APIList = {
    async getLists() {
        const response = await fetch("/api/listitems", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        if (response.status === 401) {
            localStorage.removeItem("authToken")
            window.location.replace("/login")
        }
        return await response.json()
    },
    async getListById(id: string) {
        const response = await fetch(`/api/listitems/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        if (response.status === 401) {
            localStorage.removeItem("authToken")
            window.location.replace("/login")
        }
        return await response.json()
    },
    async getListsByBoardId(boardId: string) {
        const response = await fetch(`/api/listitems/board/${boardId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        if (response.status === 401) {
            localStorage.removeItem("authToken")
            window.location.replace("/login")
        }
        return await response.json()
    },
    async createList(name: string, order: number, boardId: number) {
        const response = await fetch("/api/listitems", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({ name, order, boardId })
        })
        if (response.status === 401) {
            localStorage.removeItem("authToken")
            window.location.replace("/login")
        }
        return await response.json()
    },
    async updateList(id: string, data: { name?: string, order?: number }) {
        const response = await fetch(`/api/listitems/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify(data)
        })
        if (response.status === 401) {
            localStorage.removeItem("authToken")
            window.location.replace("/login")
        }
        return await response.json()
    },
    async deleteList(id: string) {
        const response = await fetch(`/api/listitems/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        if (response.status === 401) {
            localStorage.removeItem("authToken")
            window.location.replace("/login")
        }
        return
    }
}