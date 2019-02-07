import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'
import { Observable } from 'rxjs'
import { Member } from '../model'

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private memberCollection: AngularFirestoreCollection<any>

  constructor(private database: AngularFirestore) {
    this.memberCollection = database.collection<Member>("Member", ref => ref.orderBy("name", "asc"))
  }

  getMembers(): Observable<Member[]> {
    return this.memberCollection.valueChanges();
  }

  getMember(id: string): Observable<Member> {
    return this.memberCollection.doc<Member>(id).valueChanges()
  }

  getMemberById(id: string): Observable<Member[]> {
    let member = this.database.collection<Member>("Member", ref => ref.where("id", "==", id))
    return member.valueChanges()
  }

  getMemberByFirebaseId(id: string): Observable<Member[]> {
    let member = this.database.collection<Member>("Member", ref => ref.where("firebaseId", "==", id))
    return member.valueChanges()
  }

  getMemberByLineId(lineId: string): Observable<Member[]> {
    let member = this.database.collection<Member>("Member", ref => ref.where("lineId", "==", lineId))
    return member.valueChanges();
  }

  getMemberByWechatId(wechatId: string): Observable<Member[]> {
    let member = this.database.collection<Member>("Member", ref => ref.where("wechatId", "==", wechatId))
    return member.valueChanges();
  }

  getMemberByName(name: string): Observable<Member[]> {
    let member = this.database.collection<any>("Member", ref => ref.where("name", "==", name));
    return member.valueChanges();
  }

  getMemberByRole(role: string): Observable<Member[]> {
    let member = this.database.collection<any>("Member", ref => ref.where("role", "==", role));
    return member.valueChanges();
  }
  getMemberByEmail(email: string): Observable<Member[]> {
    let member = this.database.collection<any>("Member", ref => ref.where("email", "==", email));
    return member.valueChanges();
  }
  getMemberByEmailandMobilePhone(email: string, mobile: string): Observable<Member[]> {
    let member = this.database.collection<any>("Member", ref => ref.where("email", "==", email).where("mobilePhone", "==", mobile));
    return member.valueChanges();
  }
  updateMember(member: Member): Promise<any> {
    return this.memberCollection.doc<Member>(member.id).set(member, { merge: true });
  }

  deleteMember(id: string): Promise<any> {
    return this.memberCollection.doc<Member>(id).delete();
  }

  getMemberFriendMessages(id: string, friendId: string): Observable<any[]> {
    let member = this.memberCollection.doc(id).collection("Friend").doc(friendId).collection("Message", ref => ref.orderBy("timeStamp"))
    return member.valueChanges();
  }

  getMemberFriends(id: string): Observable<any[]> {
    return this.memberCollection.doc(id).collection("Friend").valueChanges()
  }

  setMemberFriend(id: string, friendId: string): Promise<any> {
    return this.memberCollection.doc(id).collection("Friend").doc(friendId).set({ id: friendId })
  }

  getMemberByMemberId(id: string): Promise<Member> {
    return new Promise((resolve, reject) => {
      this.database.collection<Member>("Member", ref => ref.where("id", "==", id)).valueChanges().subscribe(members => {
        resolve(members[0])
      })
    })
  }

  getMemberByIdPromise(id: string): Promise<Member> {
    return new Promise((resolve, reject) => {
      let member = this.database.collection<Member>("Member", ref => ref.where("id", "==", id))
      member.valueChanges().subscribe(data => resolve(data[0]))
    })
  }
}
