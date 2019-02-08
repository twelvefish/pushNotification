import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

import { GridDataResult } from "@progress/kendo-angular-grid"
import { orderBy } from "@progress/kendo-data-query"
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../services/user/user.service'
import { UserApiService } from '../apiServices/userApi/user-api.service';
import { User } from '../model';

@Component({
  selector: 'app-authority-management',
  templateUrl: './authority-management.component.html',
  styleUrls: ['./authority-management.component.scss']
})
export class AuthorityManagementComponent implements OnInit {

  user: User = null
  userGrid: GridDataResult
  userGridArray: User[] = []

  formGroup: FormGroup
  editedRowIndex: number
  roleNames: Array<string> = ["主管", "小編"]
  selectedRoleValue: string = this.roleNames[1]

  dialogOpenedDelete: boolean = false
  dialogOpenedSave: boolean = false
  selectedEvent: any = null

  animationLoading: boolean = false

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private userService: UserService,
    private userApiService: UserApiService
  ) { }

  ngOnInit() {
    this.auth.authState.subscribe(firebaseUser => {
      if (firebaseUser) {
        this.userService.getUserById(firebaseUser.uid).subscribe(users => {
          if (users[0].role == 'staff') {
            this.router.navigate(["/pushCenter"])
          } else {
            this.user = users[0]
          }
        })
      }
    })

    this.userService.getUsers().subscribe(users => {
      this.userGridArray = users
      this.filterUser()
    })

  }

  addUser({ sender }: any) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      'email': new FormControl('', Validators.required),
      'name': new FormControl('', Validators.required)
    });
    sender.addRow(this.formGroup);
  }

  uploadUserFile(event: any) {
    this.animationLoading = true
    this.userApiService.importUser(event).then(() => {
      this.animationLoading = false
      console.log("===User匯入成功===")
    }).catch(err => {
      this.animationLoading = false
      console.log("===User匯入失敗===", err)
    })
  }

  editUser({ sender, rowIndex, dataItem }: any) {
    this.closeEditor(sender);
    if (dataItem.role != 'admin') {
      this.selectedRoleValue = dataItem.role == "manager" ? this.roleNames[0] : dataItem.role == "staff" ? this.roleNames[1] : ""
      this.formGroup = new FormGroup({});
      this.editedRowIndex = rowIndex;
      sender.editRow(rowIndex, this.formGroup);
    }
  }

  saveHandler({ sender, rowIndex, isNew, dataItem }: any) {
    this.animationLoading = true
    let role: User['role'] = this.selectedRoleValue == this.roleNames[0] ? 'manager' : this.selectedRoleValue == this.roleNames[1] ? 'staff' : 'admin'
    //新增
    if (isNew) {
      this.userApiService.createUser(dataItem.email, dataItem.name, role).then(() => {
        this.animationLoading = false
        this.dialogOpenedSave = false
        console.log("===User新增成功===")
      }).catch(err => {
        this.animationLoading = false
        this.dialogOpenedSave = false
        console.log("===User新增失敗===")
      })
    } else {
      //編輯
      let user: User = {
        id: dataItem.id,
        name: dataItem.name,
        email: dataItem.email,
        role: role
      }
      console.log("user", user)
      this.userApiService.updateUser(user).then(() => {
        this.animationLoading = false
        this.dialogOpenedSave = false
        console.log("===User更新成功===")
      }).catch(err => {
        this.animationLoading = false
        this.dialogOpenedSave = false
        console.log("===User更新失敗===")
      })
    }
    sender.closeRow(rowIndex);
  }

  removeHandler({ dataItem }: any) {
    if (dataItem.role != 'admin') {
      this.animationLoading = true
      this.userApiService.deleteUser(dataItem.id).then(() => {
        this.animationLoading = false
        this.dialogOpenedDelete = false
        console.log("===User刪除成功===")
      }).catch(err => {
        this.animationLoading = false
        this.dialogOpenedDelete = false
        console.log("===User刪除失敗===")
      })
    }
  }

  cancelUser({ sender, rowIndex }: any) {
    this.closeEditor(sender, rowIndex);
  }

  closeEditor(grid: any, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  filterUser() {
    this.userGrid = {
      data: orderBy(this.userGridArray, [{ field: 'role', dir: 'asc' }]),
      total: this.userGridArray.length
    }
  }

}
