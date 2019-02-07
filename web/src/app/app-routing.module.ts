import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from "./authorize.config"

const routes: Routes = [
  { path: "", redirectTo: "/pushCenter", pathMatch: "full" },
  { path: "pushCenter", loadChildren: "./push-center/push-center.module#PushCenterModule", canLoad: [AuthenticationGuard] },
  { path: "reviewMessage", loadChildren: './review-message/review-message.module#ReviewMessageModule', canLoad: [AuthenticationGuard] },
  { path: "authorityManagement", loadChildren: './authority-management/authority-management.module#AuthorityManagementModule', canLoad: [AuthenticationGuard] },
  // { path: "pdf", children: [{ path: ":fileId", loadChildren: "./fileReader/fileReader.module#FileReaderModule" }] },
  { path: "login", loadChildren: './login/login.module#LoginModule' },
  // { path: "passwordReset", loadChildren: './password-reset/passwordReset.module#PasswordResetModule' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthenticationGuard]
})
export class AppRoutingModule { }
