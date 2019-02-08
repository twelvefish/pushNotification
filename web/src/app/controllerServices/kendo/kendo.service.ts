import { Injectable } from '@angular/core';
import { Member, KendoNode } from "../../model"
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class KendoService {

  constructor() { }

  toMemberTree(members: Member[]): KendoNode[] {
    const memberTree: KendoNode[] = []
    for (const member of members) {
      if (member.division == null || member.division == '') member.division = '其他'
      let divisionNode = this.findNode(memberTree, member.division, null)
      if (!divisionNode) {
        divisionNode = {
          id: uuid.v4(),
          text: member.division,
          type: "division"
        }
        memberTree.push(divisionNode)
      }

      if (member.department == null || member.department == '') member.department = '其他'
      let departmentNode = this.findNode(memberTree, member.department, divisionNode.id)
      if (!departmentNode) {
        departmentNode = {
          id: uuid.v4(),
          text: member.department,
          parentId: divisionNode.id,
          type: "department"
        }
        memberTree.push(departmentNode)
      }

      const contactNode: KendoNode = {
        id: member.id,
        text: member.name,
        parentId: departmentNode.id,
        type: "member",
        data: member
      }
      memberTree.push(contactNode)

      memberTree.push({
        id: uuid.v4(),
        text: member.mobilePhone,
        parentId: member.id,
        type: "phone"
      })
      memberTree.push({
        id: uuid.v4(),
        text: member.email,
        parentId: member.id,
        type: "email"
      })
      memberTree.push({
        id: member.lineId,
        text: "Line",
        parentId: member.id,
        type: "line",
        data: member
      })
      memberTree.push({
        id: member.wechatId,
        text: "WeChat",
        parentId: member.id,
        type: "wechat",
        data: member
      })
    }
    return memberTree
  }

  findNode(tree: KendoNode[], text: string, parentId: string): KendoNode {
    for (const node of tree) {
      if (node.text == text && node.parentId == parentId)
        return node
    }
    return null
  }

  iconClassRight(data: any) {
    return {
      "k-i-layout-side-by-side": false,
      "k-i-list-unordered": !data.department,
      "k-icon": true
    }
  }

  iconClass(dataItem: any): any {
    return {
      "k-i-globe": dataItem.type == "root",
      "k-i-layout-side-by-side": (dataItem.type == "division" || dataItem.type == "department"),
      "k-i-folder": dataItem.type.includes("folder"),
      "k-i-user": dataItem.type.includes("member"),
      "k-i-pdf": dataItem.type.includes("pdf"),
      "k-i-image": dataItem.type.includes("jpeg") || dataItem.type.includes("jpg") || dataItem.type.includes("png"),
      "k-i-video-external": dataItem.type.includes("mp4"),
      "k-i-file-txt": dataItem.type.includes("text"),
      "k-i-file-xls": dataItem.type.includes('xlsx') || dataItem.type.includes('sheet'),
      "k-i-css": dataItem.type.includes('json'),
      "k-i-myspace": dataItem.type == "group",
      "k-i-border-top": dataItem.type == "org",
      "k-i-notification": dataItem.type == "phone",
      "k-i-email": dataItem.type == "email",
      "k-i-dictionary-add": dataItem.type == "lineGroup",
      "k-i-heart-outline": dataItem.type == "line",
      "k-i-heart": dataItem.type == "wechat",
      'k-icon': true
    };
  }

  selectedIcon(fileName: string, ext: string) {
    return new RegExp(`.${ext}\$`).test(fileName) // 判斷icon
  }

  iconClassFolder(data: any) {
    return {
      'k-i-file-pdf': this.selectedIcon(data.fullName, 'pdf'),
      'k-i-html': this.selectedIcon(data.fullName, 'html'),
      'k-i-image': this.selectedIcon(data.fullName, 'jpg|png'),
      'k-i-file-ppt': this.selectedIcon(data.fullName, 'ppt|pptx'),
      'k-i-word': this.selectedIcon(data.fullName, 'doc|docx|txt'),
      'k-i-video-external': this.selectedIcon(data.fullName, 'mp4|m4a'),
      'k-i-file-excel': this.selectedIcon(data.fullName, 'csv') || data.mimeType === 'application/vnd.google-apps.spreadsheet',
      'k-i-folder': data.mimeType === 'application/vnd.google-apps.folder',
      'k-i-list-unordered': this.selectedIcon(data.fullName, '') && data.mimeType !== 'application/vnd.google-apps.folder' && !this.selectedIcon(data.fullName, 'jpg|png'),
      'k-icon': true
    }
  }
}
