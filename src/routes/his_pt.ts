/// <reference path="../../typings.d.ts" />

import { Knex } from 'knex';
import * as fastify from 'fastify';

import { HiPTModel } from '../models/his/hi_pt'
import * as HttpStatus from 'http-status-codes';
const hiPTModel = new HiPTModel();

const router = (fastify, { }, next) => {

    var dbHIS: Knex = fastify.dbHIS;
    var db: Knex = fastify.db;

    fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
        reply.code(200).send({ message: 'Fastify, RESTful API services!' })
    });

    fastify.post('/getPtInfo', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
            const hn = req.body.hn;
            const cid = req.body.cid;

            try {
                if (cid) {
                    const rs: any = await hiPTModel.getPtCidInfo(dbHIS, cid);
                    const idCard: any = rs[0].cid;
                    const pttype: any = rs[0].pttype;
                    const insure: any = await hiPTModel.getPttypeInfo(dbHIS, idCard, pttype);
                    let info: any = [];
                    for(let x of rs) {
                      let data:object = {
                        "hn": x.hn,
                        "cid": x.cid,
                        "pttype": x.pttype,
                        "title": x.title,
                        "firstname": x.firstname,
                        "lastname": x.lastname,
                        "sex": x.sex,
                        "birthdate": x.birthdate
                      }
                      await info.push(data);
                    }
                    let info_insure: any = [];
                    for(let x of rs) {
                      let data:object = {
                        "pttype": x.pttype,
                        "namepttype": x.namepttype,
                        "datein": x.datein,
                        "dateexp": x.dateexp,
                        "card_id": x.card_id
                      }
                      await info_insure.push(data);
                    }
                    reply.code(HttpStatus.OK).send({ info: info[0], insure: info_insure[0] })
                } else if (hn) {
                    const rs: any = await hiPTModel.getPtHnInfo(dbHIS, hn);
                    const idCard: any = rs[0].cid;
                    const pttype: any = rs[0].pttype;
                    const insure: any = await hiPTModel.getPttypeInfo(dbHIS, idCard, pttype);
                    let info: any = [];
                    for(let x of rs) {
                      let data:object = {
                        "hn": x.hn,
                        "cid": x.cid,
                        "pttype": x.pttype,
                        "title": x.title,
                        "firstname": x.firstname,
                        "lastname": x.lastname,
                        "sex": x.sex,
                        "birthdate": x.birthdate
                      }
                      await info.push(data);
                    }
                    let info_insure: any = [];
                    for(let x of rs) {
                      let data:object = {
                        "pttype": x.pttype,
                        "namepttype": x.namepttype,
                        "datein": x.datein,
                        "dateexp": x.dateexp,
                        "card_id": x.card_id
                      }
                      await info_insure.push(data);
                    }
                    reply.code(HttpStatus.OK).send({ info: info[0], insure: info_insure[0] })
                } else {
                    reply.code(HttpStatus.OK).send({ info: 'ไม่พบข้อมูล' })
                }
            } catch (error) {
                console.log(error);
                reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
            }
        });

    next();

}

module.exports = router;