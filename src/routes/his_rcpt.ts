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

  fastify.get('/info', async (req: fastify.Request, reply: fastify.Reply) => {

    try {
      const rs: any = await rcptsModel.info(dbHIS);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.post('/insert', async (req: fastify.Request, reply: fastify.Reply) => {
    const _info = req.body;
    try {
      const rs: any = await rcptsModel.save(dbHIS, _info);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });


  next();

}

module.exports = router;