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

import { DAYS_WEEK_ENUM } from "@modules/accounts/enums/DaysProviders.enum";
import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";

export interface DaysAvailable {
  date: Date;
  id?: string;
  day: string;
  provider_id: string;
  provider?: Provider;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
@Entity("providers_availabilities_days")
class ProviderAvailabilityDay {
  @PrimaryColumn()
  @Generated("uuid")
  id?: string;

  @Column({
    type: "enum",
    enum: DAYS_WEEK_ENUM,
  })
  day: string;

  @Column()
  provider_id: string;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: "provider_id", referencedColumnName: "id" })
  provider?: Provider;

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
