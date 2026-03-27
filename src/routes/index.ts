/// <reference path="../../typings.d.ts" />
import { Knex } from 'knex';
import * as fastify from 'fastify';
import { SystemModel } from '../models/system';
import { BotTelegramModel } from '../models/bottelegram';
import { BotlineModel } from '../models/botline';
import * as HttpStatus from 'http-status-codes';
const systemModel = new SystemModel();
const botTelegramModel = new BotTelegramModel();
const botMophNotifyModel = new BotlineModel();

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
  fastify.get('/botTelegram/:telegramToken/:chatId/:message', async (req: fastify.Request, reply: fastify.Reply) => {
    let telegramToken:any = req.params.telegramToken;
    let chatId:any = req.params.chatId;
    let message:any = req.params.message;
    try {
      const rs: any = await botTelegramModel.sendTelegramMessage(telegramToken,chatId,message);
      reply.code(HttpStatus.OK).send({ ok:true,info: rs })

    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

    fastify.post('/botMophNotify/admin-ts', async (req: fastify.Request, reply: fastify.Reply) => {

    let client:any = 'ac35374e479e706197ce9d2a4e9e190d74f879d3';
    let secret:any = 'CJNUFNYW75U5EYXE2ISMIVKMP24Y';
    let message:any = req.body.message;

    try {
      const rs: any = await botMophNotifyModel.botMophNotify(message, client, secret);
      reply.code(HttpStatus.OK).send({ ok:true,info: rs })

    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  })

  next();

}

module.exports = router;