/// <reference path="../../typings.d.ts" />

import * as Knex from 'knex';
import * as fastify from 'fastify';
import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment'

import { KpiMainModel } from '../models/kpi/kpi_main';
import { KpiStgModel } from '../models/kpi/kpi_stg';
import { KpiStgGroupModel } from '../models/kpi/kpi_stg_group';
import { KpiYearsModel } from '../models/kpi/kpi_years';
import { KpiDatasModel } from '../models/kpi/kpi_datas';

const kpiMainModel = new KpiMainModel();
const kpiStgModel = new KpiStgModel();
const kpiStgGroupModel = new KpiStgGroupModel();
const kpiYearsModel = new KpiYearsModel();
const kpiDatasModel = new KpiDatasModel();

const router = (fastify, { }, next) => {

  var db: Knex = fastify.db;

  fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
    reply.code(200).send({ message: 'Welcome to SMART HIS API services!', version: '1.0 build 20190522-1' })
  });

  fastify.get('/info', async (req: fastify.Request, reply: fastify.Reply) => {
    try {
      const rs: any = await kpiMainModel.getInfo(db);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/kpistg/:kpi_stg_id', async (req: fastify.Request, reply: fastify.Reply) => {
    const kpi_stg_id = req.params.kpi_stg_id;
    try {
      const rs: any = await kpiMainModel.getKpistg(db, kpi_stg_id);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/stg/info', async (req: fastify.Request, reply: fastify.Reply) => {
    try {
      const rs: any = await kpiStgModel.getInfo(db);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/stg/stgown/:stg_own', async (req: fastify.Request, reply: fastify.Reply) => {
    const stg_own = req.params.stg_own;
    try {
      const rs: any = await kpiStgModel.getKpiStgOwn(db, stg_own);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/stg/:stg_grp_id', async (req: fastify.Request, reply: fastify.Reply) => {
    const stg_grp_id = req.params.stg_grp_id;
    try {
      const rs: any = await kpiStgModel.getKpiStg(db, stg_grp_id);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/stggroup/info', async (req: fastify.Request, reply: fastify.Reply) => {
    try {
      const rs: any = await kpiStgGroupModel.getInfo(db);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/stggroup/:stg_group_own', async (req: fastify.Request, reply: fastify.Reply) => {
    const stg_group_own = req.params.stg_group_own;
    try {
      const rs: any = await kpiStgGroupModel.getKpiStgGroupOwn(db, stg_group_own);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/years/info', async (req: fastify.Request, reply: fastify.Reply) => {
    try {
      const rs: any = await kpiYearsModel.getInfo(db);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/years/:quarter/:year', async (req: fastify.Request, reply: fastify.Reply) => {
    const quarter = req.params.quarter;
    const year = req.params.year;
    try {
      const rs: any = await kpiYearsModel.getKpiYearsOne(db, quarter, year);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/years/year', async (req: fastify.Request, reply: fastify.Reply) => {
    const year = req.params.year;
    try {
      const rs: any = await kpiYearsModel.getKpiYears(db, year);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.post('/years/insert', async (req: fastify.Request, reply: fastify.Reply) => {
    const _info = req.body;

    let info = {
      quarter: _info.quarter,
      year: _info.year,
      status: _info.status || 'Y'
    }

    try {
      const rs: any = await kpiYearsModel.save(db, info);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.put('/years/:id', async (req: fastify.Request, reply: fastify.Reply) => {
    const _info = req.body;
    const id = req.params.id;

    let info = {
      quarter: _info.quarter,
      year: _info.year,
      status: _info.status || 'Y'
    }
    console.log(_info, ':', id);

    try {
      const rs: any = await kpiYearsModel.update(db, id, info);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });


  fastify.get('/datas/info', async (req: fastify.Request, reply: fastify.Reply) => {
    try {
      const rs: any = await kpiDatasModel.getInfo(db);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.get('/datas/:years_id/:kpi_id', async (req: fastify.Request, reply: fastify.Reply) => {
    const years_id = req.params.years_id;
    const kpi_id = req.params.kpi_id;
    try {
      const rs: any = await kpiDatasModel.getKpiDataYears(db, years_id, kpi_id);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.post('/datas/insert', async (req: fastify.Request, reply: fastify.Reply) => {
    const _info = req.body;
    // console.log(_info);

    let info = {
      years_id: _info.years_id,
      kpi_id: _info.kpi_id,
      kpi_datas: _info.kpi_datas,
      kpi_works: _info.kpi_works,
      sdate: moment(_info.sdate).format('YYYY-MM-DD'),
      status: _info.status || 'Y'
    }
    try {
      const rs: any = await kpiDatasModel.save(db, info);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });

  fastify.put('/datas/:id', async (req: fastify.Request, reply: fastify.Reply) => {
    const _info = req.body;
    const id = req.params.id;
    let info = {
      years_id: _info.years_id,
      kpi_id: _info.kpi_id,
      kpi_datas: _info.kpi_datas,
      kpi_works: _info.kpi_works,
      sdate: moment(_info.sdate).format('YYYY-MM-DD'),
      status: _info.status || 'Y'
    }

    try {
      const rs: any = await kpiDatasModel.update(db, id, info);
      reply.code(HttpStatus.OK).send({ info: rs })
    } catch (error) {
      console.log(error);
      reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
    }
  });


  next();

}

module.exports = router;