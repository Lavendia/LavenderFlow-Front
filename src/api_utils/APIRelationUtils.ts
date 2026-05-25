export const APIRelation = {
    boards: {
        async getBoardUsers(boardId: string) {
            const response = await fetch(`/api/boardusers/board/${boardId}`, {
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
        async getUserBoards(userId: string) {
            const response = await fetch(`/api/boardusers/user/${userId}`, {
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
        async addUserToBoard(boardId: string, userId: string, boardRoleId: number) {
            const response = await fetch(`/api/boardusers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({ boardId, userId, boardRoleId })
            })
            if (response.status === 401) {
                localStorage.removeItem("authToken")
                window.location.replace("/login")
            }
            return await response.json()
        },
        async removeUserFromBoard(boardId: string, userId: string) {
            const response = await fetch(`/api/boardusers?boardId=${boardId}&userId=${userId}`, {
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
            return await response.json()
        },
        async updateUserBoardRole(boardId: string, userId: string, boardRoleId: number) {
            const response = await fetch(`/api/boardusers?boardId=${boardId}&userId=${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({ boardRoleId })
            })
            if (response.status === 401) {
                localStorage.removeItem("authToken")
                window.location.replace("/login")
            }
            return await response.json()
        }
    },
    cards: {
        async getCardAssignees(cardId: string) {
            const response = await fetch(`/api/cardassigments/card/${cardId}`, {
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
        async addAssigneeToCard(cardId: number, userId: number) {
            const response = await fetch(`/api/cardassigments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({ cardId, userId })
            })
            if (response.status === 401) {
                localStorage.removeItem("authToken")
                window.location.replace("/login")
            }
            return await response.json()
        },
        async removeAssigneeFromCard(cardId: string, userId: string) {
            const response = await fetch(`/api/cardassigments?cardId=${cardId}&userId=${userId}`, {
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
            return await response.json()
        }
    },
    workspaces: {
        async getWorkspaceUser(workspaceUserId: string) {
            const response = await fetch(`/api/workspaceusers/${workspaceUserId}`, {
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
        async getWorkspaceUsersByWorkspaceId(workspaceId: string) {
            const response = await fetch(`/api/workspaceusers/workspaces/${workspaceId}`, {
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
        async getWorkspaceUsersByUserId(userId: string) {
            const response = await fetch(`/api/workspaceusers/users/${userId}`, {
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
        async addUserToWorkspace(workspaceId: number, userId: number, workspaceRoleId: number) {
            const response = await fetch(`/api/workspaceusers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({ workspaceId, userId, roleId: workspaceRoleId })
            })
            if (response.status === 401) {
                localStorage.removeItem("authToken")
                window.location.replace("/login")
            }
            return await response.json()
        },
        async removeUserFromWorkspace(workspaceUserId: string) {
            const response = await fetch(`/api/workspaceusers/${workspaceUserId}`, {
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
            return await response.json()
        },
        async updateUserWorkspaceRole(workspaceUserId: string, workspaceRoleId: number) {
            const response = await fetch(`/api/workspaceusers/${workspaceUserId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({ workspaceRoleId })
            })
            if (response.status === 401) {
                localStorage.removeItem("authToken")
                window.location.replace("/login")
            }
            return await response.json()
        }
    }
}