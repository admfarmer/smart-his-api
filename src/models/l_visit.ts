import { Knex } from 'knex';

export class LvisitModel {

  tableName: string = 'l_visit';

  list(db: Knex) {
    return db(this.tableName);
  }  
  
  listVn(db: Knex,vn:any) {
    return db(this.tableName).where('vn', vn);
  }

  selectHcode(db: Knex,hcode:any) {
    return db(this.tableName).where('hcode', hcode).andWhere('status','Y');
  }  
  
  async selectDate(db: Knex,date:any) {
    let data = await db.raw(`
    SELECT l_visit.* , pttype.namepttype , chospital.hosname FROM l_visit 
    INNER JOIN chospital on chospital.hoscode = l_visit.hcode
    INNER JOIN pttype on pttype.pttype = l_visit.pttype
    WHERE DATE(l_visit.vstdttm) = '${date}' and l_visit.status = 'Y'
    `);
    return data[0];
  }

  async selectHcodeDate(db: Knex,hcode:any,date:any) {
    let data = await db.raw(`    
    SELECT l_visit.* , pttype.namepttype , chospital.hosname FROM l_visit 
    INNER JOIN chospital on chospital.hoscode = l_visit.hcode
    INNER JOIN pttype on pttype.pttype = l_visit.pttype 
    WHERE l_visit.hcode = '${hcode}' AND DATE(l_visit.vstdttm) = '${date}' and l_visit.status = 'Y'
    `);
    return data[0];
  }

  selectHn(db: Knex,hn:any) {
    return db(this.tableName).where('hn', hn);
  }

  save(db: Knex, info: any) {
    return db(this.tableName).insert(info);
  }

  update(db: Knex, vn: any, info: any) {
    return db(this.tableName)
      .where('vn', vn)
      .update(info);
  }

  remove(db: Knex, vn: any) {
    return db(this.tableName)
      .where('vn', vn)
      .del();
  }

}