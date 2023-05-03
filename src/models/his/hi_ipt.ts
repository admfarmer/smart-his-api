import { Knex } from 'knex';

export class HiIptModel {
  tableName: string = 'ipt';

  getIptSelect(db: Knex, limit: any, offset: any) {
    return db('ipt')
      .select('ipt.hn', 'ipt.an', db.raw(`CONCAT(pt.pname, pt.fname, ' ', pt.lname) as fullname`),
        db.raw(`CONCAT(dct.fname, ' ', dct.lname) as doctorname`), 'idpm.nameidpm as ward', 'ipt.pttype', 'ipt.prediag', 'ipt.rgtdate',
        db.raw('time(ipt.rgttime) as rgttime'), 'ipt.dchdate', 'ipt.daycnt')
      .innerJoin('pt', 'pt.hn', 'ipt.hn')
      .innerJoin('idpm', 'idpm.idpm', 'ipt.ward')
      .innerJoin('iptdr', 'iptdr.an', 'ipt.an')
      .innerJoin('dct', 'dct.dct', db.raw('SUBSTRING(iptdr.dct, 3, 4)'))
      .groupBy('ipt.an')
      .orderBy('ipt.rgtdate', 'DESC')
      .limit(limit)
      .offset(offset);
  }

  getIptInfo(db: Knex, hn: any) {
    return db('ipt')
      .select('ipt.hn', 'ipt.an', db.raw(`CONCAT(pt.pname, pt.fname, ' ', pt.lname) as fullname`), 'ipt.ward', 'ipt.pttype', 'ipt.prediag', 'ipt.rgtdate',
        db.raw('time(ipt.rgttime) as rgttime'), 'ipt.dchdate', 'ipt.daycnt')
      .innerJoin('pt', 'pt.hn', 'ipt.hn')
      .where('ipt.hn', hn).groupBy('ipt.an')
      .orderBy('ipt.rgtdate', 'DESC');
  }

  getIptVn(db: Knex, an: any) {
    return db('ipt')
      .select('ipt.hn', 'ipt.an', db.raw(`CONCAT(pt.pname, pt.fname, ' ', pt.lname) as fullname`), 'ipt.ward', 'ipt.pttype', 'ipt.prediag', 'ipt.rgtdate',
        db.raw('time(ipt.rgttime) as rgttime'), 'ipt.dchdate', 'ipt.daycnt')
      .innerJoin('pt', 'pt.hn', 'ipt.hn')
      .where('ipt.an', an).groupBy('ipt.an')
      .orderBy('ipt.rgtdate', 'DESC');
  }

}