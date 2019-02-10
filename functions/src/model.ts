import * as Line from '@line/bot-sdk';

export type User = {
    id: string
    name: string
    email: string
    role: "admin" | "manager" | "staff"
}

export type Member = {
    id: string
    name: string
    title: string
    division: string
    department: string
    lineId: string
    wechatId: string
    email: string
    mobilePhone: string
    data?: any
}

export type Catalog = {
    id: string
    name: string
    index: number
    messageId: string[]
    type: "dynamic" | "static"
    userId: string
}

export type Channel = {
    line: boolean
    wechat: boolean
    sms: boolean
    email: boolean
}

export type MessageTemplate = {
    id: string
    title: string
    content: string
    urls: Urls[]
    thumb: string
    type: string
    channel?: "Line" | "WeChat" | "SMS" | "Email"
}

export type Urls = {
    name: string
    url: string
}

export type RecordDetail = {
    id: string
    channel: "Line" | "WeChat" | "SMS" | "Email"
    message: string
    receiver: Member
    receiveTime: number
    read: boolean
    urls: Urls[]
}

export type ChatMessage = {
    id: string

}

export type GARecord = {
    action: string
    label: {
        filename: string
        trackId: string
    }
    count: number
    duration: number
}

export type File = {
    id: string
    mimeType: string
    name: string
    sid: number
    fullName: string
    parents: string
    parentsName: Parents[]
    docId: string
    modifiedDate: number
    createdTime: number
    modifiedTime: number
}

export type Parents = {
    id?: string
    name?: string
    fullName?: string
}

export type Message = {
    type: string
    textMessage?: Line.TextMessage
    imageMapMessage?: Line.ImageMapMessage
    buttonsMessage?: Line.TemplateButtons
    confirmMessage?: Line.TemplateConfirm
    carouselMessage?: Line.TemplateCarousel
    imageCarouselMessage?: Line.TemplateImageCarousel
    imageMessage?: Line.ImageMessage
    videoMessage?: Line.VideoMessage
    audioMessage?: Line.AudioMessage
    locationMessage?: Line.LocationMessage
    stickerMessage?: Line.StickerMessage
}

//MQ版系統整合
export type ScheduleEvent = PubSubEvent
export type PubSubEvent = {
    id: string
    timeStamp: number
}

export type ReviewMessage = {
    id: string
    /**
     * 0: 未處理
     * 1: 通過 / 未發送
     * 2: 通過 / 已發送
     * 3: 未通過
     */
    state: 0 | 1 | 2 | 3
    content: string
    channel: MessageTemplate['channel']
    sender: User
    // receivers: { id: string, data: any[] }[]
    expectTime: number
    urls: MessageTemplate['urls']
    type: "immediate" | "delay"
    auditor: User
    receiverCount: number
}

export class Group {
    id: string
    name: string
    ownerId: string
    memberId: string[]
}

export class List {
    id: string
    name: string
    ownerId: string
    members: { id: string, content: string }[]
}

export type Receiver = {
    id: string
    data: any[]
    index: number
}
