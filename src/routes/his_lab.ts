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
    let ln: any[] = [];
    let items: any[] = [];
    let returnMessages: string[] = []; // ใช้เก็บข้อความทั้งหมดเพื่อส่งกลับใน response

    try {
        // 1. ดึงรายการเลขใบแล็บ (ln) ที่เคยประมวลผลไปแล้วจากฝั่ง App DB
        const rxx: any = await labresultModel.infoLn(db);
        
        if (rxx && rxx.length > 0) {
            // ดึงค่า ln มารวมเป็น Array ของเลขแล็บ เช่น ['808027', '808037']
            ln = rxx.map((v: any) => v.ln);
        }

        let rs: any;

        // 2. ดึงข้อมูลแล็บวิกฤตจากระบบ HIS
        if (ln.length === 0) {
            // กรณีที่ยังไม่มีข้อมูลในระบบเลย (ดึงทั้งหมดของวันนี้)
            rs = await labsModel.labresult(dbHIS);                
        } else {
            // กรณีมีข้อมูลเดิมอยู่แล้ว ส่ง Array `ln` ไปเพื่อดึงเฉพาะรายการใหม่ (ใช้คำสั่ง NOT IN ข้างใน Model)
            rs = await labsModel.labResultLn(dbHIS, ln);
        }

        // ถ้าไม่มีข้อมูลแล็บวิกฤตใหม่ส่งมาเลย ให้ตอบกลับทันที
        if (!rs || rs.length === 0) {
            console.log('NO NEW CRITICAL LABS');
            return reply.code(HttpStatus.OK).send({ info: 'NO' });
        }

        console.log(`FOUND ${rs.length} NEW CRITICAL LABS`);

        // 3. วนลูปประมวลผลข้อมูล ** เปลี่ยนจาก forEach เป็น for...of เพื่อให้ await ทำงานถูกต้อง **
        for (const v of rs) {
            let hn = v.hn;
            let fullname = v.fullname;
            let lab_code_local = v.lab_code_local;
            let lab_name = v.lab_name;
            let labresult = v.labresult;
            let unit = v.unit || '-';
            let senddate = moment(v.senddate).format('YYYY-MM-DD');

            // จัดรูปแบบข้อความแจ้งเตือน
            let msg = `ชื่อ-สกุล:${fullname} HN:${hn} Code Local:${lab_code_local} Lab name:${lab_name} labresult:${labresult}[ ${unit} ] senddate: ${senddate}`;
            returnMessages.push(msg); // เก็บข้อความของคนนี้ลงใน Array

            // บันทึกข้อมูลลงฐานข้อมูลฝั่ง App DB เพื่อป้องกันการดึงซ้ำในรอบถัดไป
            await labresultModel.saveInfo(db, v); 
            
            // 🚀 แนะนำ: เปิดฟังก์ชันไลน์บอทตรงนี้ได้เลยเพื่อให้ส่งเข้า LINE ทันทีที่เจอกรณีวิกฤต
            // await botlineModel.botLabresultLine(msg);
        }

        // 4. ส่งข้อความทั้งหมดกลับไปแสดงผล (รวมทุกรายการคั่นด้วยการขึ้นบรรทัดใหม่)
        reply.code(HttpStatus.OK).send({ info: returnMessages.join('\n') });

    } catch (error) {
        console.error("Error in /lineInfo:", error);
        reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ 
            message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) 
        });
    }
});
    
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

            // 3. วนลูปบันทึกข้อมูลและส่งแจ้งเตือนแบบเรียงลำดับ (เสถียร 100%)
            for (const v of item) {
                const senddate = moment(v.senddate).format('YYYY-MM-DD');
                const messages = `ชื่อ-สกุล : ${v.fullname} \nHN : ${v.hn} \nCode Local : ${v.lab_code_local} \nLab name : ${v.lab_name} \nlabresult : ${v.labresult} [ ${v.unit || '-'} ] \nsenddate : ${senddate}`;
                // console.log(messages);

                // บันทึกข้อมูลลง App DB
                await labresultModel.saveInfo(db, v);

                // ส่ง MOPH Notify (ทำทั้งสองเงื่อนไข)
                await botlineModel.mophNotify(messages, `Lab Result Notification`, '439487e5324b90dd0b68082cd6ac64c44440d8ad', 'ML5JNGIONAE25QTVMK2SAQ3EE62Q');

                // ส่ง Telegram (เฉพาะกรณีที่เคยมีข้อมูล ln เดิมอยู่แล้ว)
                if (ln !== 'NO') {
                    const telegramToken = "8178680362:AAF0SGx2CCLP8ldCaw3X2pBS_4l-zfFsPFM";
                    const chatId = "-4709105551";
                    await botTelegramModel.sendTelegramMessage(telegramToken, chatId, messages);
                }
            }
        } catch (error) {
            console.error("Cron Job Error: ", error);
        }
    });
    next();
}
module.exports = router;