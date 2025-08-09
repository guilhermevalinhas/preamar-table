import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { useEffect, useState } from 'react'

const firebaseConfig = {
  apiKey: "AIzaSyBCHEKIBE3-NVFFwarLVQo_X-ZLqQ-5yAE",
  authDomain: "preamar-table.firebaseapp.com",
  projectId: "preamar-table",
  storageBucket: "preamar-table.firebasestorage.app",
  messagingSenderId: "650358520021",
  appId: "1:650358520021:web:639e3253d3c886b5800a5c"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setLoading(false) })
    return () => unsub()
  }, [])
  return { user, loading }
}
