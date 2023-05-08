import { Knex } from 'knex';

export class HiIncothModel {
  tableName: string = 'incoth';

  getIncothInfo(db: Knex, hn: any, vstdttm: any) {
    // console.log('vstdttm :',vstdttm);
    
    return db(`incoth as i`)
    .select(`i.id`, `o.hn` , `i.vn` , `i.date` , `i.time` , `i.pttype` ,`p.namepttype`, `i.cgd` , `i.income`, `c.namecost` , `i.rcptamt`)
    .innerJoin(`ovst as o`,`o.vn`,`i.vn`)
    .innerJoin(`income as c`,`c.costcenter`,`i.income`)
    .innerJoin(`pttype as p`,`p.pttype`,`i.pttype`)
    .where(`o.hn`,hn)
    .andWhereRaw(`date(o.vstdttm) = ?`,[vstdttm]);
  }

  getIncothVn(db: Knex, vn: any) {
    return db(`incoth as i`)
    .select(`i.id`, `o.hn` , `i.vn` , `i.date` , `i.time` , `i.pttype` ,`p.namepttype`, `i.cgd` , `i.income`, `c.namecost` , `i.rcptamt`)
    .innerJoin(`ovst as o`,`o.vn`,`i.vn`)
    .innerJoin(`income as c`,`c.costcenter`,`i.income`)
    .innerJoin(`pttype as p`,`p.pttype`,`i.pttype`)
    .where(`o.vn`,vn);
  }
  getIncothSelect(db: Knex) {
    return db(`debtor_incoth`).where(`accept`,'0');
  }

  getDebtorIncoth(db: Knex, startdate: any, enddate: any) {
    return db(`ovst as o`)
      .select(db.raw(`'10957' as hospcode`)
      ,db.raw(`concat(p.fname,' ',p.lname) as fullname`)
      ,`o.vn`
      ,`o.hn`
      ,`o.pttype`
      ,`t.namepttype`
      ,`s.hospmain`
      ,db.raw(`cast(p.pop_id as char(13)) as cid`)
      ,db.raw(`ifnull((select cast(group_concat(icd10) as char(255)) from hi.ovstdx as x where o.vn=x.vn),(select cast(group_concat(icdda) as char(255)) from hi.dt inner join hi.dtdx on dtdx.dn=dt.dn where o.vn=dt.vn) ) as diagnosis`)
      ,db.raw(`ifnull((select group_concat(icd9cm) from hi.oprt as r where o.vn=r.vn),'') as procedure_opd`)
      ,db.raw(`date_format(o.vstdttm,'%Y-%m-%d') as date_serv`)
      ,db.raw(`ifnull(sum(case i.income when '01' then i.rcptamt end),0) as lab`)
      ,db.raw(`ifnull(sum(case i.income when '03' then i.rcptamt end),0) as sp`)
      ,db.raw(`ifnull(sum(case i.income when '04' then i.rcptamt end),0) as proc`)
      ,db.raw(`ifnull(sum(case i.income when '14' then i.rcptamt end),0) as item`)
      ,db.raw(`ifnull(sum(case i.income when '02' then i.rcptamt end),0) as xray`)
      ,db.raw(`ifnull(sum(case when i.income in ('08','09','10','11') then i.rcptamt end),0) as drug`)
      ,db.raw(`ifnull(sum(case when i.income in ('06','07') then i.rcptamt end),0) as rehab`)
      ,db.raw(`sum(case when i.income not in ('01','02','03','04','06','07','08','09','10','11','14') then i.rcptamt end) as other`)
      ,db.raw(`sum(i.rcptamt) as total`))
      .innerJoin(`pt as p`,`p.hn`,`o.hn`)
      .innerJoin(`incoth as i`,`i.vn`,`o.vn`)
      .innerJoin(`pttype as t`,`t.pttype`,`o.pttype`)
      .leftJoin(`insure as s`,`s.hn`,`o.hn`)
      .leftJoin(`hospcode as c`,`c.off_id `,`s.hospmain`)
      .whereRaw(`date_format(o.vstdttm,'%Y-%m-%d') BETWEEN date_format( ? ,'%Y-%m-%d') and date_format( ? ,'%Y-%m-%d')
      and o.pttype in ( '35','38') and o.an=0 and o.pttype=s.pttype`,[startdate,enddate])
      .orderBy(`s.hospmain`).groupBy(`o.vn`);
  }

  insertDebtorIncoth(db: Knex, info: any) {
    return db('debtor_incoth')
      .whereNot('vn', info.vn)
      .insert(info);
  }

  updateDebtorIncoth(db: Knex, vn: any, info: any) {
    return db(`debtor_incoth`)
    .where('vn', vn)
    .update(info);
  }

  update(db: Knex, id: any, info: any) {
    return db(this.tableName)
      .where('id', id)
      .update(info);
  }

  updateIncoth(db: Knex, vn: any, info: any) {
    return db(this.tableName)
    .where('vn', vn)
    .update(info);
  }

}