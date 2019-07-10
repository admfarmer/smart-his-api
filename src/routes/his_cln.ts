/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';

import { ClnsModel } from '../models/his/hi_cln';
import * as HttpStatus from 'http-status-codes';
const clnsModel = new ClnsModel();

const router = (fastify, { }, next) => {

    var dbHIS: Knex = fastify.dbHIS;

    fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
        reply.code(200).send({ message: 'Fastify, RESTful API services!' })
    });

    fastify.get('/info', async (req: fastify.Request, reply: fastify.Reply) => {
        try {
            const rs: any = await clnsModel.clnInfo(dbHIS);
            reply.code(HttpStatus.OK).send({ info: rs })
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });

    next();

}

module.exports = router;