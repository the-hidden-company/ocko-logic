import { Request, ResponseToolkit } from "@hapi/hapi"
import {get} from "../makers/database"

const getLide = async (misto) => {
    return await get.query(`SELECT * FROM registrace WHERE misto_nazev='${misto}'`)
}


export default async (request: Request, h: ResponseToolkit) => {
    const payload = request.payload as any
if (payload.misto) {
   return await getLide(payload.misto)
} else return {
    success: false,
    status: 423
}
}