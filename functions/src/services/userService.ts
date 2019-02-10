import * as admin from "firebase-admin"
import { User } from "../model"

const userCollection = admin.firestore().collection("User")

export const getUserById = (id: string) => {
    return userCollection.doc(id).get().then(doc => {
        if (doc.exists)
            return doc.data() as User
        return null
    })
}

export const getUserByEmail = function (email: string) {
    return userCollection.where("email", "==", email).get()
}

export const setUser = function (user: User) {
    return userCollection.doc(user.id).set(user, { merge: true })
}

export const deleteUser = function (id: string) {
    return userCollection.doc(id).delete()
}