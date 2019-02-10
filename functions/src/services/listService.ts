import * as admin from 'firebase-admin';
import { List } from '../model';

const listCollection = admin.firestore().collection("List");

export const getListById = function (id: string) {
    return listCollection.where("id", "==", id).get()
}

export const getListByName = function (name: string) {
    return listCollection.where("name", "==", name).get()
}

export const setList = function (member: List) {
    return listCollection.doc(member.id).set(member, { merge: true })
}

export const deleteList = function (id: string) {
    return listCollection.doc(id).delete()
}