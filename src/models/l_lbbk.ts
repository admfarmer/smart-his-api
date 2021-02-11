import * as knex from 'knex';

export class LlbbkModel {

  tableName: string = 'l_lbbk';

  list(db: knex) {
    return db(this.tableName).where('status' ,'Y');
  }

  selectVn(db: knex,vn:any) {
    return db(this.tableName).select('l_lbbk.id','l_lbbk.vn','l_lbbk.labcode','lab.labname').innerJoin('lab','lab.labcode','l_lbbk.labcode')
    .where('l_lbbk.vn', vn).andWhere('l_lbbk.status' ,'Y');
  }

  save(db: knex, info: any) {
    return db(this.tableName).insert(info);
  }

  update(db: knex, id: any, info: any) {
    return db(this.tableName)
      .where('id', id)
      .update(info);
  }

  remove(db: knex, id: any) {
    return db(this.tableName)
      .where('id', id)
      .del();
  }

}