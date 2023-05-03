/// <reference path="../../typings.d.ts" />

import { Knex } from 'knex';
import * as fastify from 'fastify';
import * as HttpStatus from 'http-status-codes';
import * as Random from 'random-js';
import * as crypto from 'crypto';
import * as moment from 'moment'


import { LvisitModel } from '../models/l_visit';
import { HiOvstModel } from '../models/his/hi_ovst'
import { LlbbkModel } from '../models/l_lbbk'
import { LabsModel } from '../models/his/hi_lab'



const llbbkModel = new LlbbkModel();
const lvisitModel = new LvisitModel();
const hiOvstModel = new HiOvstModel();
const labsModel = new LabsModel();

const router = (fastify, { }, next) => {

  var dbHIS: Knex = fastify.dbHIS;
  var db: Knex = fastify.db;

  fastify.get('/', { preHandler: [fastify.authenticate, fastify.verifyAdmin] }, async (req: fastify.Request, reply: fastify.Reply) => {

    try {
      const rs: any = await lvisitModel.list(db);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, results: rs })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.get('/selectHcodeDate/:hcode/:date', { preHandler: [fastify.authenticate, fastify.verifyAdmin] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const hcode = req.params.hcode;
    const date = req.params.date;
    try {
      const rs: any = await lvisitModel.selectHcodeDate(db,hcode,date);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, results: rs })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.get('/selectDate/:date', { preHandler: [fastify.authenticate, fastify.verifyAdmin] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const date = req.params.date;
    try {
      const rs: any = await lvisitModel.selectDate(db,date);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, results: rs })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.get('/selectHcode/:hcode', { preHandler: [fastify.authenticate, fastify.verifyAdmin] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const hcode = req.params.hcode;
    try {
      const rs: any = await lvisitModel.selectHcode(db,hcode);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, results: rs })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.get('/selectHn/:hn', { preHandler: [fastify.authenticate, fastify.verifyAdmin] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const hn = req.params.hn;
    try {
      const rs: any = await lvisitModel.selectHn(db,hn);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, results: rs })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.post('/', { preHandler: [fastify.authenticate, fastify.verifyAdmin] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const hn = req.body.hn;
    const cid = req.body.cid;
    const vstdttm = req.body.vstdttm;
    const icd10 = req.body.icd10;
    const cln = req.body.cln;
    const pttype = req.body.pttype;
    const pname = req.body.pname;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const sex = req.body.sex;
    const birthdate = req.body.birthdate;
    const hcode = req.body.hcode;
    const cc = req.body.cc;

    const info: any = {
      hn: hn,
      cid: cid,
      vstdttm: vstdttm,
      icd10: icd10,
      cln: cln,
      pttype: pttype,
      pname: pname,
      fname: fname,
      lname: lname,
      sex: sex,
      birthdate: birthdate,
      hcode: hcode,
      cc: cc
    };

    try {
     let rs =  await lvisitModel.save(db, info);
     console.log(rs);
     
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK ,rows:rs[0]})
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.put('/:vn', { preHandler: [fastify.authenticate, fastify.verifyAdmin] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const vn = req.params.vn;
    const hn = req.body.hn;
    const cid = req.body.cid;
    const vstdttm = req.body.vstdttm;
    const icd10 = req.body.icd10;
    const cln = req.body.cln;
    const pttype = req.body.pttype;
    const pname = req.body.pname;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const sex = req.body.sex;
    const birthdate = req.body.birthdate;
    const hcode = req.body.hcode;
    const cc = req.body.cc;

    const info: any = {
      hn: hn,
      cid: cid,
      vstdttm: vstdttm,
      icd10: icd10,
      cln: cln,
      pttype: pttype,
      pname: pname,
      fname: fname,
      lname: lname,
      sex: sex,
      birthdate: birthdate,
      hcode: hcode,
      cc: cc
    };

    try {
      await lvisitModel.update(db, vn, info);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })
  
  fastify.delete('/:vn', { preHandler: [fastify.authenticate, fastify.verifyAdmin] }, async (req: fastify.Request, reply: fastify.Reply) => {
    let vn: any = req.params.vn;
    
    let info: any = {
      status: 'N'
    };
    console.log(vn);
    console.log(info);

    try {
      let rs = await lvisitModel.update(db, vn, info);
      console.log(rs);
      
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK ,rows:rs[0]})
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })


  fastify.put('/accepted/:vn', { preHandler: [fastify.authenticate, fastify.verifyAdmin] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const _vn = req.params.vn;
    const info = req.body;
  

    try {
      if(info.accepted == 'Y'){
        const list: any = await lvisitModel.listVn(db,_vn);
        const listlbbk: any = await llbbkModel.selectVn(db,_vn);
        console.log(list[0]);
  
        const hn = list[0].hn;
        const vstdttm = list[0].vstdttm;
        const cln = list[0].cln;
        const pttype = list[0].pttype;
        const fname = list[0].fname;
        const lname = list[0].lname;
        const sex = list[0].sex;
        const birthdate = list[0].birthdate;
        const icd10 = list[0].icd10;
        const cc = list[0].cc;
  
        const thDate = `${(moment(vstdttm).get('year') + 543) - 2500}`;
        let year: any = moment(vstdttm).format('Y');
        let birthY: any = moment(birthdate).format('Y');
  
        let vn: any = null;
        let vsttime: any;
        let age: any;
  
        let ovst: any;
        let ovstInfo: any;
        let ovstOne: any;
        let table: any;
  
        if (req.body) {
          let datas = {
              hn: hn,
              vstdttm: vstdttm,
              cln: cln,
              pttype: pttype,
              ovstist: '0',
              ovstost: '1',
              nrxtime: '0',
              drxtime: '0',
              overtime: '0',
              bw: '0',
              height: '0',
              bmi: '0',
              tt: '0',
              pr: '0',
              rr: '0',
              sbp: '0',
              dbp: '0',
              preg: '0',
              tb: '0',
              toq: '0',
              drink: '0',
              mr: '0',
              smoke: '0',
              an: '0',
              rcptno: '0',
              register: '0',
              waist_cm: '0',
              dct: 'f195'
          }
          ovst = await hiOvstModel.saveOvst(dbHIS, datas);
          ovstInfo = await hiOvstModel.getOvstInfo(dbHIS, hn, vstdttm);
  
          vn = ovstInfo[0].vn;
          vsttime = moment(ovstInfo[0].vstdttm).format('HHss');
          age = year - birthY;
          table = 'o' + moment(vstdttm).format('DDMM') + thDate;
  
          if (vn) {
              let datas = {
                  hn: hn,
                  vn: vn,
                  vsttime: vsttime,
                  fname: fname,
                  lname: lname,
                  age: age,
                  male: sex,
                  pttype: pttype,
                  bw: '0',
                  tt: '0',
                  pr: '0',
                  rr: '0',
                  sbp: '0',
                  dbp: '0',
                  nrs: '0',
                  dtr: '0',
                  dtt: '0',
                  lab: '0',
                  xry: '0',
                  er: '0',
                  ors: '0',
                  rec: '0',
                  phm: '0',
                  hpt: '0',
                  phy: '0',
                  drxtime: '0',
                  ldrug: '0'
              }
              ovstOne = await hiOvstModel.saveOvstOn(dbHIS, datas, table);


              // console.log(listlbbk);
              listlbbk.forEach(async v => {
                let data_lbbk = {
                  vn:vn,
                  labcode:v.labcode,
                  requestby:'sso',
                  vstdttm:vstdttm,
                  senddate:moment(vstdttm).format('YYYY-MM-DD'),
                  sendtime:'0',
                  hn:hn,
                  an:'0',
                  pttype:pttype
                }
                await labsModel.inSertLbbk(dbHIS, data_lbbk);
              });
    
                let dateVisitDx = {
                  vn:vn,
                  icd10:icd10,
                  icd10name:'',
                  cnt:'1',
                  consultid:'0'
                }
                await hiOvstModel.saveOvstDx(dbHIS, dateVisitDx);
    
                let dateSign = {
                  vn:vn,
                  an:'0',
                  sign:cc,
                  consultid:'0'
                }
                await hiOvstModel.saveSign(dbHIS, dateSign);

                let dateIncoth = {
                  vn:vn,
                  an:'0',
                  date:moment(vstdttm).format('YYYY-MM-DD'),
                  time:moment(vstdttm).format('Hmm'),
                  income:'04',
                  pttype:pttype,
                  paidst:' ',
                  rcptno:'0',
                  rcptamt:'50',
                  recno:'0',
                  cgd:' ',
                  codecheck:' '
                }
                await hiOvstModel.saveIncoth(dbHIS, dateIncoth);

          }


            await lvisitModel.update(db, _vn, info);
            reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
        
      } else {
          reply.code(HttpStatus.OK).send({ info: 'ไม่พบข้อมูล' })
      }
  
      }else{
        await lvisitModel.update(db, _vn, info);
        reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })

      }

    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })
  next();

}

module.exports = router;  