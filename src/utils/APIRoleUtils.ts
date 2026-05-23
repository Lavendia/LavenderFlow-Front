export const APIRole = {
    board: {
        async getBoardRoles(boardId: string) {
            const response = await fetch(`/api/boards/${boardId}/roles`, {
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
            const response = await fetch(`/api/boards/roles`, {
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
        async getWorkspaceRoles(workspaceId: string) {
            const response = await fetch(`/api/workspaces/${workspaceId}/roles`, {
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
            const response = await fetch(`/api/workspaces/roles`, {
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