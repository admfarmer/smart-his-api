/// <reference path="../../typings.d.ts" />

import { Knex } from 'knex';
import * as fastify from 'fastify';
import * as moment from 'moment'
import { BotlineModel } from '../models/botline'
import { HiOvstModel } from '../models/his/hi_ovst'
const hiOvstModel = new HiOvstModel();

import { DiagModel } from '../models/diag'
import * as HttpStatus from 'http-status-codes';
var cron = require('node-cron');
import {Validate} from './validation'

const diagModel = new DiagModel();
const botlineModel = new BotlineModel();
const validate = new Validate();

const router = (fastify, { }, next) => {

    var dbHIS: Knex = fastify.dbHIS;
    var db: Knex = fastify.db;

    fastify.get('/', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
        try {
            const rs: any = await diagModel.info(db);
            let info: any = [];
            for(let x of rs) {
              let data:object = {
                "vn": x.vn,
                "hn": x.hn,
                "fullname": x.fullname,
                "sex": x.sex,
                "age": x.age,
                "address": x.address,
                "pttype": x.pttype,
                "diag": x.diag,
                "diagname": x.diagname,
                "symptom": x.symptom,
                "vstdttm": x.vstdttm,
                "drxtime": x.drxtime,
                "update": x.update,
                "dchtype": x.dchtype          
              }
              await info.push(data);
            }
            reply.code(HttpStatus.OK).send({ info: info })
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });

    fastify.get('/infoVn', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
        try {
            const rs: any = await diagModel.infoVn(db);
            let info: any = [];
            for(let x of rs) {
              let data:object = {
                "vn": x.vn         
              }
              await info.push(data);
            }
            reply.code(HttpStatus.OK).send({ info: info })
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });

    fastify.post('/getDiag', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
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
                let message7 = datas.dchtype;
                let message8 = datas.age;
                let message9 = datas.sex;
                let message10 = datas.symptom;
                let messages = `ชื่อ-สกุล:${message1} เพศ:${message9} อายุ:${message8} ปี วันที่ Dx:${message2} เวลา Dx:${message3} diag:${message4} [ ${message5} ] มาด้วยอาการ: ${message10} สถานะ: ${message7} ที่อยู่:${message6}`;
                // console.log(messages);
                const rsx: any = await botlineModel.botLine(messages);
                const rs: any = await diagModel.save(db, datas, vn);
                let data:number = rs[0]
                reply.code(HttpStatus.OK).send({ info: messages })
            }
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });

    fastify.get('/lineInfo', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
        let vn: any = [];
        let vns: any = [];
        let _vn: any = [];
        let x: any = [];
        let info: any;
        let item: any = [];
        let items: any = [];
        let messages: string = '';

        try {
            const rxx: any = await diagModel.infoVn(db);
            // console.log(rxx[0]);
            if (rxx[0]) {
                rxx.forEach(v => {
                    x.push(v.vn)
                });
                vn = x;
            } else {
                vn = 'NO'
            }
            // console.log(vn);
            if (vn === 'NO') {
                const rs: any = await hiOvstModel.getOvstdxs(dbHIS);
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
                        let message1 = v.fullname;
                        let message2 = v.vstdttm;
                        let message3 = v.drxtime;
                        let message4 = v.diag;
                        let message5 = v.diagname;
                        let message6 = v.address;
                        let message7 = v.dchtype;
                        let message8 = v.age;
                        let message9 = v.sex;
                        let message10 = v.symptom;
                        messages = `ชื่อ-สกุล:${message1} เพศ:${message9} อายุ:${message8} ปี วันที่ Dx:${message2} เวลา Dx:${message3} diag:${message4} [ ${message5} ] มาด้วยอาการ: ${message10} สถานะ: ${message7} ที่อยู่:${message6}`;
                        // console.log(messages);
                        items = diagModel.saveInfo(db, v);
                        const rsx: any = botlineModel.botLine(messages);
                    });
                    reply.code(HttpStatus.OK).send({ info: messages })
                }
            } else {
                const rs: any = await hiOvstModel.getOvstdx(dbHIS, vn);
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
                        let message1 = v.fullname;
                        let message2 = v.vstdttm;
                        let message3 = v.drxtime;
                        let message4 = v.diag;
                        let message5 = v.diagname;
                        let message6 = v.address;
                        let message7 = v.dchtype;
                        let message8 = v.age;
                        let message9 = v.sex;
                        let message10 = v.symptom;
                        messages = `ชื่อ-สกุล:${message1} เพศ:${message9} อายุ:${message8} ปี วันที่ Dx:${message2} เวลา Dx:${message3} diag:${message4} [ ${message5} ] มาด้วยอาการ: ${message10} สถานะ: ${message7} ที่อยู่:${message6}`;
                        items = diagModel.saveInfo(db, v);
                        const rsx: any = botlineModel.botLine(messages);
                    });
                    reply.code(HttpStatus.OK).send({ info: messages })
                }
            }
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });

    cron.schedule('*/60 * * * *', async function () {
        console.log('running a task every minute');

        let vn: any = [];
        let vns: any = [];
        let _vn: any = [];
        let x: any = [];
        let info: any;
        let item: any = [];
        let items: any = [];
        const rxx: any = await diagModel.infoVn(db);
        console.log(rxx[0]);
        if (rxx[0]) {
            rxx.forEach(v => {
                x.push(v.vn)
            });
            vn = x;
        } else {
            vn = 'NO'
        }
        // console.log(vn);
        if (vn === 'NO') {
            const rs: any = await hiOvstModel.getOvstdxs(dbHIS);
            item = rs[0];
            if (!item) {
                console.log('NO');
                info = 'NO'
                // reply.code(HttpStatus.OK).send({ info: 'NO' })
            }
            if (info != 'NO') {
                console.log('OK');
                // console.log(item);
                item.forEach(v => {
                    let message1 = v.fullname;
                    let message2 = v.vstdttm;
                    let message3 = v.drxtime;
                    let message4 = v.diag;
                    let message5 = v.diagname;
                    let message6 = v.address;
                    let message7 = v.dchtype;
                    let message8 = v.age;
                    let message9 = v.sex;
                    let message10 = v.symptom;
                    let messages = `ชื่อ-สกุล:${message1} เพศ:${message9} อายุ:${message8} ปี วันที่ Dx:${message2} เวลา Dx:${message3} diag:${message4} [ ${message5} ] มาด้วยอาการ: ${message10} สถานะ: ${message7} ที่อยู่:${message6}`;
                    // console.log(messages);
                    items = diagModel.saveInfo(db, v);
                    const rsx: any = botlineModel.botLine(messages);
                });
                // reply.code(HttpStatus.OK).send({ info: item })
            }
        } else {
            const rs: any = await hiOvstModel.getOvstdx(dbHIS, vn);
            item = rs[0];
            // console.log(item);

            if (!item) {
                console.log('NO');
                info = 'NO'
                // reply.code(HttpStatus.OK).send({ info: 'NO' })
            }
            if (info != 'NO') {
                console.log('OK');
                // console.log(item);
                item.forEach(v => {
                    let message1 = v.fullname;
                    let message2 = v.vstdttm;
                    let message3 = v.drxtime;
                    let message4 = v.diag;
                    let message5 = v.diagname;
                    let message6 = v.address;
                    let message7 = v.dchtype;
                    let message8 = v.age;
                    let message9 = v.sex;
                    let message10 = v.symptom;
                    let messages = `ชื่อ-สกุล:${message1} เพศ:${message9} อายุ:${message8} ปี วันที่ Dx:${message2} เวลา Dx:${message3} diag:${message4} [ ${message5} ] มาด้วยอาการ: ${message10} สถานะ: ${message7} ที่อยู่:${message6}`;
                    items = diagModel.saveInfo(db, v);
                    const rsx: any = botlineModel.botLine(messages);
                });
                // reply.code(HttpStatus.OK).send({ info: item })
            }
        }

    });

    next();

}

module.exports = router;