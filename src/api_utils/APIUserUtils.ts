export const APIUser = {
    async getUsers() {
        const response = await fetch("/api/users", {
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
    async getMe() {
        const response = await fetch("/api/users/me", {
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
    async getUserIdByEmail(email: string) {
        const response = await fetch(`/api/users/email?email=${encodeURIComponent(email)}`, {
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
            throw new Error(`User not found: ${response.status}`)
        }
        return await response.json()
    },
    async getUserById(userId: string) {
        const response = await fetch(`/api/users/${userId}`, {
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
    async updateProfile(userId: string, data: { name?: string, email?: string, password?: string }) {
        const response = await fetch(`/api/users/${userId}`, {
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
    async deleteUser(userId: string) {
        const response = await fetch(`/api/users/${userId}`, {
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
    }
}