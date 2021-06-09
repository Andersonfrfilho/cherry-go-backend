import { ConfirmAccountPhoneUserDTO } from "@modules/accounts/dtos/ConfirmAccountPhoneUser.dto";
import { CreateTagUsersServiceDTO } from "@modules/accounts/dtos/CreateTagUsersService.dto";
import { ICreateTypesUsersDTO } from "@modules/accounts/dtos/ICreateTypesUsers.dto";
import { ICreateUserAddressClientDTO } from "@modules/accounts/dtos/ICreateUserAddressClientDTO";
import { ICreateUserAddressClientRequestDTO } from "@modules/accounts/dtos/ICreateUserAddressClientRequestDTO";
import { ICreateUserClientDTO } from "@modules/accounts/dtos/ICreateUserClientDTO";
import { ICreateUserPhonesClientRequestDTO } from "@modules/accounts/dtos/ICreateUserPhonesClientRequest.dto";
import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IFindPhoneDTO } from "@modules/accounts/dtos/IFindPhone.dto";
import { IFindUserEmailCpfRgDTO } from "@modules/accounts/dtos/IFindUserEmailCpfRgDTO";
import { IUpdateActiveUserDTO } from "@modules/accounts/dtos/IUpdateActiveUser.dto";
import { IUpdatedUserClientDTO } from "@modules/accounts/dtos/IUpdatedUserClient.dto";
import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { CreateTagsUsersRepositoryDTO } from "@modules/accounts/dtos/repositories/CreateTagsUsersRepository.dto";
import { TermsAcceptUserRepositoryDTO } from "@modules/accounts/dtos/TermsAcceptUserRepository.dto";
import { TermsAcceptUserServiceDTO } from "@modules/accounts/dtos/TermsAcceptUserService.dto";
import { UpdateActivePhoneUserDTO } from "@modules/accounts/dtos/UpdateActivePhoneUser.dto";

export { CreateDocumentsUserImageRepositoryDTO } from "@modules/accounts/dtos/repositories/CreateDocumentsUserImageRepository.dto";
export { RequestActiveUserClientServiceDTO } from "@modules/accounts/dtos/services/RequestActiveUserClientService.dto";
export { CreateDocumentsUsersServiceDTO } from "@modules/accounts/dtos/services/CreateDocumentsUsersService.dto";

export {
  UpdateActivePhoneUserDTO,
  ConfirmAccountPhoneUserDTO,
  IFindPhoneDTO,
  ICreateUserClientDTO,
  ICreateUserTokenDTO,
  IFindUserEmailCpfRgDTO,
  IUserResponseDTO,
  ICreateUserAddressClientDTO,
  ICreateUserAddressClientRequestDTO,
  IUpdatedUserClientDTO,
  ICreateTypesUsersDTO,
  ICreateUserPhonesClientRequestDTO,
  IUpdateActiveUserDTO,
  TermsAcceptUserServiceDTO,
  CreateTagUsersServiceDTO,
  TermsAcceptUserRepositoryDTO,
  CreateTagsUsersRepositoryDTO,
};
