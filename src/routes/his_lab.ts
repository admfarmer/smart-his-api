/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';

import { LabsModel } from '../models/his/hi_lab';
import {LabresultModel} from '../models/labresult';
import { BotlineModel } from '../models/botline'
import * as moment from 'moment';

import * as HttpStatus from 'http-status-codes';

const labsModel = new LabsModel();
const labresultModel = new LabresultModel();
const botlineModel = new BotlineModel();
var cron = require('node-cron');

const router = (fastify, { }, next) => {

    var dbHIS: Knex = fastify.dbHIS;
    var db: Knex = fastify.db;

    fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
        reply.code(200).send({ message: 'Fastify, RESTful API services!' })
    });

    fastify.get('/info', async (req: fastify.Request, reply: fastify.Reply) => {
        try {
            const rs: any = await labsModel.labInfo(dbHIS);
            reply.code(HttpStatus.OK).send({ info: rs })
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });


    fastify.get('/lineInfo', async (req: fastify.Request, reply: fastify.Reply) => {
        let ln: any = [];
        let vns: any = [];
        let _vn: any = [];
        let x: any = [];
        let info: any;
        let item: any = [];
        let items: any = [];
        try {
            const rxx: any = await labresultModel.infoLn(db);
            console.log(rxx[0]);
            if (rxx[0]) {
                rxx.forEach(v => {
                    x.push(v.ln)
                });
                ln = x;
            } else {
                ln = 'NO'
            }
            // console.log(vn);
            if (ln === 'NO') {
                const rs: any = await labsModel.labresult(dbHIS);
                item = rs[0];
                if (!item) {
                    console.log('NO');
                    info = 'NO'
                    reply.code(HttpStatus.OK).send({ info: 'NO' })
                }
                if (info != 'NO') {
                    console.log('OK');
                    // console.log(item);
                    item.forEach(v => {
                        let hn = v.hn;
                        let fullname = v.fullname;
                        let lab_code_local = v.lab_code_local;
                        let lab_name = v.lab_name;
                        let labresult = v.labresult;
                        let unit = v.unit;
                        let senddate = moment(v.senddate).format('YYYY-MM-DD');

                        let messages = `ชื่อ-สกุล:${fullname} HN:${hn} Code Local:${lab_code_local} ปี Lab name :${lab_name} labresult :${labresult}[ ${unit} ] senddate: ${senddate}`;
                        console.log(messages);
                        items = labresultModel.saveInfo(db, v);
                        // const rsx: any = botlineModel.botLabresultLine(messages);
                    });
                    reply.code(HttpStatus.OK).send({ info: item })
                }
            } else {
                const rs: any = await labsModel.labResultLn(dbHIS, ln);
                item = rs[0];
                // console.log(item);

                if (!item) {
                    console.log('NO');
                    info = 'NO'
                    reply.code(HttpStatus.OK).send({ info: 'NO' })
                }
                if (info != 'NO') {
                    console.log('OK');
                    // console.log(item);
                    item.forEach(v => {
                        let hn = v.hn;
                        let fullname = v.fullname;
                        let lab_code_local = v.lab_code_local;
                        let lab_name = v.lab_name;
                        let labresult = v.labresult;
                        let unit = v.unit;
                        let senddate = moment(v.senddate).format('YYYY-MM-DD');

                        let messages = `ชื่อ-สกุล:${fullname} HN:${hn} Code Local:${lab_code_local} ปี Lab name :${lab_name} labresult :${labresult}[ ${unit} ] senddate: ${senddate}`;
                        console.log(messages);
                        items = labresultModel.saveInfo(db, v);
                        const rsx: any = botlineModel.botLabresultLine(messages);
                    });
                    reply.code(HttpStatus.OK).send({ info: item })
                }
            }
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });


    cron.schedule('*/10 * * * *', async function () {
        console.log('running a task every minute');
        let ln: any = [];
        let x: any = [];
        let info: any;
        let item: any = [];
        let items: any = [];
        try {
            const rxx: any = await labresultModel.infoLn(db);
            // console.log('infoLn',rxx);
            if (rxx[0]) {
                rxx.forEach(v => {
                    x.push(v.ln)
                });
                ln = x;
            } else {
                ln = 'NO'
            }
            // console.log(vn);
            if (ln === 'NO') {
                const rs: any = await labsModel.labresult(dbHIS);
                item = rs;
                if (!item) {
                    console.log('NO');
                    info = 'NO'
                    // reply.code(HttpStatus.OK).send({ info: 'NO' })
                }
                if (info != 'NO') {
                    console.log('OK');
                    console.log(item);
                    item.forEach(v => {
                        let hn = v.hn;
                        let fullname = v.fullname;
                        let lab_code_local = v.lab_code_local;
                        let lab_name = v.lab_name;
                        let labresult = v.labresult;
                        let unit = v.unit;
                        let senddate = moment(v.senddate).format('YYYY-MM-DD');

                        let messages = `ชื่อ-สกุล:${fullname} HN:${hn} Code Local:${lab_code_local} ปี Lab name :${lab_name} labresult :${labresult}[ ${unit} ] senddate: ${senddate}`;
                        console.log(messages);
                        items = labresultModel.saveInfo(db, v);
                        // const rsx: any = botlineModel.botLabresultLine(messages);
                    });
                    // reply.code(HttpStatus.OK).send({ info: item })
                }
            } else {
                const rs: any = await labsModel.labResultLn(dbHIS, ln);
                item = rs;
                console.log('labResultLn',item);

                if (!item) {
                    console.log('NO');
                    info = 'NO'
                    // reply.code(HttpStatus.OK).send({ info: 'NO' })
                }
                if (info != 'NO') {
                    console.log('OK');
                    // console.log(item);
                    item.forEach(v => {
                        let hn = v.hn;
                        let fullname = v.fullname;
                        let lab_code_local = v.lab_code_local;
                        let lab_name = v.lab_name;
                        let labresult = v.labresult;
                        let unit = v.unit;
                        let senddate = moment(v.senddate).format('YYYY-MM-DD');

                        let messages = `ชื่อ-สกุล:${fullname} HN:${hn} Code Local:${lab_code_local} ปี Lab name :${lab_name} labresult :${labresult}[ ${unit} ] senddate: ${senddate}`;
                        console.log(messages);
                        items = labresultModel.saveInfo(db, v);
                        const rsx: any = botlineModel.botLabresultLine(messages);
                    });
                    // reply.code(HttpStatus.OK).send({ info: item })
                }
            }
        } catch (error) {
            console.log(error);
            // reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });
    next();

}

module.exports = router;