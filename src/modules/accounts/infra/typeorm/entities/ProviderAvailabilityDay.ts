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

import { DAYS_WEEK } from "@modules/accounts/enums/DaysProviders.enum";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";

@Entity("providers_availabilities_days")
class ProviderAvailabilityDay {
  @PrimaryColumn()
  @Generated("uuid")
  id?: string;

  @Column({
    type: "enum",
    enum: DAYS_WEEK,
  })
  day: string;

  @Column()
  provider_id: string;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: "provider_id", referencedColumnName: "id" })
  provider: Provider;

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

export { ProviderAvailabilityDay };
