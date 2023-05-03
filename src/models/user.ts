import { Knex } from 'knex';

export class UserModel {

  tableName: string = 'his_users';

  list(db: Knex) {
    return db(this.tableName)
      .select('user_id', 'username', 'fullname', 'is_active', 'user_type', 'hcode');
  }

  login(db: Knex, username: string, password: string) {
    return db(this.tableName)
      .select('fullname', 'user_id', 'user_type', 'hcode')
      .where({
        username: username,
        password: password,
        is_active: 'Y'
      });
  }

  save(db: Knex, user: any) {
    return db(this.tableName).insert(user);
  }

  update(db: Knex, userId: any, info: any) {
    return db(this.tableName)
      .where('user_id', userId)
      .update(info);
  }

  remove(db: Knex, userId: any) {
    return db(this.tableName)
      .where('user_id', userId)
      .del();
  }

}