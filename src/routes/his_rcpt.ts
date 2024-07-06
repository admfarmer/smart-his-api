/// <reference path="../../typings.d.ts" />

import { Knex } from 'knex';
import * as fastify from 'fastify';

import { RcptsModel } from '../models/his/hi_rcpt';
import * as HttpStatus from 'http-status-codes';

const rcptsModel = new RcptsModel();

const router = (fastify, { }, next) => {

  var dbHIS: Knex = fastify.dbHIS;

  fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
    reply.code(200).send({ message: 'Welcome to SMART HIS API services!', version: '1.0 build 20190522-1' })
  });

  fastify.get('/info', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const limit:number = +req.query.limit || 10;
    const offset:number = +req.query.offset || 0;

    try {
      const rs: any = await rcptsModel.info(dbHIS,limit,offset);
      let info: any = [];
      for(let x of rs) {
        let data:object = {
          "vn": x.vn,
          "rcptno": x.rcptno,
          "an": x.an,
          "vstdate": x.vstdate,
          "vsttime": x.vsttime,
          "pttype": x.pttype,
          "rcptdate": x.rcptdate,
          "rcpttime": x.rcpttime,
          "bookno": x.bookno,
          "pageno": x.pageno,
          "gbookno": x.gbookno,
          "gpageno": x.gpageno,
          "amnt": x.amnt,
          "credit": x.credit,
          "modulate": x.modulate,
          "staff": x.staff,
          "lmdfdate": x.lmdfdate,
          "online": x.online
        }
        await info.push(data);
      }
      reply.code(HttpStatus.OK).send({ info: info })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.post('/insert', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const _info = req.body;
    try {
      const rs: any = await rcptsModel.save(dbHIS, _info);
      let data:number = rs[0]
      reply.code(HttpStatus.OK).send({ info: [data] })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });


  next();

}

module.exports = router;