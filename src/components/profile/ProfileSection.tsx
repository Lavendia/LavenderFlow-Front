import { User } from "lucide-react"
import { useEffect, useState } from "react"

export function ProfileSection() {
    const [user, setUser] = useState<null | { name: string; email: string; bio: string }>(null)

    useEffect(() => {
        setTimeout(() => {
            setUser({
                "name": "Jane Doe",
                "email": "jane.doe@example.com",
                "bio": "Software engineer passionate about creating beautiful user experiences."
            })
        }, 1000)
    }, [])

    return (
        <section
            aria-labelledby="profile-heading"
            className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-[clamp(1.5rem,5vw,4rem)] pt-30 pb-20"
        >
            <div className="max-w-175 mx-auto text-center">
                <div className="flex justify-center items-center mb-6">
                    <User className="w-30 h-30" />
                </div>
                <h2
                    id="profile-heading"
                    className="text-white tracking-tight leading-[1.1] mb-4"
                    style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
                >
                    Your profile, your way.
                </h2>

                <p className="text-base text-[#EFBBFF]/60 leading-relaxed mb-8">
                    Customize your profile to showcase your unique identity and make a lasting impression on your connections.
                </p>
                <div className="max-w-175 mx-auto text-center bg-[#2d1052] border border-[#3d1a6e] rounded-3xl p-[clamp(2.5rem,6vw,4rem)] relative overflow-hidden">
                    {user && (
                        <div className="text-left">
                            <h3 className="text-white text-lg font-semibold mb-2">{user.name}</h3>
                            <p className="text-[#EFBBFF]/60 mb-4">{user.bio}</p>
                            <p className="text-[#EFBBFF]/60">{user.email}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}