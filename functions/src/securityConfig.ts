import * as admin from "firebase-admin"
import { Request, Response, NextFunction } from "express"
import * as userService from "./services/userService"

export const permit = (...allowed) => {
    const isAllowed = role => allowed.indexOf(role) > -1
    return (req: Request, res: Response, next: NextFunction) => {
        if (req["user"] && isAllowed(req["user"].role))
            next()
        else
            res.sendStatus(403)
    }
}

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    const authorizationToken = req.headers["authorization"] as string
    let flag = false
    if (authorizationToken) {
        const token = authorizationToken.substring("Bearer ".length)
        if (!flag) {
            // Firebase Authentication
            const firebaseUser = await admin.auth().verifyIdToken(token).catch(error => {

            })
            if (firebaseUser) {
                let userObject = await userService.getUserById(firebaseUser.uid)
                if (userObject) {
                    req["user"] = userObject
                } else {
                    req["user"] = {
                        id: "guest",
                        name: "Guest",
                        role: "guest"
                    }
                    console.log("User not found!")
                }
            } else {
                req["user"] = {
                    id: "guest",
                    name: "Guest",
                    role: "guest"
                }
                console.log("verifyIdToken error!")
            }
        }
    }
    next()
}