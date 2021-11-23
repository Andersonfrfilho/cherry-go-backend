import "reflect-metadata";
import { Response, Request, NextFunction } from "express";
import { mocked } from "ts-jest/utils";
import { container } from "tsyringe";

import { usersRepositoryMock } from "@modules/accounts/repositories/mocks/Users.repository.mock";

import { ActiveUserClientController } from "./ActiveAccount.controller";
import { ActiveAccountService } from "./ActiveAccount.service";

const mockResponse = {
  json: jest.fn(),
  status: jest.fn(),
  send: jest.fn(),
};
describe("ActiveAccountController", () => {
  beforeEach(() => {
    mockResponse.json.mockImplementation(() => mockResponse);
    mockResponse.status.mockImplementation(() => mockResponse);
    mockResponse.send.mockImplementation(() => mockResponse);
  });
  it("should call action on dependencyA when foo is called", async () => {
    // We can mock a class at any level in the dependency tree without touching anything else
    // isso vai la no método real e vai ficar espionando os métodos originais
    jest.spyOn(container, "resolve").mockReturnValue({
      execute: () => jest.fn().mockResolvedValue(""),
    });

    const mockRequest = {
      body: {
        firstName: "J",
        lastName: "Doe",
        email: "jdoe@abc123.com",
        password: "Abcd1234",
        passwordConfirm: "Abcd1234",
        company: "ABC Inc.",
      },
    } as Request;
    // retorna o valor desejado
    mockResponse.send.mockReturnValue("string");

    const mockNext: NextFunction = jest.fn();

    const createSpecificationController = new ActiveUserClientController();

    const response_body = await createSpecificationController.handle(
      mockRequest,
      mockResponse as any
    );
  });
});
