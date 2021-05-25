import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("transports_types_payments_types")
class TransportTypePaymentType {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  transport_type_id: string;

  @Column()
  payment_type_id: string;

  @Column()
  active: boolean;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { TransportTypePaymentType };
