/// <reference path="../../typings.d.ts" />

import { Knex } from 'knex';
import * as fastify from 'fastify';

import { Icd10Model } from '../models/his/hi_icd10';
import * as HttpStatus from 'http-status-codes';
const icd10Model = new Icd10Model();

const router = (fastify, { }, next) => {

    var dbHIS: Knex = fastify.dbHIS;

    fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
        reply.code(200).send({ message: 'Fastify, RESTful API services!' })
    });

    fastify.get('/info', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
        try {
            const rs: any = await icd10Model.icd10Info(dbHIS);
            let info: any = [];
            for(let x of rs) {
              let data:object = {
                "icd10": x.icd10,
                "icd10name": x.icd10name,
              }
              await info.push(data);
            }
            reply.code(HttpStatus.OK).send({ info: info })
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });

    fastify.get('/selectIcd10/:icd10', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
        let icd10 = req.params.icd10;
        try {
            const rs: any = await icd10Model.selectIcd10(dbHIS,icd10);
            let info: any = [];
            for(let x of rs) {
              let data:object = {
                "icd10": x.icd10,
                "icd10name": x.icd10name,
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