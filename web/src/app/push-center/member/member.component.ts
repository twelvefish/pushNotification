import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/model';

import { KendoService } from '../../controllerServices/kendo/kendo.service'
import { MemberService } from '../../services/member/member.service'

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

  @Input() loginUser: User
  @Output() clickMemberMenu: EventEmitter<string> = new EventEmitter()

  majorMenuSelected: string = "customerService"
  secondMenuSelected: string = "contact"


  /**
   * 成員組織 KendoTree
   */
  contactTree: any[] = []
  contactTreeExpanded = ['0', '0_0']
  unReadTree: any[] = []
  unReadTreeExpanded = []
  pushTree: any[] = []
  pushTreeExpanded = ['0', '0_0']
  groupTree: any[] = []
  groupTreeExpanded = []
  listTree: any[] = []
  listTreeExpanded = []

  constructor(
    private memberService: MemberService,
    public kendoService: KendoService,
  ) {

  }

  ngOnInit() {
    this.selectCustomer()
  }

  onClickMemberMenu(e: string) {
    this.clickMemberMenu.emit(e)
  }

  //主menu function
  selectCustomer() {
    this.majorMenuSelected = "customerService"
    this.selectContact()
    // this.selectedReceiver = null
  }

  selectPushMessage() {
    this.majorMenuSelected = "pushService"
    this.selectPush()
  }

  selectContact() {
    this.onClickMemberMenu("contact")
    this.secondMenuSelected = "contact"

    this.memberService.getMembers().subscribe(members => {
      this.contactTree = this.kendoService.toMemberTree(members)
      this.contactTreeExpanded = ['0', '0_0']
    })

  }

  selectUnRead() {
    this.onClickMemberMenu("unRead")
    this.secondMenuSelected = "unRead"
  }

  selectPush() {
    this.onClickMemberMenu("push")
    this.secondMenuSelected = "push"
  }

  selectGroup() {
    this.onClickMemberMenu("group")
    this.secondMenuSelected = "group"
  }

  selectList() {
    this.onClickMemberMenu("list")
    this.secondMenuSelected = "list"
  }
}
