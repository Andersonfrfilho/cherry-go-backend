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

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { TransportType } from "@modules/transports/infra/typeorm/entities/TransportType";

@Entity("providers_transports_types")
export class ProviderTransportType {
  @PrimaryColumn()
  @Generated("uuid")
  id?: string;

  @Column()
  provider_id: string;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: "provider_id", referencedColumnName: "id" })
  provider: Provider;

  @Column()
  transport_type_id: string;

  @ManyToOne(() => TransportType, { eager: true })
  @JoinColumn({ name: "transport_type_id", referencedColumnName: "id" })
  transport_type: TransportType;

  @Column()
  active: boolean;

  @Column()
  amount: number;

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
