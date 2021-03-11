import { Request, ResponseToolkit } from "@hapi/hapi"

export default (request: Request, h: ResponseToolkit) => {
    return "Hello World"
}