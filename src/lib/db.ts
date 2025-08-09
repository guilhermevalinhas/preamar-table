import {
  addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy,
  query, serverTimestamp, setDoc, updateDoc, where
} from 'firebase/firestore'
import { db } from './firebase'
import { User } from 'firebase/auth'

export function colPath(name: string) { return name }

export async function createWithOwner<T extends { ownerId: string }>(
  user: User, coll: string, data: Omit<T,'ownerId'|'createdAt'|'updatedAt'>
) {
  const ref = collection(db, colPath(coll))
  return addDoc(ref, { ...data, ownerId: user.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
}

export async function updateDocById(coll: string, id: string, data: any) {
  const ref = doc(db, colPath(coll), id)
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

export async function setDocById(coll: string, id: string, data: any) {
  const ref = doc(db, colPath(coll), id)
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true })
}

export async function removeById(coll: string, id: string) {
  const ref = doc(db, colPath(coll), id)
  await deleteDoc(ref)
}

export async function getById<T>(coll: string, id: string): Promise<T | null> {
  const ref = doc(db, colPath(coll), id)
  const snap = await getDoc(ref)
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as any) : null
}

export function subscribeOwnerList<T>(user: User, coll: string, cb: (rows: (T & { id: string })[]) => void) {
  const ref = collection(db, colPath(coll))
  const q = query(ref, where('ownerId', '==', user.uid), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any
    cb(rows)
  })
}
