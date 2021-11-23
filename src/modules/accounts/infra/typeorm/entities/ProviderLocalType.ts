import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { LOCALS_TYPES_ENUM } from "@modules/accounts/enums/localsTypes.enum";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";

@Entity("providers_locals_types")
export class ProviderLocalType {
  @PrimaryColumn()
  @Generated("uuid")
  id?: string;

  @Column()
  provider_id: string;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: "provider_id", referencedColumnName: "id" })
  provider?: Provider;

  @Column({
    type: "enum",
    enum: LOCALS_TYPES_ENUM,
  })
  local_type: string;

  @Column()
  active: boolean;

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
