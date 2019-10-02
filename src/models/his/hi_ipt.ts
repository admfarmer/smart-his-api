import * as knex from 'knex';

export class HiIptModel {
  tableName: string = 'ipt';

  getIptInfo(db: knex, hn: any) {
    return db('ipt')
      .select('ipt.hn', 'ipt.an', db.raw(`CONCAT(pt.pname, pt.fname, ' ', pt.lname) as fullname`), 'ipt.ward', 'ipt.pttype', 'ipt.prediag', 'ipt.rgtdate',
        db.raw('time(ipt.rgttime) as rgttime'), 'ipt.dchdate', 'ipt.daycnt')
      .innerJoin('pt', 'pt.hn', 'ipt.hn')
      .where('ipt.hn', hn).groupBy('ipt.an')
      .orderBy('ipt.rgtdate', 'DESC');
  }

  getIptVn(db: knex, an: any) {
    return db('ipt')
      .select('ipt.hn', 'ipt.an', db.raw(`CONCAT(pt.pname, pt.fname, ' ', pt.lname) as fullname`), 'ipt.ward', 'ipt.pttype', 'ipt.prediag', 'ipt.rgtdate',
        db.raw('time(ipt.rgttime) as rgttime'), 'ipt.dchdate', 'ipt.daycnt')
      .innerJoin('pt', 'pt.hn', 'ipt.hn')
      .where('ipt.an', an).groupBy('ipt.an')
      .orderBy('ipt.rgtdate', 'DESC');
  }

}