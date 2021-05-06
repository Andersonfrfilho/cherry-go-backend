import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("phones")
class Phone {
  @PrimaryColumn()
  id?: string;

  @Column()
  country_code: string;

  @Column()
  ddd: string;

  @Column()
  number: string;

  @Column()
  id_user: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}

export { Phone };
