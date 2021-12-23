import { Exclude } from "class-transformer";
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

import { User } from "./User";

@Entity("providers_clients_ratings")
export class ProviderClientRating {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  value: number;

  @Column()
  provider_id: string;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: "provider_id", referencedColumnName: "id" })
  provider: Provider;

  @Column()
  client_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "client_id", referencedColumnName: "id" })
  client: User;

  @Column({ type: "jsonb" })
  details?: any;

  @CreateDateColumn()
  @Exclude()
  created_at?: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at?: Date;

  @DeleteDateColumn()
  @Exclude()
  deleted_at?: Date;
}
