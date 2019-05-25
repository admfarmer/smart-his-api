/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';
import * as moment from 'moment'
import * as request from 'request';
import { HiOvstModel } from '../models/his/hi_ovst'
import { BotlineModel } from '../models/botline'
import { DiagModel } from '../models/diag'

import * as HttpStatus from 'http-status-codes';
const hiOvstModel = new HiOvstModel();
const diagModel = new DiagModel();
const botlineModel = new BotlineModel();

const router = (fastify, { }, next) => {

    var dbHIS: Knex = fastify.dbHIS;
    var db: Knex = fastify.db;

    fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
        reply.code(200).send({ message: 'Fastify, RESTful API services!' })
    });

    fastify.post('/getOvstdx', async (req: fastify.Request, reply: fastify.Reply) => {
        let vn: any = [];
        let x: any = [];
        try {
            const rxx: any = await diagModel.infoVn(db);
            console.log(rxx);
            if (rxx[0]) {
                rxx.forEach(v => {
                    x.push(v.vn)
                });
                vn = x;

            } else {
                vn = 'NO'
            }

            console.log(vn);

            if (vn === 'NO') {
                const rs: any = await hiOvstModel.getOvstdxs(dbHIS);
                reply.code(HttpStatus.OK).send({ info: rs[0] })
            } else {
                const rs: any = await hiOvstModel.getOvstdx(dbHIS, vn);
                reply.code(HttpStatus.OK).send({ info: rs[0] })
            }
        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });

    fastify.post('/getOvst',
        //  s{preHandler: [fastify.authenticate]},
        async (req: fastify.Request, reply: fastify.Reply) => {
            const hn = req.body.hn;
            const vstdttm = req.body.vstdttm;
            const cln = req.body.cln;
            const pttype = req.body.pttype;
            const fname = req.body.fname;
            const lname = req.body.lname;
            const sex = req.body.sex;
            const birthdate = req.body.birthdate;

            const thDate = `${(moment(vstdttm).get('year') + 543) - 2500}`;
            let year: any = moment(vstdttm).format('Y');
            let birthY: any = moment(birthdate).format('Y');

            let vn: any = null;
            let vsttime: any;
            let age: any;

            let ovst: any;
            let ovstInfo: any;
            let ovstOne: any;
            let table: any;

            try {
                if (req.body) {
                    let datas = {
                        hn: hn,
                        vstdttm: vstdttm,
                        cln: cln,
                        pttype: pttype,
                        ovstist: '0',
                        ovstost: '0',
                        nrxtime: '0',
                        drxtime: '0',
                        overtime: '0',
                        bw: '0',
                        height: '0',
                        bmi: '0',
                        tt: '0',
                        pr: '0',
                        rr: '0',
                        sbp: '0',
                        dbp: '0',
                        preg: '0',
                        tb: '0',
                        toq: '0',
                        drink: '0',
                        mr: '0',
                        smoke: '0',
                        an: '0',
                        rcptno: '0',
                        register: '0',
                        waist_cm: '0'
                    }
                    ovst = await hiOvstModel.saveOvst(dbHIS, datas);
                    // console.log(hn, datas);
                    ovstInfo = await hiOvstModel.getOvstInfo(dbHIS, hn, vstdttm);

                    vn = ovstInfo[0].vn;
                    vsttime = moment(ovstInfo[0].vstdttm).format('HHss');
                    age = year - birthY;
                    table = 'o' + moment(vstdttm).format('DDMM') + thDate;

                    if (vn) {
                        let datas = {
                            hn: hn,
                            vn: vn,
                            vsttime: vsttime,
                            fname: fname,
                            lname: lname,
                            age: age,
                            male: sex,
                            pttype: pttype,
                            bw: '0',
                            tt: '0',
                            pr: '0',
                            rr: '0',
                            sbp: '0',
                            dbp: '0',
                            nrs: '0',
                            dtr: '0',
                            dtt: '0',
                            lab: '0',
                            xry: '0',
                            er: '0',
                            ors: '0',
                            rec: '0',
                            phm: '0',
                            hpt: '0',
                            phy: '0',
                            drxtime: '0',
                            ldrug: '0'
                        }
                        // console.log(table, datas)
                        ovstOne = await hiOvstModel.saveOvstOn(dbHIS, datas, table);
                    }
                    reply.code(HttpStatus.OK).send({ ovst: ovst, ovstOne: ovstOne })
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