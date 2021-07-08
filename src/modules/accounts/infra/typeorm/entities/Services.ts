import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Provider } from "@modules/accounts/infra/typeorm/entities/Provider";
import { AppointmentProviderService } from "@modules/appointments/infra/typeorm/entities/AppointmentsProvidersServices";
import { Tag } from "@modules/tags/infra/typeorm/entities/Tag";

@Entity("services")
export class Service {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  name: string;

  @Column()
  amount: number;

  @Column()
  duration: number;

  @Column()
  active: boolean;

  @Column()
  provider_id: string;

  @ManyToOne(() => Provider, (provider) => provider.services)
  @JoinColumn({ name: "provider_id", referencedColumnName: "id" })
  provider?: Provider;

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable({
    name: "tags_services",
    joinColumns: [{ name: "service_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "tag_id", referencedColumnName: "id" }],
  })
  tags?: Tag[];

  @OneToMany(
    () => AppointmentProviderService,
    (appointment) => appointment.service
  )
  providers?: AppointmentProviderService[];

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
