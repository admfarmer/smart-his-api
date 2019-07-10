/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';

import * as HttpStatus from 'http-status-codes';
const EasySoap = require('easysoap');

const router = (fastify, { }, next) => {
    var dbHIS: Knex = fastify.dbHIS;
    var db: Knex = fastify.db;


    fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
        reply.code(200).send({ message: 'Fastify, RESTful API services!' })
    });

    fastify.post('/getNhso', async (req: fastify.Request, reply: fastify.Reply) => {
        const cid = req.body.cid;
        const nhsoToken = req.body.nhsoToken || localStorage.getItem('nhsoToken');
        const nhsoCid = req.body.nhsoCid || localStorage.getItem('nhsoCid');
        const args: any = {
            user_person_id: nhsoCid,
            person_id: cid,
            smctoken: nhsoToken
        }
        const params: any = {
            host: 'http://ucws.nhso.go.th',
            path: '/ucwstokenp1/UCWSTokenP1',
            wsdl: '/ucwstokenp1/UCWSTokenP1?wsdl'
        }
        const soapClient = EasySoap(params);
        soapClient.call({
            method: 'searchCurrentByPID',
            attributes: {
                xmlns: 'http://tokenws.ucws.nhso.go.th/'
            },
            params: args
        })
            .then((callResponse: any) => {
                console.log('callResponse : ', callResponse.data);	// response data as json
                let xx: any = callResponse.data
                reply.code(HttpStatus.OK).send({ xx })
                // const data = callResponse.data.searchCurrentByPIDResponse.return;
                // data.forEach(v => {
                //     const info = Object.keys(v);
                //     console.log(info);
                //     reply.code(HttpStatus.OK).send({ info: info[0] })
                // });
            })
            .catch((err: any) => {
                console.log(err);
                reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
            });
    });
    next();
}

module.exports = router;

