import { Knex } from 'knex';

export class LlbbkModel {

  tableName: string = 'l_lbbk';

  list(db: Knex) {
    return db(this.tableName).where('status' ,'Y');
  }

  selectVn(db: Knex,vn:any) {
    return db(this.tableName).select('l_lbbk.id','l_lbbk.vn','l_lbbk.labcode','lab.labname').innerJoin('lab','lab.labcode','l_lbbk.labcode')
    .where('l_lbbk.vn', vn).andWhere('l_lbbk.status' ,'Y');
  }

  save(db: Knex, info: any) {
    return db(this.tableName).insert(info);
  }

  update(db: Knex, id: any, info: any) {
    return db(this.tableName)
      .where('id', id)
      .update(info);
  }

  remove(db: Knex, id: any) {
    return db(this.tableName)
      .where('id', id)
      .del();
  }

}