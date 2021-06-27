import faker from "faker";
import { getConnection, MigrationInterface } from "typeorm";

import { TypeUser } from "@modules/accounts/infra/typeorm/entities/TypeUser";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UsersTypesFactory } from "@shared/infra/typeorm/factories";

export class CreateUsersTypes1620665114995 implements MigrationInterface {
  public async up(): Promise<void> {
    const users = (await getConnection("seeds")
      .getRepository("users")
      .find()) as User[];

    const types_list = (await getConnection("seeds")
      .getRepository("types_users")
      .find()) as TypeUser[];

    const groups = Math.trunc(users.length / types_list.length);

    for(let i=0;i<types_users.length;i++){
      let array_send=[]
      for(let j=0;j<users.length;j++){
        if(j<number_groups){
          array_send.push(users[j+(i*number_groups)])
        }
        if(users.length%types_users.length!=0&&i==types_users.length-1&&j==users.length-1){
          array_send.push(users[users.length-1])
        }
      }
      array.push(array_send)
    }

    await getConnection("seeds")
      .getRepository("users_types_users")
      .save(relationship_users_types);
  }

  public async down(): Promise<void> {
    await getConnection("seeds").getRepository("users_types_users").delete({});
    await getConnection("seeds").getRepository("types_users").delete({});
  }
}
