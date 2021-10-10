import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { Image } from "@modules/images/infra/typeorm/entities/Image";

@Entity("providers_images")
export class ProviderImage {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  provider_id: string;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: "provider_id", referencedColumnName: "id" })
  provider: Provider;

  @Column()
  image_id: string;

  @ManyToOne(() => Image, { eager: true })
  @JoinColumn({ name: "image_id", referencedColumnName: "id" })
  image: Image;

  @Column()
  position: string;

  @Column()
  rating: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
