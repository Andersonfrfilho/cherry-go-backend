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
import { Address } from "@modules/addresses/infra/typeorm/entities/Address";

interface ObjectId {
  id: string;
}
export interface StripeProviderLocal {
  product: ObjectId;
  price: ObjectId;
  sku: ObjectId;
}

export interface InterfaceDetailsProviderLocal {
  stripe: StripeProviderLocal;
}

@Entity("providers_addresses")
export class ProviderAddress {
  @PrimaryColumn()
  @Generated("uuid")
  id?: string;

  @Column()
  provider_id: string;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: "provider_id", referencedColumnName: "id" })
  provider: Provider;

  @Column()
  address_id: string;

  @ManyToOne(() => Address, { eager: true })
  @JoinColumn({ name: "address_id", referencedColumnName: "id" })
  address: Address;

  @Column()
  active: boolean;

  @Column()
  amount: number;

  @Column({ type: "jsonb" })
  details?: InterfaceDetailsProviderLocal;

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
