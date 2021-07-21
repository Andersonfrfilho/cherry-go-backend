import { getRepository, Repository } from "typeorm";

import { CreateImageRepositoryDTO } from "@modules/images/dtos";
import { Image } from "@modules/images/infra/typeorm/entities/Image";
import { ImagesRepositoryInterface } from "@modules/images/repositories/Images.repository.interface";

export class ImagesRepository implements ImagesRepositoryInterface {
  private repository: Repository<Image>;

  constructor() {
    this.repository = getRepository(Image);
  }
  async findById(id: string): Promise<Image> {
    return this.repository.findOne(id);
  }

  async create({ name }: CreateImageRepositoryDTO): Promise<Image> {
    const image_saved = await this.repository.save({ name });

    return this.repository.create(image_saved);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
