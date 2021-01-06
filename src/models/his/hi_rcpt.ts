import * as knex from 'knex';

export class RcptsModel {
  tableName: string = 'rcpt';

  info(db: knex) {
    return db(this.tableName)
  }

  save(db: knex, info: any) {
    return db(this.tableName)
      .insert(info);
  }

  update(db: knex, rcptno: any, info: any) {
    return db(this.tableName)
      .where('rcptno', rcptno)
      .update(info);
  }

}