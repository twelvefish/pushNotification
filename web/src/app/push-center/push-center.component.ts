import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { UserService } from "../services/user.service";
import { User } from '../model';

@Component({
  selector: 'app-push-center',
  templateUrl: './push-center.component.html',
  styleUrls: ['./push-center.component.scss']
})
export class PushCenterComponent implements OnInit {

  loginUser: User

  memberMenuselected: string

  constructor(
    private auth: AngularFireAuth,
    private userService: UserService,

  ) {
    this.auth.authState.subscribe(firebaseUser => {
      if (firebaseUser) {
        this.userService.getUserById(firebaseUser.uid).subscribe(users => {
          this.loginUser = users[0]
          console.log("loginUser", users[0])
        })
      }
    })
  }

  ngOnInit() {
  }

  onClickMemberMenu(memberMenuselected: string) {
    this.memberMenuselected = memberMenuselected
  }
}
