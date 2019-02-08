import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OldPushCenterComponent } from './old-push-center.component'

const routes: Routes = [
  { path: '', component: OldPushCenterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OldPushCenterRoutingModule { }
