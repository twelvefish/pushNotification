import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { AuthorityManagementRoutingModule } from './authority-management-routing.module'
import { AuthorityManagementComponent } from './authority-management.component'

import { GridModule } from '@progress/kendo-angular-grid'
import { ReactiveFormsModule } from '@angular/forms'
import { DropDownListModule } from '@progress/kendo-angular-dropdowns'
import { DialogsModule } from '@progress/kendo-angular-dialog'

import { UserService } from '../services/user.service'
import { UserApiService } from '../apiServices/user-api.service'

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    AuthorityManagementRoutingModule,
    GridModule,
    ReactiveFormsModule,
    DropDownListModule,
    DialogsModule,
  ],
  providers: [
    UserService,
    UserApiService
  ],
  declarations: [AuthorityManagementComponent]
})
export class AuthorityManagementModule { }
