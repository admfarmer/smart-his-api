/// <reference path="../../typings.d.ts" />
import { Knex } from 'knex';
import * as fastify from 'fastify';
import { SystemModel } from '../models/system';
import * as HttpStatus from 'http-status-codes';
const systemModel = new SystemModel();

const router = (fastify, { }, next) => {

  var db: Knex = fastify.db;

  fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
    reply.code(200).send({ message: 'Welcome to SMART HIS API services!', version: '1.0 build 20190522-1' })
  });

  fastify.get('/info', async (req: fastify.Request, reply: fastify.Reply) => {
    try {
      const rs: any = await systemModel.getInfo(db);
      let info: any = [];
      for(let x of rs) {
        let data:object = {
          "hoscode": x.hoscode,
          "hosname": x.hosname,
          "topic": x.topic
        }
        await info.push(data);
      }
      reply.code(HttpStatus.OK).send({ info: info[0] })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  next();

}

module.exports = router;