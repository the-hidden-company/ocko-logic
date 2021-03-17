import { Request, ResponseToolkit } from "@hapi/hapi"
import {get} from "../makers/database"

const getMista = async () => {
    return await get.query("SELECT misto_id, misto_nazev, latitude, longitude FROM ockovaci_mista")
}


export default async (request: Request, h: ResponseToolkit) => {
if (JSON.parse(request.query.map) === true) {
   return await getMista()
} else return {
    success: false,
    status: 423
}
}