import * as knex from 'knex';

export class HiIncothModel {
  tableName: string = 'incoth';

  async getIncothInfo(db: knex, hn: any, vstdttm: any) {
    let data = await db.raw(`
      SELECT i.id, o.hn , i.vn , i.date , i.time , i.pttype ,p.namepttype, i.cgd , i.income, c.namecost , i.rcptamt 
      FROM incoth as i
      INNER JOIN ovst as o ON o.vn = i.vn
      INNER JOIN income as c ON c.costcenter = i.income
      INNER JOIN pttype as p ON p.pttype = i.pttype
      WHERE o.hn = '${hn}'
      AND date(o.vstdttm) = '${vstdttm}'`);
    return data;
  }

  update(db: knex, id: any, info: any) {
    return db(this.tableName)
      .where('id', id)
      .update(info);
  }

}