import { app, auth, db } from "@/config/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function useCheckSession() {
    const router = useRouter();
    const pathname = usePathname()

    const checkSession = async () => {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, async user => {
                if (user) {
                    if (user?.email) {
                        await getDocs(query(collection(db, "users"), where("email", "==", user?.email)))
                            .then((snapshot) => {
                                let list = []
                                snapshot.forEach((docs) => {
                                    list.push({ ...docs.data(), id: docs.id })
                                })
                                if (list.length > 0) {
                                    if (pathname.includes("login") || pathname.includes('signup') || pathname.includes("forgetpassword")) {
                                        router.push(`/${list[0].role}`)
                                    } else {
                                        if (pathname.includes("profile")) {
                                            resolve({ user: { ...user, ...list[0] } })
                                        }
                                        else {
                                            if (pathname.includes(list[0].role)) {
                                                resolve({ user: { ...user, ...list[0] } })

                                            } else {
                                                router.push(`/${list[0].role}`)
                                            }
                                        }
                                    }
                                } else {
                                    signOut(auth)
                                }
                            })
                            .catch(() => {
                                signOut(auth)
                            })
                    }

                } else {
                    if (pathname.includes('elderly') || pathname.includes('caregiver')) {
                        router.push('/login')
                    }
                    resolve({})
                }
            })
            return () => {
                unsubscribe()
            }
        })
    };

    return checkSession;
}