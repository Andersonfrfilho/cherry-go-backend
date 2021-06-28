import { Response, Request } from "express";

export class CreateTransportController {
  async handle(request: Request, response: Response): Promise<Response> {
    console.log(request);
    return response.json({ api: true });
  }
}
