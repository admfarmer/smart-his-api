/// <reference path="../../typings.d.ts" />

import { Knex } from 'knex';
import * as fastify from 'fastify';

import { LabsModel } from '../models/his/hi_lab';
import { LabresultModel } from '../models/labresult';
import { BotlineModel } from '../models/botline';
import { BotTelegramModel } from '../models/bottelegram';

import * as momentModule from 'moment';
const moment = momentModule.default;

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
            const rs: any = await labsModel.selectLab(dbHIS, labcode);
            let info: any = [];
            for (let x of rs) {
                let data: object = {
                    "labcode": x.labcode,
                    "labname": x.labname,
                }
                info.push(data);
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
            for (let x of rs) {
                let data: object = {
                    "labcode": x.labcode,
                    "labname": x.labname,
                }
                info.push(data);
            }
            reply.code(HttpStatus.OK).send({ info: info })
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });

    // ───ปรับปรุงส่วนของ API LINEINFO ──────────────────────────────────────────
    fastify.get('/lineInfo', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
        let returnMessages: string[] = [];

        try {
            const rxx: any = await labresultModel.infoLn(db);
            const ln = (rxx && rxx.length > 0) ? rxx.map((v: any) => v.ln) : 'NO';

            const rs: any = (ln === 'NO') 
                ? await labsModel.labresult(dbHIS) 
                : await labsModel.labResultLn(dbHIS, ln);

            if (!rs || rs.length === 0) {
                console.log('NO NEW CRITICAL LABS');
                return reply.code(HttpStatus.OK).send({ info: 'NO' });
            }

            console.log(`FOUND ${rs.length} NEW CRITICAL LABS`);

            for (const v of rs) {
                let senddate = moment(v.senddate).format('YYYY-MM-DD');
                let msg = `ชื่อ-สกุล:${v.fullname} HN:${v.hn} Code Local:${v.lab_code_local} Lab name:${v.lab_name} labresult:${v.labresult}[ ${v.unit || '-'} ] senddate: ${senddate}`;
                returnMessages.push(msg);

                // บันทึกข้อมูลลงฐานข้อมูล (ป้องกันพังถ้าซ้ำ)
                try {
                    await labresultModel.saveInfo(db, v); 
                } catch (dbError) {
                    console.warn(`[API DB Skip] Duplicate entry for ${v.ln}`);
                }
                
                // แจ้งเตือนผ่าน LINE & Telegram เสมอเมื่อเปิดผ่าน API
                await botlineModel.mophNotify(msg, `Lab Result Notification`, '439487e5324b90dd0b68082cd6ac64c44440d8ad', 'ML5JNGIONAE25QTVMK2SAQ3EE62Q');
                const telegramToken = "8178680362:AAF0SGx2CCLP8ldCaw3X2pBS_4l-zfFsPFM";
                const chatId = "-4709105551";
                await botTelegramModel.sendTelegramMessage(telegramToken, chatId, msg);
            }

            reply.code(HttpStatus.OK).send({ info: returnMessages.join('\n') });

        } catch (error) {
            console.error("Error in /lineInfo:", error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ 
                message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) 
            });
        }
    });
    
    // ─── ปรับปรุงส่วนของ CRON JOB (เสถียร 100% ยิงครบทุกแล็บ) ────────────────────────
    cron.schedule('*/10 * * * *', async function () {
        console.log('running a task every 10 minutes');
        try {
            // 1. ดึงข้อมูลเลขใบแล็บเดิม
            const rxx: any = await labresultModel.infoLn(db);
            const ln = (rxx && rxx.length > 0) ? rxx.map((v: any) => v.ln) : 'NO';

            // 2. ดึงข้อมูลแล็บวิกฤตจาก HIS ตามเงื่อนไข
            const item: any = (ln === 'NO') 
                ? await labsModel.labresult(dbHIS) 
                : await labsModel.labResultLn(dbHIS, ln);

            if (!item || item.length === 0) {
                console.log('NO NEW DATA');
                return;
            }

            console.log('OK - PROCESSING ITEMS:', item.length);

            // 3. วนลูปประมวลผล แจ้งเตือนแบบเสถียรเรียงลำดับ
            for (const v of item) {
                const senddate = moment(v.senddate).format('YYYY-MM-DD');
                const messages = `ชื่อ-สกุล : ${v.fullname} \nHN : ${v.hn} \nCode Local : ${v.lab_code_local} \nLab name : ${v.lab_name} \nlabresult : ${v.labresult} [ ${v.unit || '-'} ] \nsenddate : ${senddate}`;
                console.log(messages);

                // บันทึกข้อมูลลง App DB 
                // ครอบด้วย try-catch เพื่อไม่ให้เกิด Error ตัวซ้ำมาขัดจังหวะการยิงแจ้งเตือน
                try {
                    await labresultModel.saveInfo(db, v);
                    console.log(`Saved successfully: ${v.ln} - ${v.lab_code_local}`);
                } catch (dbError: any) {
                    console.warn(`[Skip DB Save]: ${v.ln} - ${v.lab_code_local} ซ้ำในเบส แต่จะทำงานต่อเพื่อแจ้งเตือน`);
                }

                // 🚀 ยิงแจ้งเตือนเสมอทุกกรณี (ทั้งแล็บตัวแรก หรือ ตัวตามหลังของใบแล็บเดิม)
                // 1. ส่ง LINE (MOPH Notify)
                await botlineModel.mophNotify(messages, `Lab Result Notification`, '439487e5324b90dd0b68082cd6ac64c44440d8ad', 'ML5JNGIONAE25QTVMK2SAQ3EE62Q');

                // 2. ส่ง Telegram (เอาเงื่อนไข IF ออก เพื่อแก้ไขอาการแล็บรอบแรกไม่ยอมเตือนเทเลแกรม)
                const telegramToken = "8178680362:AAF0SGx2CCLP8ldCaw3X2pBS_4l-zfFsPFM";
                const chatId = "-4709105551";
                await botTelegramModel.sendTelegramMessage(telegramToken, chatId, messages);
            }
        } catch (error) {
            console.error("Cron Job Error: ", error);
        }
    });

    next();
}

module.exports = router;