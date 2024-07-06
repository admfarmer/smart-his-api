/// <reference path="../../typings.d.ts" />

import { Knex } from 'knex';
import * as fastify from 'fastify';

import { ClnsModel } from '../models/his/hi_cln';
import * as HttpStatus from 'http-status-codes';
const clnsModel = new ClnsModel();

const router = (fastify, { }, next) => {

    var dbHIS: Knex = fastify.dbHIS;

    fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
        reply.code(200).send({ message: 'Fastify, RESTful API services!' })
    });

    fastify.get('/info', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
        try {
            const rs: any = await clnsModel.clnInfo(dbHIS);
            let info: any = [];
            for(let x of rs) {
              let data:object = {
                "cln": x.cln,
                "namecln": x.namecln,
              }
              await info.push(data);
            }
            reply.code(HttpStatus.OK).send({ info: info })
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });

    fastify.get('/infoCln/:cln', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
        let cln = req.params.cln;
        try {
            const rs: any = await clnsModel.selectCln(dbHIS,cln);
            let info: any = [];
            for(let x of rs) {
              let data:object = {
                "cln": x.cln,
                "namecln": x.namecln,
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