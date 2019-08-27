/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';

import { HiIncothModel } from '../models/his/hi_incoth';
import { HiOvstModel } from '../models/his/hi_ovst'
import * as HttpStatus from 'http-status-codes';

const hiIncothModel = new HiIncothModel();
const hiOvstModel = new HiOvstModel();

const router = (fastify, { }, next) => {

  var dbHIS: Knex = fastify.dbHIS;

  fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
    reply.code(200).send({ message: 'Welcome to SMART HIS API services!', version: '1.0 build 20190522-1' })
  });

  fastify.get('/infoOvst/:hn/:vstdttm', async (req: fastify.Request, reply: fastify.Reply) => {
    const hn = req.params.hn;
    const vstdttm = req.params.vstdttm;

    try {
      const rs: any = await hiOvstModel.getOvstViews(dbHIS, hn, vstdttm);
      reply.code(HttpStatus.OK).send({ info: rs[0] })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/info/:hn/:vstdttm', async (req: fastify.Request, reply: fastify.Reply) => {
    const hn = req.params.hn;
    const vstdttm = req.params.vstdttm;

    try {
      const rs: any = await hiIncothModel.getIncothInfo(dbHIS, hn, vstdttm);
      reply.code(HttpStatus.OK).send({ info: rs[0] })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/incothVn/:vn', async (req: fastify.Request, reply: fastify.Reply) => {
    const vn = req.params.vn;

    try {
      const rs: any = await hiIncothModel.getIncothVn(dbHIS, vn);
      reply.code(HttpStatus.OK).send({ info: rs[0] })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.put('/:id', async (req: fastify.Request, reply: fastify.Reply) => {
    const _info = req.body;
    const id = req.params.id;
    let info = {
      rcptamt: _info.rcptamt,
    }
    try {
      const rs: any = await hiIncothModel.update(dbHIS, id, info);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.put('/updatercpt/:vn', async (req: fastify.Request, reply: fastify.Reply) => {
    const _info = req.body;
    const vn = req.params.vn;
    try {
      const rs: any = await hiIncothModel.updateIncoth(dbHIS, vn, _info);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.put('/updateovst/:vn', async (req: fastify.Request, reply: fastify.Reply) => {
    const _info = req.body;
    const vn = req.params.vn;
    try {
      const rs: any = await hiOvstModel.updateOvst(dbHIS, vn, _info);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  next();

}

module.exports = router;