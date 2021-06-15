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

import { Provider } from "./Providers";

@Entity("providers_availabilities_times")
class ProviderAvailabilityTime {
  @PrimaryColumn()
  @Generated("uuid")
  id?: string;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

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

export { ProviderAvailabilityTime };
