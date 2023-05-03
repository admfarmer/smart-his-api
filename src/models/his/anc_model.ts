import { Knex } from 'knex';

export class HisAncModel {

  getServices(db: Knex, hn: any, dateServ: any) {
    return db('ovst as o')
      .select(`o.vn as seq`, `p.pname as title_name`, `p.fname as first_name`, `p.lname as last_name`,
        db.raw(`DATE_FORMAT(date(o.vstdttm),'%Y-%m-%d') as date_serv`),
        db.raw(`DATE_FORMAT(time(o.vstdttm),'%h:%i:%s') as time_serv`),
        `c.namecln as department`)
      .innerJoin(`cln as c`, `c.cln`, `o.cln`)
      .innerJoin(`pt as p`, `p.hn`, `o.hn`)
      .where(`o.hn`, hn)
      .andWhereRaw(`DATE(o.vstdttm) = ?`, [dateServ]);
  }

  getProfile(db: Knex, hn: any) {
    return db(`pt as p`)
      .select(`p.hn as hn`, `p.pop_id as cid`, `p.pname as title_name`, `p.fname as first_name`, `p.lname as last_name`, `t.namepttype as pttype`)
      .innerJoin(`pttype as t`, `t.pttype`, `p.pttype`)
      .where(`p.hn`, hn);
  }

  getProfileCID(db: Knex, cid: any) {
    return db(`pt as p`)
      .select(`p.hn as hn`, `p.pop_id as cid`, `p.pname as title_name`, `p.fname as first_name`, `p.lname as last_name`)
      .where(`p.pop_id`, cid);
  }

  getOvstInfo(db: Knex, hn: any) {
    return db(`ovst as o `)
      .select(`o.vn as seq`, `o.hn as pid`,
        db.raw(`DATE_FORMAT(date(o.vstdttm),'%Y-%m-%d') as date_serv`),
        db.raw(`DATE_FORMAT(time(o.vstdttm),'%h:%i:%s') as time_serv`),
        `c.namecln as department`)
      .innerJoin(`ovstdx as dx`, `dx.vn`, `o.vn`)
      .innerJoin(`cln as c`, `c.cln`, `o.cln`)
      .innerJoin(`pt as p`, `p.hn`, `o.hn`)
      .where(`o.hn`, hn)
      .whereIn(`dx.icd10`, ['Z340', 'Z348', 'Z349', 'Z350', 'Z351', 'Z352', 'Z353', 'Z354', 'Z355', 'Z356', 'Z357', 'Z358', 'Z359', 'Z390', 'Z391', 'Z717', 'Z017'])
      .andWhere(`dx.cnt`, '1')
      .orderBy(`date_serv`, `DESC`);
  }

  getHospital(db: Knex) {
    return db('setup as s')
      .select('s.hcode as provider_code', 'h.namehosp as provider_name')
      .leftJoin('hospcode as h', 'h.off_id', '=', 's.hcode')
  }

  getAllergyDetail(db: Knex, hn: any) {
    return db('allergy')
      .select('namedrug as drug_name', 'detail as symptom')
      .where('hn', hn);
  }

  getChronic(db: Knex, hn: any) {
    return db('chronic as c')
      .select('c.chronic as icd_code', 'c.date_diag as start_date')
      .select(db.raw(`IF(i.name_t!='', i.name_t, "-") as icd_name`))
      .innerJoin('icd101 as i', 'i.icd10', '=', 'c.chronic')
      .where('c.pid', hn)
  }


  getDiagnosis(db: Knex, seq: any) {
    return db('ovstdx as o')
      .select('o.vn as seq', 'ovst.vstdttm as date_serv',
        'o.icd10 as icd_code',
        'o.cnt as diag_type')
      .select(db.raw(`time(ovst.vstdttm) as time_serv`))
      .select(db.raw(`IF(o.icd10name!='', o.icd10name, i.icd10name) as icd_name`))
      .innerJoin('ovst', 'ovst.vn', '=', 'o.vn')
      .innerJoin('icd101 as i', 'i.icd10', '=', 'o.icd10')
      .where('o.vn', seq);
  }

  getRefer(db: Knex, seq: any) {
    return db('orfro as o')
      .select('o.vn as seq', 'o.vstdate as date_serv',
        'o.rfrlct as depto_provider_codeartment',
        'h.namehosp as to_provider_name',
        'f.namerfrcs as refer_cause')
      .select(db.raw(`time(ovst.vstdttm) as time_serv`))
      .leftJoin('hospcode as h', 'h.off_id', '=', 'o.rfrlct')
      .innerJoin('ovst', 'ovst.vn', '=', 'o.vn')
      .leftJoin('rfrcs as f', 'f.rfrcs', '=', 'o.rfrcs')
      .where('o.vn', seq);
  }


  getDrugs(db: Knex, seq: any) {
    return db(`prsc as p`)
      .select(`p.vn as seq`,
        db.raw(`DATE_FORMAT(date(p.prscdate),'%Y%m%d') as date_serv`),
        db.raw(`DATE_FORMAT(time(p.prsctime),'%h:%i:%s') as time_serv`),
        `pd.nameprscdt as drug_name`,
        `pd.qty as qty`,
        `med.pres_unt as unit`,
        db.raw(`IF(m.doseprn1!='', m.doseprn1, 'no list') as usage_line1`),
        db.raw(`IF(m.doseprn2!='', m.doseprn2, 'no list') as usage_line2`),
        db.raw(`'' as usage_line3`))
      .leftJoin(`prscdt as pd`, `pd.PRSCNO`, `p.PRSCNO`)
      .leftJoin(`medusage as m`, `m.dosecode `, `pd.medusage`)
      .leftJoin(`meditem as med`, `med.meditem`, `pd.meditem`).where(`p.vn`, seq)
      .groupBy(`pd.qty`);
  }

  getLabs(db: Knex, seq: any) {
    return db(`labresult as r`)
      .select(db.raw(`DATE_FORMAT(date(l.vstdttm),'%Y-%m-%d') as date_serv`),
        db.raw(`DATE_FORMAT(time(l.vstdttm),'%h:%i:%s') as time_serv`),
        `r.lab_name as lab_code`,
        db.raw(`replace(lb.fieldlabel,"'",'\') as lab_name`),
        `r.labresult as lab_result`,
        `r.unit`,
        `r.normal as standard_result`)
      .innerJoin(`lbbk as l`, function () { this.on(`r.ln`, `l.ln`) })
      .innerJoin(`lablabel as lb`, function () {
        this.on(`r.labcode`, `lb.labcode`)
          .andOn(`r.lab_code_local`, `lb.fieldname`)
      })
      .where(`l.vn`, seq).andWhere(`l.finish`, `1`);
  }


  getAppointment(db: Knex, seq: any) {
    return db('oapp as o')
      .select('o.vn as seq', 'o.vstdate as date_serv', 'o.fudate as date', 'o.futime as time', 'o.cln as department', 'o.dscrptn as detail')
      .select(db.raw(`time(ovst.vstdttm) as time_serv`))
      .innerJoin('ovst', 'ovst.vn', '=', 'o.vn')
      .where('o.vn', seq);
  }


  getVaccineEpi(db: Knex, hn: any) {
    return db(`epi as e`)
      .select(`o.vstdttm as date_serv`,
        db.raw(`DATE_FORMAT(time(o.drxtime),'%h:%i:%s') as time_serv`),
        `cv.NEW as vaccine_code`,
        `h.namehpt as vaccine_name`)
      .innerJoin(`ovst as o`, `o.vn`, `e.vn`)
      .innerJoin(`cvt_vacc as cv`, `cv.OLD`, `e.vac`)
      .leftJoin(`hpt as h`, `h.codehpt`, `e.vac`)
      .where(`o.hn`, hn)

  }

  getVaccineOvst(db: Knex, hn: any) {
    return db(`ovst as o`)
      .select(`o.vstdttm as date_serv`,
        db.raw(`DATE_FORMAT(time(o.drxtime),'%h:%i:%s') as time_serv`),
        `vc.stdcode as vacine_code`,
        `vc.name as vacine_name`)
      .innerJoin(`prsc as pc`, `pc.vn`, `o.vn`)
      .innerJoin(`prscdt as pd`, `pd.prscno`, `pc.prscno`)
      .innerJoin(`meditem as m`, `m.meditem`, `pd.meditem`)
      .innerJoin(`vaccine as vc`, `vc.meditem`, `m.meditem`)
      .where(`o.hn`, hn);
  }

  getProcedureOvst(db: Knex, seq: any) {
    return db(`ovst as o`).select(`o.hn as pid`,
    `o.vn as seq`,
    db.raw(`DATE_FORMAT(date(o.vstdttm),'%Y%m%d') as date_serv`),	
    db.raw(`DATE_FORMAT(time(o.nrxtime),'%h:%i:%s') as time_serv`), 
    `p.icd9cm as procedure_code`,	
    `p.icd9name as procedure_name`,
    db.raw(`DATE_FORMAT(date(p.opdttm),'%Y%m%d') as start_date`),	
    db.raw(`DATE_FORMAT(time(p.opdttm),'%h:%i:%s') as start_time`),
    db.raw(`DATE_FORMAT(date(p.opdttm),'%Y%m%d') as end_date`),
    db.raw(`'00:00:00' as end_time`))
    .innerJoin(`ovstdx as ox`, `ox.vn`, `o.vn`)
    .innerJoin(`oprt as p`, `p.vn`, `o.vn`)
    .leftJoin(`cln as c`, `c.cln`, `o.cln`)
    .leftJoin(`dct`, function () {this.on(db.raw(`CASE WHEN LENGTH(o.dct) = 5 THEN dct.lcno = o.dct 
    WHEN LENGTH(o.dct) = 4 THEN dct.dct = substr(o.dct,1,2)  
    WHEN LENGTH(o.dct) = 2 THEN dct.dct = o.dct END`))
    }).where(`o.vn`, seq)
    .andWhere(`p.an`, `0`)
    .orderBy([
      { column: `o.vn` },
      { column: `p.icd9cm`, order: `ASC` }]);
  }
  getProcedureDtdx(db: Knex, seq: any) {
    return db(`dtdx`).select(`o.hn as pid`,
    `o.vn as seq`,
    db.raw(`DATE_FORMAT(date(o.vstdttm),'%Y%m%d') as date_serv`),
    db.raw(`DATE_FORMAT(time(o.nrxtime),'%h:%i:%s') as time_serv`), 
    `i.ICD10TM as procedure_code`,
    `i.name_Tx as procedure_name`,
    db.raw(`DATE_FORMAT(date(dt.vstdttm),'%Y%m%d') as start_date`),	
    db.raw(`DATE_FORMAT(time(dt.vstdttm),'%h:%i:%s') as start_time`),
    db.raw(`DATE_FORMAT(date(dt.vstdttm),'%Y%m%d') as end_date`),
    db.raw(`'00:00:00' as end_time`))
    .innerJoin(`icd9dent as i`, `i.ICD10TM`, `dtdx.dttx`)
    .innerJoin(`dt`, `dt.dn`, `dtdx.dn`)
    .innerJoin(`ovst as o`, function () { this.on(`o.vn`, `dt.vn`) })
    .leftOuterJoin(`cln as c`, `c.cln`, `o.cln`)
    .leftJoin(`dentist as d`, `d.codedtt`, `dt.dnt`)
    .where(`o.vn`, seq)
    .andWhere(`o.cln`, `40100`)
    .orderBy([
        { column: `dtdx.dn` },
        { column: `i.ICD10TM`, order: `ASC` }]);
  }

}
