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

import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

@Entity("clients_tags")
export class ClientTag {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  tag_id: string;

  @ManyToOne(() => Tag)
  @JoinColumn({ name: "tag_id", referencedColumnName: "id" })
  tag: Tag;

  @Column()
  client_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "client_id", referencedColumnName: "id" })
  client: User;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
