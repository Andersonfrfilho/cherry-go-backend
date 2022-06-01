import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { TYPE_USER_TOKEN_ENUM } from "@modules/accounts/enums/TypeUserToken.enum";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

@Entity("users_tokens")
class UserTokens {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  refresh_token: string;

  @Column({ enum: TYPE_USER_TOKEN_ENUM })
  type: string;

  @Column()
  expires_date: Date;

  @CreateDateColumn()
  created_at: Date;
}

export { UserTokens };
