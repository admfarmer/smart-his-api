/// <reference path="../../typings.d.ts" />

import { Knex } from 'knex';
import * as fastify from 'fastify';
import * as HttpStatus from 'http-status-codes';
import * as Random from 'random-js';
import * as crypto from 'crypto';

import { UserModel } from '../models/user';

const userModel = new UserModel();

const router = (fastify, { }, next) => {

  var db: Knex = fastify.db;

  fastify.get('/', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {

    try {
      const rs: any = await userModel.list(db);
      let info: any = [];
      for(let x of rs) {
        let data:object = {
          "user_id": x.user_id,
          "username": x.username,
          "fullname": x.fullname,
          "is_active": x.is_active,
          "user_type": x.user_type,
          "hcode": x.hcode
        }
        await info.push(data);
      }
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, results: rs })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.post('/', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const username = req.body.username;

    const password = req.body.password;
    const encPassword = crypto.createHash('md5').update(password).digest('hex');

    const fullname = req.body.fullname;
    const isActive = req.body.isActive;
    const userType = req.body.userType;

    const data: any = {
      username: username,
      password: encPassword,
      fullname: fullname,
      is_active: isActive,
      user_type: userType,
    };

    try {
      await userModel.save(db, data);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.put('/:userId', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const userId = req.params.userId;
    const fullname = req.body.fullname;
    const isActive = req.body.isActive;
    const password = req.body.password;
    const userType = req.body.userType;

    const info: any = {
      fullname: fullname,
      is_active: isActive,
      user_type: userType
    };

    if (password) {
      var encPass = crypto.createHash('md5').update(password).digest('hex');
      info.password = encPass;
    }

    try {
      await userModel.update(db, userId, info);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.put('/changepass/:userId', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const userId = req.params.userId;
    const password = req.body.password;
    const encPassword = crypto.createHash('md5').update(password).digest('hex');

    const info: any = {
      password: encPassword
    };

    try {
      await userModel.update(db, userId, info);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  fastify.delete('/:userId', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
    const userId: any = req.params.userId;

    try {
      await userModel.remove(db, userId);
      reply.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK })
    } catch (error) {
      fastify.log.error(error);
      reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  next();

}

module.exports = router;