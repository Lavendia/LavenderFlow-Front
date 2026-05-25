export const APIBoard = {
    async getBoards() {
        const response = await fetch("/api/boards", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
        })
        if (response.status === 401) {
            localStorage.removeItem("authToken")
            window.location.replace("/login")
        }
        return await response.json()
    },
    async getBoardById(boardId: string) {
        const response = await fetch(`/api/boards/${boardId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
        })
        if (response.status === 401) {
            localStorage.removeItem("authToken")
            window.location.replace("/login")
        }
        if (!response.ok) {
            throw new Error(`Failed to fetch board: ` + boardId)
        }
        return await response.json()
    },
    async createBoard(name: string, description: string, workspaceId: number) {
        const response = await fetch("/api/boards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({ name, description, workspaceId })
        })
        if (response.status === 401) {
            localStorage.removeItem("authToken")
            window.location.replace("/login")
        }
        return await response.json()
    },
    async deleteBoard(boardId: string) {
        const response = await fetch(`/api/boards/${boardId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
        })
        if (response.status === 401) {
            localStorage.removeItem("authToken")
            window.location.replace("/login")
        }
        return
    },
    async updateBoard(boardId: string, data: { name?: string, description?: string }) {
        const response = await fetch(`/api/boards/${boardId}`, {
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
    }
}