import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PushCenterComponent } from './push-center.component'
const routes: Routes = [
  { path: '', component: PushCenterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PushCenterRoutingModule { }
