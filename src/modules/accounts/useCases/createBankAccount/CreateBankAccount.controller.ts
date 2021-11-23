import { Response, Request } from "express";
import { container } from "tsyringe";

import { CreateBankAccountService } from "@modules/accounts/useCases/createBankAccount/CreateBankAccount.service";
import { HTTP_STATUS_CODE_SUCCESS_ENUM } from "@shared/infra/http/enums";

export class CreateBankAccountController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const {
      account_number,
      code_bank,
      country_code,
      branch_number,
      account_holder_name,
      name_account_bank,
    } = request.body;

    const createBankAccountService = container.resolve(
      CreateBankAccountService
    );

    const details = await createBankAccountService.execute({
      user_id: id,
      account_number,
      code_bank,
      country_code,
      branch_number,
      account_holder_name,
      name_account_bank,
    });

    return response.json(details);
  }
}
