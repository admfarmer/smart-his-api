/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';
import * as moment from 'moment'
import { BotlineModel } from '../models/botline'

import { DiagModel } from '../models/diag'
import * as HttpStatus from 'http-status-codes';
const diagModel = new DiagModel();
const botlineModel = new BotlineModel();

const router = (fastify, { }, next) => {

    var dbHIS: Knex = fastify.dbHIS;
    var db: Knex = fastify.db;

    fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
        try {
            const rs: any = await diagModel.info(db);
            reply.code(HttpStatus.OK).send({ info: rs[0] })
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });

    fastify.get('/infoVn', async (req: fastify.Request, reply: fastify.Reply) => {
        try {
            const rs: any = await diagModel.infoVn(db);
            reply.code(HttpStatus.OK).send({ info: rs[0] })
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });

    fastify.post('/getDiag', async (req: fastify.Request, reply: fastify.Reply) => {
        const datas = req.body;
        const vn = req.body.vn;
        let info: any;
        try {
            const rsx: any = await diagModel.select(db, vn);
            if (rsx[0]) {
                console.log('NO');
                info = 'NO'
                reply.code(HttpStatus.OK).send({ info: 'NO' })
            }
            if (info != 'NO') {
                console.log('OK');
                let message1 = datas.fullname;
                let message2 = datas.vstdttm;
                let message3 = datas.drxtime;
                let message4 = datas.diag;
                let message5 = datas.diagname;
                let message6 = datas.address;

                let messages = `ชื่อ-สกุล:${message1} วันที่ Dx:${message2} เวลา Dx:${message3} diag:${message4} [ ${message5} ] ที่อยู่:${message6}`;
                // console.log(messages);

                const rsx: any = await botlineModel.botLine(messages);
                const rs: any = await diagModel.save(db, datas, vn);
                reply.code(HttpStatus.OK).send({ info: rs[0] })
            }
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });



    next();

}

module.exports = router;