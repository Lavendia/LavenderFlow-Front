export const APIAuth = {
    async login(email: string, password: string) {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        const data = await response.json()
        if (response.status == 200) {
            localStorage.setItem("authToken", data.token)
        }
        return data
    },

    async register(name: string, email: string, password: string) {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        })
        const data = await response.json()
        if (response.status == 200) {
            localStorage.setItem("authToken", data.token)
        }
        return data
    },
}