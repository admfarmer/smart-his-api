/// <reference path="../../typings.d.ts" />

import { Knex } from 'knex';
import * as fastify from 'fastify';
import * as moment from 'moment'

import { HiIncothModel } from '../models/his/hi_incoth';
import { HiOvstModel } from '../models/his/hi_ovst'
import * as HttpStatus from 'http-status-codes';

const hiIncothModel = new HiIncothModel();
const hiOvstModel = new HiOvstModel();

const router = (fastify, { }, next) => {

  var dbHIS: Knex = fastify.dbHIS;
  var db: Knex = fastify.db;

  fastify.get('/', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    reply.code(200).send({ message: 'Welcome to SMART HIS API services!', version: '1.0 build 20190522-1' })
  });

  fastify.get('/select/:startdate/:enddate', async (req: fastify.Request, reply: fastify.Reply) => {
    const startdate = req.params.startdate;
    const enddate = req.params.enddate;

    try {
      const rs: any = await hiIncothModel.getDebtorIncoth(dbHIS, startdate, enddate);
      // console.log(rs);
      if (rs[0]) {
        rs.forEach(async v => {
          let info = {
            hospcode: v.hospcode,
            fullname: v.fullname,
            vn: v.vn,
            hn: v.hn,
            pttype: v.pttype,
            namepttype: v.namepttype,
            hospmain: v.hospmain,
            cid: v.cid,
            diagnosis: v.diagnosis,
            procedure: v.procedure_opd,
            date_serv: v.date_serv,
            lab: v.lab,
            sp: v.sp,
            proc: v.proc,
            item: v.item,
            xray: v.xray,
            drug: v.drug,
            rehab: v.rehab,
            other: v.other,
            total: v.total,
            status: 'DEBTOR'
          }
          // console.log(info);
          try {
            const rs: any = await hiIncothModel.insertDebtorIncoth(db, info);
          } catch (error) {
            console.log(error);
            // reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
          }
        });
        let info: any = [];
        for(let x of rs) {
          let data:object = {
            "vn": x.vn,
            "hospcode": x.hospcode,
            "fullname": x.fullname,
            "hn": x.hn,
            "pttype": x.pttype,
            "namepttype": x.namepttype,
            "hospmain": x.hospmain,
            "cid": x.cid,
            "diagnosis": x.diagnosis,
            "procedure": x.procedure,
            "date_serv": x.date_serv,
            "lab": x.lab,
            "sp": x.sp,
            "proc": x.proc,
            "item": x.item,
            "xray": x.xray,
            "drug": x.drug,
            "rehab": x.rehab,
            "other": x.other,
            "total": x.total,
            "accept": x.accept,
            "status": x.status
          }
          await info.push(data);
        }
        reply.code(HttpStatus.OK).send({ info: info })
      }else{
        reply.code(HttpStatus.OK).send({ info: 'Not Data' })

      }
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/selectDebtor', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {

    try {
      const rs: any = await hiIncothModel.getIncothSelect(db);
      let info: any = [];
      for(let x of rs) {
        let data:object = {
          "vn": x.vn,
          "hospcode": x.hospcode,
          "fullname": x.fullname,
          "hn": x.hn,
          "pttype": x.pttype,
          "namepttype": x.namepttype,
          "hospmain": x.hospmain,
          "cid": x.cid,
          "diagnosis": x.diagnosis,
          "procedure": x.procedure,
          "date_serv": x.date_serv,
          "lab": x.lab,
          "sp": x.sp,
          "proc": x.proc,
          "item": x.item,
          "xray": x.xray,
          "drug": x.drug,
          "rehab": x.rehab,
          "other": x.other,
          "total": x.total,
          "accept": x.accept,
          "status": x.status
        }
        await info.push(data);
      }
      reply.code(HttpStatus.OK).send({ info: info })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.post('/insertDebtor', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const _info = req.body;
    try {
      const rs: any = await hiIncothModel.insertDebtorIncoth(db, _info);
      let data:number = rs[0]
      reply.code(HttpStatus.OK).send({ info: data })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.put('/updateDebtor/:vn', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const _info = req.body;
    const vn = req.params.vn;
    try {
      const rs: any = await hiIncothModel.updateDebtorIncoth(db, vn, _info);
      let data:number = rs[0]
      reply.code(HttpStatus.OK).send({ info: data })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/infoOvst/:hn/:vstdttm', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const hn = req.params.hn;
    const vstdttm = req.params.vstdttm;

    try {
      const rs: any = await hiOvstModel.getOvstViews(dbHIS, hn, vstdttm);
      let info: any = [];
      for(let x of rs) {
        let data:object = {
          "hn": x.hn,
          "vn": x.vn,
          "pttype": x.pttype,
          "cln": x.cln,
          "vstdttm": x.vstdttm,
          "vsttime": x.vsttime,
          "fullname": x.fullname
        }
        await info.push(data);
      }
      reply.code(HttpStatus.OK).send({ info: info[0] })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/info/:hn/:vstdttm', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const hn = req.params.hn;
    const vstdttm = req.params.vstdttm;

    try {
      const rs: any = await hiIncothModel.getIncothInfo(dbHIS, hn, vstdttm);
      let info: any = [];
      for(let x of rs) {
        let data:object = {
          "id": x.id,
          "hn": x.hn,
          "vn": x.vn,
          "date": x.date,
          "time": x.time,
          "pttype": x.pttype,
          "namepttype": x.namepttype,
          "cgd": x.cgd,
          "income": x.income,
          "namecost": x.namecost,
          "rcptamt": x.rcptamt,
        }
        await info.push(data);
      }
      reply.code(HttpStatus.OK).send({ info: info })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/incothVn/:vn', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const vn = req.params.vn;

    try {
      const rs: any = await hiIncothModel.getIncothVn(dbHIS, vn);
      let info: any = [];
      for(let x of rs) {
        let data:object = {
          "id": x.id,
          "hn": x.hn,
          "vn": x.vn,
          "date": x.date,
          "time": x.time,
          "pttype": x.pttype,
          "namepttype": x.namepttype,
          "cgd": x.cgd,
          "income": x.income,
          "namecost": x.namecost,
          "rcptamt": x.rcptamt,
        }
        await info.push(data);
      }
      reply.code(HttpStatus.OK).send({ info: info })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.put('/:id', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const _info = req.body;
    const id = req.params.id;
    let info = {
      rcptamt: _info.rcptamt,
    }
    try {
      const rs: any = await hiIncothModel.update(dbHIS, id, info);
      let data:number = rs[0]
      reply.code(HttpStatus.OK).send({ info: data })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.put('/updatercpt/:vn', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const _info = req.body;
    const vn = req.params.vn;
    try {
      const rs: any = await hiIncothModel.updateIncoth(dbHIS, vn, _info);
      let data:number = rs[0]
      reply.code(HttpStatus.OK).send({ info: data })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.put('/updateovst/:vn', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const _info = req.body;
    const vn = req.params.vn;
    try {
      const rs: any = await hiOvstModel.updateOvst(dbHIS, vn, _info);
      let data:number = rs[0]
      reply.code(HttpStatus.OK).send({ info: data })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  next();

}

module.exports = router;