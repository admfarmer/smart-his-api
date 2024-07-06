/// <reference path="../../typings.d.ts" />

import { Knex } from 'knex';
import * as fastify from 'fastify';

import { HiIptModel } from '../models/his/hi_ipt';
import * as HttpStatus from 'http-status-codes';
const hisModel = new HiIptModel();

const router = (fastify, { }, next) => {

  var dbHIS: Knex = fastify.dbHIS;

  fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
    reply.code(200).send({ message: 'Fastify, RESTful API services!' })
  });

  fastify.get('/select', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const limit:number = +req.query.limit || 10;
    const offset:number = +req.query.offset || 0;

    try {
      const rs: any = await hisModel.getIptSelect(dbHIS, limit, offset);
      let info: any = [];
      for(let x of rs) {
        let data:object = {
          "hn": x.hn,
          "an": x.an,
          "fullname": x.fullname,
          "doctorname": x.doctorname,
          "ward": x.ward,
          "pttype": x.pttype,
          "prediag": x.prediag,
          "rgtdate": x.rgtdate,
          "rgttime": x.rgttime,
          "dchdate": x.dchdate,
          "daycnt": x.daycnt,
        }
        await info.push(data);
      }
      reply.code(HttpStatus.OK).send({ info: info })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/info/:hn', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    let hn = req.params.hn
    try {
      const rs: any = await hisModel.getIptInfo(dbHIS, hn);
      let info: any = [];
      for(let x of rs) {
        let data:object = {
          "hn": x.hn,
          "an": x.an,
          "fullname": x.fullname,
          "doctorname": x.doctorname,
          "ward": x.ward,
          "pttype": x.pttype,
          "prediag": x.prediag,
          "rgtdate": x.rgtdate,
          "rgttime": x.rgttime,
          "dchdate": x.dchdate,
          "daycnt": x.daycnt,
        }
        await info.push(data);
      }
      reply.code(HttpStatus.OK).send({ info: info })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/infoAn/:an', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    let an = req.params.an
    try {
      const rs: any = await hisModel.getIptVn(dbHIS, an);
      let info: any = [];
      for(let x of rs) {
        let data:object = {
          "hn": x.hn,
          "an": x.an,
          "fullname": x.fullname,
          "doctorname": x.doctorname,
          "ward": x.ward,
          "pttype": x.pttype,
          "prediag": x.prediag,
          "rgtdate": x.rgtdate,
          "rgttime": x.rgttime,
          "dchdate": x.dchdate,
          "daycnt": x.daycnt,
        }
        await info.push(data);
      }
      reply.code(HttpStatus.OK).send({ info: info })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  next();

}

module.exports = router;