import { ICreateUserAddressClientDTO } from "@modules/accounts/dtos";
import { DocumentUserImage } from "@modules/accounts/infra/typeorm/entities/DocumentUserImage";

interface DocumentsUserImageRepositoryInterface {
  create(data: ICreateUserAddressClientDTO): Promise<DocumentUserImage>;
}

export { DocumentsUserImageRepositoryInterface };
