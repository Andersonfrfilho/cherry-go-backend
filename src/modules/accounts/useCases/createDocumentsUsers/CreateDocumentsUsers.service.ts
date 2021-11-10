import { inject, injectable } from "tsyringe";

import upload from "@config/upload";
import { CreateDocumentsUsersServiceDTO } from "@modules/accounts/dtos";
import { USER_DOCUMENT_VALUE_ENUM } from "@modules/accounts/enums/UserDocumentValue.enum";
import { DocumentsUserImageRepositoryInterface } from "@modules/accounts/repositories/DocumentsUserImage.repository.interface";
import { UsersRepositoryInterface } from "@modules/accounts/repositories/Users.repository.interface";
import { ImagesRepositoryInterface } from "@modules/images/repositories/Images.repository.interface";
import { STRIPE_PURPOSE_DOCUMENT } from "@shared/container/providers/PaymentProvider/enums/stripe.enums";
import { PaymentProviderInterface } from "@shared/container/providers/PaymentProvider/Payment.provider.interface";
import { STORAGE_TYPE_FOLDER_ENUM } from "@shared/container/providers/StorageProvider/enums/StorageTypeFolder.enum";
import { StorageProviderInterface } from "@shared/container/providers/StorageProvider/Storage.provider.interface";

@injectable()
export class CreateDocumentsUsersService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepositoryInterface,
    @inject("DocumentsUsersImageRepository")
    private usersDocumentsRepository: DocumentsUserImageRepositoryInterface,
    @inject("StorageProvider")
    private storageProvider: StorageProviderInterface,
    @inject("ImagesRepository")
    private imagesRepository: ImagesRepositoryInterface,
    @inject("PaymentProvider")
    private paymentProvider: PaymentProviderInterface
  ) {}
  async execute({
    document_file,
    user_id,
    description,
  }: CreateDocumentsUsersServiceDTO): Promise<void> {
    const user = await this.usersRepository.findByIdWithDocument(user_id);
    const [front, back] = user.documents;

    const document_side = {
      front,
      back,
    };

    if (document_side[description]) {
      const image_found = await this.imagesRepository.findById(
        document_side[description].image_id
      );
      await this.usersDocumentsRepository.deleteById(
        document_side[description].id
      );
      await this.storageProvider.delete(
        image_found.name,
        STORAGE_TYPE_FOLDER_ENUM.DOCUMENTS
      );
      await this.imagesRepository.deleteById(
        document_side[description].image_id
      );
    }
    const file_stripe = await this.paymentProvider.uploadAccountDocument({
      file_name: document_file,
      purpose: STRIPE_PURPOSE_DOCUMENT.identity_document,
    });

    const name = await this.storageProvider.save(
      document_file,
      STORAGE_TYPE_FOLDER_ENUM.DOCUMENTS
    );

    const image = await this.imagesRepository.create({ name });

    await this.usersDocumentsRepository.create({
      image_id: image.id,
      user_id,
      value: user.cpf,
      description: USER_DOCUMENT_VALUE_ENUM[description],
    });
    // await this.paymentProvider.updateAccountClient({
    //   external_id: user.details.stripe.customer.id,
    //   email: user.email,
    // });

    if (user?.details?.stripe?.account?.id) {
      await this.paymentProvider.updateAccount({
        external_id: user.details.stripe.account.id,
        individual: {
          verification: {
            document: {
              front: file_stripe.id,
              details: user.cpf,
            },
          },
        },
      });
    }
  }
}
