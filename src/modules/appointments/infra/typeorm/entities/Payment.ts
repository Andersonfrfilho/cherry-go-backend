import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { PaymentType } from "@modules/appointments/infra/typeorm/entities/PaymentType";

@Entity("payment")
class Payment {
  @PrimaryColumn()
  id?: string;

  @Column()
  current_value: string;

  @Column()
  type_id: string;

  @OneToOne(() => PaymentType)
  @JoinColumn()
  payment_type: PaymentType;

  @Column()
  origin_value: string;

  @Column()
  discount: string;

  @Column()
  increment: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { Payment };
