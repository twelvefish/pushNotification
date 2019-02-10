import express = require('express')
import { serviceAccountKey } from './config'
import * as admin from 'firebase-admin';
import { permit, authentication } from "./securityConfig"

const app = express()//建立一個Express伺服器

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    // databaseURL: databaseURLPath,
    // storageBucket: storageBucket
})

admin.firestore().settings({ timestampsInSnapshots: true }); //firestore時間戳錯誤

import user from './router/user'
import member from './router/member'
import catalog from './router/catalog'
import group from './router/group'
import list from './router/list'

app.use(authentication)
app.use('/user', user)
app.use('/member', member)
app.use('/catalog', catalog)
app.use('/group', group)
app.use('/list', list)

app.listen(process.env.PORT || 3000, () => {
    console.log('Express server listening on port 3000')
})