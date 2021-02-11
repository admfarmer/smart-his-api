/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';
import * as HttpStatus from 'http-status-codes';
import * as Random from 'random-js';
import * as crypto from 'crypto';

import { LlbbkModel } from '../models/l_lbbk';

const llbbkModel = new LlbbkModel();

const router = (fastify, { }, next) => {

  var db: Knex = fastify.db;

  fastify.get('/', { preHandler: [fastify.authenticate, fastify.verifyAdmin] }, async (req: fastify.Request, reply: fastify.Reply) => {

    try {
      const rs: any = await llbbkModel.list(db);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, results: rs })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.get('/selectVn/:vn', { preHandler: [fastify.authenticate, fastify.verifyAdmin] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const vn = req.params.vn;

    try {
      const rs: any = await llbbkModel.selectVn(db,vn);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, results: rs })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.post('/', { preHandler: [fastify.authenticate, fastify.verifyAdmin] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const vn = req.body.vn;
    const labcode = req.body.labcode;
    const vstdttm = req.body.vstdttm;
    const hcode = req.body.hcode;

    const info: any = {
      vn: vn,
      labcode: labcode,
      vstdttm: vstdttm,
      hcode: hcode
    };

    try {
      await llbbkModel.save(db, info);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.put('/:id', { preHandler: [fastify.authenticate, fastify.verifyAdmin] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const id = req.params.id;
    const vn = req.body.vn;
    const labcode = req.body.labcode;
    const vstdttm = req.body.vstdttm;
    const hcode = req.body.hcode;

    const info: any = {
      vn: vn,
      labcode: labcode,
      vstdttm: vstdttm,
      hcode: hcode
    };

    try {
      await llbbkModel.update(db, id, info);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.delete('/:id', { preHandler: [fastify.authenticate, fastify.verifyAdmin] }, async (req: fastify.Request, reply: fastify.Reply) => {
    let id: any = req.params.id;
    let info: any = {
      status: 'N'
    };
    console.log(id);
    console.log(info);

    try {
      await llbbkModel.update(db, id, info);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  next();

}

module.exports = router;  