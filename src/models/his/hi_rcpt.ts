import { Knex } from 'knex';

export class RcptsModel {
  tableName: string = 'rcpt';

  info(db: Knex,limit:number,offset:number) {
    return db(this.tableName)
    .limit(limit)
    .offset(offset);
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