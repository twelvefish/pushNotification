import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { AngularFireAuth } from "angularfire2/auth"
import { UserService } from "./services/user.service"
import { User } from "./model"

import "rxjs/add/operator/map"

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"]
})
export class AppComponent {

	logged: Boolean = false
	user: User
	type: string = "pushCenter"
	isUserLoggedIn: boolean;

	constructor(private auth: AngularFireAuth,
		private userService: UserService,
		private router: Router
	) {
		this.type = window.location.pathname.replace("/", "")
		this.auth.authState.subscribe(firebaseUser => {
			if (firebaseUser) {
				console.log("firebaseUser", firebaseUser)
				this.userService.getUserById(firebaseUser.uid).subscribe(users => {
					if (users.length == 0) {
						this.signOut()
					} else {
						this.user = users[0]
						console.log("user", users[0])
					}
				})
			}
		})
	}

	signOut(): void {
		this.user = null
		this.isUserLoggedIn = false;
		this.auth.auth.signOut()
		this.router.navigate(["/login"]);
	}

	selectedPush() {
		this.type = "pushCenter"
		this.router.navigate([`/pushCenter`])
	}

	selectedManagement() {
		this.type = "authorityManagement"
		this.router.navigate([`/authorityManagement`])
	}

	selectedReview() {
		this.type = "reviewMessage"
		this.router.navigate([`/reviewMessage`])
	}
}
