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

  async getIncothVn(db: knex, vn: any) {
    let data = await db.raw(`
      SELECT i.id, o.hn , i.vn , i.date , i.time , i.pttype ,p.namepttype, i.cgd , i.income, c.namecost , i.rcptamt 
      FROM incoth as i
      INNER JOIN ovst as o ON o.vn = i.vn
      INNER JOIN income as c ON c.costcenter = i.income
      INNER JOIN pttype as p ON p.pttype = i.pttype
      WHERE o.vn = '${vn}'`);
    return data;
  }
  async getIncothSelect(db: knex) {
    let data = await db.raw(`
      SELECT * FROM debtor_incoth WHERE accept = 0;
      `);
    return data;
  }

  async getDebtorIncoth(db: knex, startdate: any, enddate: any) {
    let data = await db.raw(`
      select 
      '10957' as hospcode
      ,concat(p.fname,' ',p.lname) as fullname
      ,o.vn
      ,o.hn
      ,o.pttype
      ,t.namepttype
      ,s.hospmain
      ,cast(p.pop_id as char(13)) as cid
      ,ifnull((select cast(group_concat(icd10) as char(255)) from hi.ovstdx as x where o.vn=x.vn),(select cast(group_concat(icdda) as char(255)) from hi.dt inner join hi.dtdx on dtdx.dn=dt.dn where o.vn=dt.vn) ) as diagnosis
      ,ifnull((select group_concat(icd9cm) from hi.oprt as r where o.vn=r.vn),'') as procedure_opd
      ,date_format(o.vstdttm,'%Y-%m-%d') as date_serv
      ,ifnull(sum(case i.income when '01' then i.rcptamt end),0) as lab
      ,ifnull(sum(case i.income when '03' then i.rcptamt end),0) as sp
      ,ifnull(sum(case i.income when '04' then i.rcptamt end),0) as proc
      ,ifnull(sum(case i.income when '14' then i.rcptamt end),0) as item
      ,ifnull(sum(case i.income when '02' then i.rcptamt end),0) as xray
      ,ifnull(sum(case when i.income in ('08','09','10','11') then i.rcptamt end),0) as drug
      ,ifnull(sum(case when i.income in ('06','07') then i.rcptamt end),0) as rehab
      ,sum(case when i.income not in ('01','02','03','04','06','07','08','09','10','11','14') then i.rcptamt end) as other
      ,sum(i.rcptamt) as total
      from 
      hi.ovst as o 
      inner join hi.pt as p on o.hn=p.hn 
      inner join hi.incoth as i on o.vn=i.vn and o.an=0 
      inner join hi.pttype as t on o.pttype=t.pttype and t.inscl = 'AAA' 
      left join hi.insure as s on o.pttype=s.pttype and o.hn=s.hn 
      left join hi.hospcode as c on s.hospmain=c.off_id 
      where date_format(o.vstdttm,'%Y-%m-%d') BETWEEN date_format( '${startdate}' ,'%Y-%m-%d') and date_format( '${enddate}' ,'%Y-%m-%d')
      and o.pttype in ( '35','38')
      group by o.vn
      order by hospmain
      `);
    return data[0];
  }

  insertDebtorIncoth(db: knex, info: any) {
    console.log(info.vn);

    return db('debtor_incoth')
      .whereNot('vn', info.vn)
      .insert(info);
  }

  updateDebtorIncoth(db: knex, vn: any, info: any) {
    console.log(info);
    let sql = `update debtor_incoth set accept = ${info.accept} ,status = '${info.status}' where vn = ${vn}`;
    return db.raw(sql);

  }

  update(db: knex, id: any, info: any) {
    return db(this.tableName)
      .where('id', id)
      .update(info);
  }

  updateIncoth(db: knex, vn: any, info: any) {
    let sql = `update ${this.tableName} set rcptno = ${info.rcptno} where vn = ${vn}`;
    return db.raw(sql);
  }

}