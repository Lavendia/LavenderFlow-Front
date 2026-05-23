export const APIRole = {
    board: {
        async getBoardRoles() {
            const response = await fetch(`/api/boardroles`, {
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
        async createBoardRole(role: string) {
            const response = await fetch(`/api/boardroles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({ role })
            })
            if (response.status === 401) {
                localStorage.removeItem("authToken")
                window.location.replace("/login")
            }
            return await response.json()
        }
    },
    workspace: {
        async getWorkspaceRoles() {
            const response = await fetch(`/api/workspaceroles`, {
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
        async createWorkspaceRole(role: string) {
            const response = await fetch(`/api/workspaceroles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({ role })
            })
            if (response.status === 401) {
                localStorage.removeItem("authToken")
                window.location.replace("/login")
            }
            return await response.json()
        }
    }
}