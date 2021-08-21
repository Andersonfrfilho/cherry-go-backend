// import { mocked } from "ts-jest/utils";
// import { container } from "tsyringe";
// import { getCustomRepository } from "typeorm";

// import { UsersFactory } from "@shared/infra/typeorm/factories";

// import { AuthenticatedUserController } from "./AuthenticateUser.controller";
// import { Controller } from "./controller";
// import { UserRepository } from "./userRepo";

// jest.mock("typeorm", () => ({ getCustomRepository: jest.fn() }));
// jest.mock("tsyringe", () => ({ container: jest.fn() }));

// describe("61693597", () => {
//   const usersFactory = new UsersFactory();
//   const [user] = usersFactory.generate({ quantity: 1, id: "true" });
//   it("should pass", async () => {
//     const userRepo = { findOne: () => jest.fn().mockResolvedValueOnce(user) };
//     mocked(getCustomRepository).mockReturnValueOnce(userRepo);
//     const controller = new AuthenticatedUserController();
//     const actual = await controller.init();
//     expect(actual).toBe("fake user");
//     expect(getCustomRepository).toBeCalledWith(UserRepository);
//     expect(userRepo.findUser).toBeCalledWith(1);
//   });
// });
