import { Knex } from 'knex';

export class RcptsModel {
  tableName: string = 'rcpt';

  info(db: Knex) {
    return db(this.tableName)
  }

  save(db: Knex, info: any) {
    return db(this.tableName)
      .insert(info);
  }

  update(db: Knex, rcptno: any, info: any) {
    return db(this.tableName)
      .where('rcptno', rcptno)
      .update(info);
  }

}