/// <reference path="../../typings.d.ts" />

import { Knex } from 'knex';
import * as fastify from 'fastify';

import { LabsModel } from '../models/his/hi_lab';
import {LabresultModel} from '../models/labresult';
import { BotlineModel } from '../models/botline'
import { BotTelegramModel } from '../models/bottelegram';

import * as moment from 'moment';

import * as HttpStatus from 'http-status-codes';

const labsModel = new LabsModel();
const botTelegramModel = new BotTelegramModel();

const labresultModel = new LabresultModel();
const botlineModel = new BotlineModel();
var cron = require('node-cron');

const router = (fastify, { }, next) => {

    var dbHIS: Knex = fastify.dbHIS;
    var db: Knex = fastify.db;

    fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
        reply.code(200).send({ message: 'Fastify, RESTful API services!' })
    });

    fastify.get('/selectLab/:labcode', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
        let labcode = req.params.labcode
        try {
            const rs: any = await labsModel.selectLab(dbHIS,labcode);
            let info: any = [];
            for(let x of rs) {
              let data:object = {
                "labcode": x.labcode,
                "labname": x.labname,
              }
              await info.push(data);
            }
            reply.code(HttpStatus.OK).send({ info: info })
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });

    fastify.get('/info', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
        try {
            const rs: any = await labsModel.labInfo(dbHIS);
            let info: any = [];
            for(let x of rs) {
              let data:object = {
                "labcode": x.labcode,
                "labname": x.labname,
              }
              await info.push(data);
            }
            reply.code(HttpStatus.OK).send({ info: info })
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });

    fastify.get('/lineInfo', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
        let ln: any = [];
        let vns: any = [];
        let _vn: any = [];
        let x: any = [];
        let info: any;
        let item: any = [];
        let items: any = [];
        let messages:string = '';
        try {
            const rxx: any = await labresultModel.infoLn(db);
            // console.log(rxx);
            if (rxx[0]) {
                rxx.forEach(async (v:any) => {
                    x.push(v.ln)
                });
                ln = x;
            } else {
                ln = 'NO'
            }
            console.log(ln);
            if (ln === 'NO') {
                const rs: any = await labsModel.labresult(dbHIS);                
                item = rs;
                if (!item) {
                    console.log('NO');
                    info = 'NO'
                    reply.code(HttpStatus.OK).send({ info: 'NO' })
                }
                if (info != 'NO') {
                    console.log('OK');
                    item.forEach(async (v:any) => {
                        let hn = v.hn;
                        let fullname = v.fullname;
                        let lab_code_local = v.lab_code_local;
                        let lab_name = v.lab_name;
                        let labresult = v.labresult;
                        let unit = v.unit;
                        let senddate = moment(v.senddate).format('YYYY-MM-DD');

                        messages = `ชื่อ-สกุล:${fullname} HN:${hn} Code Local:${lab_code_local} ปี Lab name :${lab_name} labresult :${labresult}[ ${unit} ] senddate: ${senddate}`;
                        // console.log(messages);
                        items = await labresultModel.saveInfo(db, v); 
                        // console.log(items);
                                               
                        // const rsx: any = botlineModel.botLabresultLine(messages);
                    });
                    reply.code(HttpStatus.OK).send({ info: messages })
                }
            } else {
                console.log('NO');
                
                const rs: any = await labsModel.labResultLn(dbHIS, ln);
                console.log(rs);
                
                item = rs;
                if (!item) {
                    console.log('NO');
                    info = 'NO'
                    reply.code(HttpStatus.OK).send({ info: 'NO' })
                }
                if (info != 'NO') {
                    console.log('OK');
                    // console.log(item);
                    item.forEach(async (v:any) => {
                        let hn = v.hn;
                        let fullname = v.fullname;
                        let lab_code_local = v.lab_code_local;
                        let lab_name = v.lab_name;
                        let labresult = v.labresult;
                        let unit = v.unit;
                        let senddate = moment(v.senddate).format('YYYY-MM-DD');

                        messages = `ชื่อ-สกุล:${fullname} HN:${hn} Code Local:${lab_code_local} ปี Lab name :${lab_name} labresult :${labresult}[ ${unit} ] senddate: ${senddate}`;
                        // console.log(messages);
                        items = await labresultModel.saveInfo(db, v);
                        // const rsx: any = botlineModel.botLabresultLine(messages);
                    });
                    reply.code(HttpStatus.OK).send({ info: messages })
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
                    // console.log(item);
                    item.forEach((v:any) => {
                        let hn = v.hn;
                        let fullname = v.fullname;
                        let lab_code_local = v.lab_code_local;
                        let lab_name = v.lab_name;
                        let labresult = v.labresult;
                        let unit = v.unit;
                        let senddate = moment(v.senddate).format('YYYY-MM-DD');

                        let messages = `ชื่อ-สกุล : ${fullname} \nHN : ${hn} \nCode Local : ${lab_code_local} \nLab name : ${lab_name} \nlabresult : ${labresult} [ ${unit} ] \nsenddate : ${senddate}`;
                        console.log(messages);
                        items = labresultModel.saveInfo(db, v);
                        // const rsx: any = botlineModel.botLabresultLine(messages);
                        const rs_notify: any = botlineModel.mophNotify(messages, `Lab Result Notification`, '439487e5324b90dd0b68082cd6ac64c44440d8ad', 'ML5JNGIONAE25QTVMK2SAQ3EE62Q'); // LAB_CRITICAL HC10957

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
                    item.forEach((v:any) => {
                        let hn = v.hn;
                        let fullname = v.fullname;
                        let lab_code_local = v.lab_code_local;
                        let lab_name = v.lab_name;
                        let labresult = v.labresult;
                        let unit = v.unit;
                        let senddate = moment(v.senddate).format('YYYY-MM-DD');

                        let messages = `ชื่อ-สกุล : ${fullname} \nHN : ${hn} \nCode Local : ${lab_code_local} \nLab name : ${lab_name} \nlabresult : ${labresult} [ ${unit} ] \nsenddate : ${senddate}`;
                        // console.log(messages);
                        items = labresultModel.saveInfo(db, v);
                        // const rs_line: any = botlineModel.botLabresultLine(messages);
                        const rs_notify: any = botlineModel.mophNotify(messages, `Lab Result Notification`, '439487e5324b90dd0b68082cd6ac64c44440d8ad', 'ML5JNGIONAE25QTVMK2SAQ3EE62Q'); // LAB_CRITICAL HC10957
                        
                        let telegramToken ="8178680362:AAF0SGx2CCLP8ldCaw3X2pBS_4l-zfFsPFM"
                        let chatId ="-4709105551"
                        const rs_telegram: any = botTelegramModel.sendTelegramMessage(telegramToken,chatId,messages);
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