import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AngularFireAuth } from 'angularfire2/auth'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  pageTitle = environment.companyTitle
  email: string = ""
  password: string = ""
  response: string = ""

  logged: Boolean = false
  animationLoading: boolean = false
  resetMode: boolean = false

  constructor(
    private auth: AngularFireAuth,
    private router: Router
  ) {
    auth.authState.subscribe(user => {
      this.logged = !!user
      if (this.logged) {
        this.router.navigate(["/"])
      }
    })
  }

  ngOnInit() {
  }

  signIn(): void {
    if (this.email && this.email != "" && this.password && this.password != "") {
      this.animationLoading = true
      this.auth.auth.signInWithEmailAndPassword(this.email, this.password).then(() => {
        this.animationLoading = false
      }).catch(error => {
        this.animationLoading = false
        switch (error.code) {
          case 'auth/wrong-password':
            this.response = "密碼輸入錯誤，請重新輸入！"
            break
          case 'auth/user-not-found':
            this.response = "帳號輸入錯誤，請重新輸入！"
            break
          case 'auth/invalid-email':
            this.response = "帳號格式輸入錯誤，請重新輸入！"
            break
          default:
            this.response = "帳號或密碼錯誤，請重新輸入！"
        }
      })
    } else {
      this.response = "帳號或密碼錯誤，請重新輸入！"
    }
  }

  resetPassword() {
    if (this.email && this.email != "") {
      this.animationLoading = true
      this.auth.auth.sendPasswordResetEmail(this.email).then(() => {
        this.response = `驗證信已寄至您的《${this.email}》信箱，請至信箱內重設密碼。`
        this.animationLoading = false
      }).catch(err => {
        this.response = `帳戶《${this.email}》不存在，請確認帳號是否正確，或聯絡系統管理員取得協助。`
        this.animationLoading = false
      })
    } else {
      this.response = "請輸入帳號！"
    }
  }

  signOut(): void {
    this.auth.auth.signOut()
  }

}
