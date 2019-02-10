import * as admin from 'firebase-admin';
import { idLength } from '../config'
import { Member } from '../model';

const memberCollection = admin.firestore().collection("Member");

export const setMember = function (member: Member) {
    return memberCollection.doc(member.id).set(member, { merge: true })
}

export const generateFirebaseToken = (lineId: string) => {
    let firebaseUid = lineId;
    let additionalClaims = {
        'LINE': true
    };
    return admin.auth().createCustomToken(firebaseUid, additionalClaims);
}

export const getMemberById = (id: string) => {
    return memberCollection.doc(id).get().then(doc => {
        if (doc.exists)
            return doc.data() as Member
        return null
    })
}

export const getMemberByAnyId = function (id: string) {
    if (id.length == idLength.LINE)
        return memberCollection.where("lineId", "==", id).get()
    if (id.length == idLength.WECHAT)
        return memberCollection.where("wechatId", "==", id).get()

    return memberCollection.where("id", "==", id).get()
}

export const getMembersByName = function (name: string) {
    return memberCollection.where("name", "==", name).get()
}

export const getMembersByRole = function (role: string) {
    return memberCollection.where("role", "==", role).get()
}

export const getMemberByRoleAndEmail = function (role: string, email: string) {
    return memberCollection.where("role", "==", role).where("email", "==", email).get()
}

export const getMemberByEmail = function (email: string) {
    return memberCollection.where("email", "==", email).get()
}

export const deleteMember = function (id: string) {
    return memberCollection.doc(id).delete()
}

export const deleteFirebaseToken = (lineId: string) => {
    return admin.auth().deleteUser(lineId);
}




