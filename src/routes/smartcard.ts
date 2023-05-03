/// <reference path="../../typings.d.ts" />

import { Knex } from 'knex';
import * as fastify from 'fastify';

import { SmartcardModel } from '../models/smartcard';
import * as HttpStatus from 'http-status-codes';
const smartcardModel = new SmartcardModel();

const router = (fastify, { }, next) => {

    var db: Knex = fastify.db;

    fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {

        try {
            let rs: any = {};
            rs = await smartcardModel.getSmartcard();
            reply.code(HttpStatus.OK).send({ info: rs })
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });

    next();

}

module.exports = router;