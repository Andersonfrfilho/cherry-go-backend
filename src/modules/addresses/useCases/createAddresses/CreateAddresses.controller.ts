import { Response, Request } from "express";

export class CreateTransportController {
  async handle(request: Request, response: Response): Promise<Response> {
    return response.json({ api: true });
  }
}
