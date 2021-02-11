import * as knex from 'knex';

export class LvisitModel {

  tableName: string = 'l_visit';

  list(db: knex) {
    return db(this.tableName);
  }  
  
  listVn(db: knex,vn:any) {
    return db(this.tableName).where('vn', vn);
  }

  selectHcode(db: knex,hcode:any) {
    return db(this.tableName).where('hcode', hcode).andWhere('status','Y');
  }  
  
  async selectDate(db: knex,date:any) {
    let data = await db.raw(`
    SELECT l_visit.* , pttype.namepttype , chospital.hosname FROM l_visit 
    INNER JOIN chospital on chospital.hoscode = l_visit.hcode
    INNER JOIN pttype on pttype.pttype = l_visit.pttype
    WHERE DATE(l_visit.vstdttm) = '${date}' and l_visit.status = 'Y'
    `);
    return data[0];
  }

  async selectHcodeDate(db: knex,hcode:any,date:any) {
    let data = await db.raw(`    
    SELECT l_visit.* , pttype.namepttype , chospital.hosname FROM l_visit 
    INNER JOIN chospital on chospital.hoscode = l_visit.hcode
    INNER JOIN pttype on pttype.pttype = l_visit.pttype 
    WHERE l_visit.hcode = '${hcode}' AND DATE(l_visit.vstdttm) = '${date}' and l_visit.status = 'Y'
    `);
    return data[0];
  }

  selectHn(db: knex,hn:any) {
    return db(this.tableName).where('hn', hn);
  }

  save(db: knex, info: any) {
    return db(this.tableName).insert(info);
  }

  update(db: knex, vn: any, info: any) {
    return db(this.tableName)
      .where('vn', vn)
      .update(info);
  }

  remove(db: knex, vn: any) {
    return db(this.tableName)
      .where('vn', vn)
      .del();
  }

}