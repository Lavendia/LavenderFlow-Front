export const APIChecklist = {
    checklists: {
        async getChecklists() {
            const response = await fetch("/api/checklists", {
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
        async getChecklistById(id: string) {
            const response = await fetch(`/api/checklists/${id}`, {
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
        async getChecklistsByCardId(cardId: string) {
            const response = await fetch(`/api/checklists/card/${cardId}`, {
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
        async createChecklist(name: string, cardId: number) {
            const response = await fetch("/api/checklists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({ name, cardId })
            })
            if (response.status === 401) {
                localStorage.removeItem("authToken")
                window.location.replace("/login")
            }
            return await response.json()
        },
        async updateChecklist(id: string, name: string) {
            const response = await fetch(`/api/checklists/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({ name })
            })
            if (response.status === 401) {
                localStorage.removeItem("authToken")
                window.location.replace("/login")
            }
            return await response.json()
        },
        async deleteChecklist(id: string) {
            const response = await fetch(`/api/checklists/${id}`, {
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
    checklistItems: {
        async getChecklistItemById(id: string) {
            const response = await fetch(`/api/checklistitems/${id}`, {
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
        async getChecklistItemsByChecklistId(checklistId: string) {
            const response = await fetch(`/api/checklistitems/checklist/${checklistId}`, {
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
        async createChecklistItem(name: string, checklistId: number) {
            const response = await fetch("/api/checklistitems", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({ name, checklistId })
            })
            if (response.status === 401) {
                localStorage.removeItem("authToken")
                window.location.replace("/login")
            }
            return await response.json()
        },
        async updateChecklistItem(id: string, data: { name?: string, finished?: boolean }) {
            const response = await fetch(`/api/checklistitems/${id}`, {
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
        async deleteChecklistItem(id: string) {
            const response = await fetch(`/api/checklistitems/${id}`, {
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
            return await response.json()
        }
    }
}