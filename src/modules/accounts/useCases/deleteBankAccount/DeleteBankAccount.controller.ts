import { Response, Request } from "express";
import { container } from "tsyringe";

import { DeleteBankAccountService } from "./DeleteBankAccount.service";

export class DeleteBankAccountController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { bank_account_id } = request.body;
    const deleteBankAccountService = container.resolve(
      DeleteBankAccountService
    );

    const details = await deleteBankAccountService.execute({
      user_id: id,
      bank_account_id,
    });

    return response.json(details);
  }
}
