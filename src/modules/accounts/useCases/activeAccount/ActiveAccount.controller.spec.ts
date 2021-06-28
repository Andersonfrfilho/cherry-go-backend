import "reflect-metadata";
import { mock } from "jest-mock-extended";
import { container } from "tsyringe";

import { ActiveAccountService } from "./ActiveAccount.service";

class UserRepositoryMock {
  findUserByEmailCpfRg() {
    return jest.fn();
  }
}

describe("ActiveAccountController", () => {
  it("should call action on dependencyA when foo is called", () => {
    // We can mock a class at any level in the dependency tree without touching anything else
    container.registerSingleton("UsersRepository", UserRepositoryMock);
    const data = { cpf: "123", email: "email@mail.com", rg: "1234" };
    // dependency A gets a mock version of dependency C during this resolution.
    const activeUserClientService = container.resolve(ActiveAccountService);
    const result = activeUserClientService.execute(data);
    console.log(result);
    // We can call this now that we're done testing, and the mock will be removed.
    // When we resolve the instance after this, we get the original dependencies.
    // In practice, we've found it's easy to just place this in your afterEach block.
    container.clearInstances();
  });
});
