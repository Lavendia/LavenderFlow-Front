export const APIWorkspace = {
    async getWorkspaces() {
        const response = await fetch("/api/workspaces", {
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
    async getWorkspaceById(id: string) {
        const response = await fetch(`/api/workspaces/${id}`, {
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
    async createWorkspace(name: string, description: string, isPublic: boolean) {
        const response = await fetch("/api/workspaces", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({ name, description, isPublic })
        })
        if (response.status === 401) {
            localStorage.removeItem("authToken")
            window.location.replace("/login")
        }
        return await response.json()
    },
    async deleteWorkspace(id: string) {
        const response = await fetch(`/api/workspaces/${id}`, {
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
    },
    async updateWorkspace(id: string, data: { name?: string, description?: string, isPublic?: boolean }) {
        const response = await fetch(`/api/workspaces/${id}`, {
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