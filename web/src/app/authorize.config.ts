import { Injectable } from "@angular/core"
import { CanLoad, Router, Route } from "@angular/router"

import { User } from "./model"
import { Observable } from "rxjs"
import { AngularFireAuth } from "angularfire2/auth"
import { User as FirebaseUser } from "firebase"
import "rxjs/add/operator/take"

class GuardBase {
  protected firebaseUser: Observable<FirebaseUser>
  protected user: Observable<User> = Observable.create(null)

  constructor(auth: AngularFireAuth) {
    this.firebaseUser = auth.authState
  }
}

@Injectable()
export class AuthenticationGuard extends GuardBase implements CanLoad {

  constructor(
    private router: Router,
    auth: AngularFireAuth
  ) {
    super(auth)
  }

  canLoad(route: Route): Observable<boolean> | boolean {
    return this.firebaseUser.take(1).map(firebaseUser => {
      if (firebaseUser) {
        return true
      } else {
        this.router.navigate(["/login"])
        return false
      }
    })
  }

}

