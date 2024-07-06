/// <reference path="../../typings.d.ts" />
import { Knex } from 'knex';
import * as fastify from 'fastify';
import * as moment from 'moment';
// model
import { HisHiModel } from './../models/his/hi_model';
import * as HttpStatus from 'http-status-codes';

// ห้ามแก้ไข // 
const hisModel = new HisHiModel();
const hoscode = process.env.HIS_HOSCODE;


const router = (fastify, { }, next) => {

    var dbHIS: Knex = fastify.dbHIS;

    fastify.get('/', async (req: fastify.Request, reply: fastify.Reply) => {
        reply.code(200).send({ message: 'Fastify, RESTful API services!' })
    });

    fastify.get('/testenv', async (req: fastify.Request, reply: fastify.Reply) => {

        try {
            reply.send({ ok: true });

        } catch (error) {
            reply.send({ ok: false, error: error });
        }

    });

    fastify.post('/ovstInfo', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
        const info = req.body;
        console.log(info);
        let profile: any = [];
        let visit: any = [];
        try {
            if (info.hn) {
                profile = await hisModel.getProfile(dbHIS, info.hn);
                // console.log(profile[0].hn);
                if (profile[0].hn) {
                    visit = await hisModel.getOvstInfo(dbHIS, profile[0].hn);
                }
                let info_profile: any = [];
                for(let x of profile) {
                  let data:object = {
                    "hn": x.hn,
                    "cid": x.cid,
                    "title_name": x.title_name,
                    "first_name": x.first_name,
                    "last_name": x.last_name,
                    "pttype": x.pttype
                  }
                  await info_profile.push(data);
                }
                let info_visit: any = [];
                for(let x of visit) {
                  let data:object = {
                    "seq": x.seq,
                    "pid": x.pid,
                    "date_serv": x.date_serv,
                    "time_serv": x.time_serv,
                    "department": x.department
                  }
                  await info_visit.push(data);
                }
                reply.code(HttpStatus.OK).send({ info: info_profile, visit: info_visit })
            } else if (info.cid) {
                profile = await hisModel.getProfileCID(dbHIS, info.cid);
                // console.log(profile[0].hn);
                if (profile[0].hn) {
                    visit = await hisModel.getOvstInfo(dbHIS, profile[0].hn);
                }
                let info_profile: any = [];
                for(let x of profile) {
                  let data:object = {
                    "hn": x.hn,
                    "cid": x.cid,
                    "title_name": x.title_name,
                    "first_name": x.first_name,
                    "last_name": x.last_name,
                    "pttype": x.pttype
                  }
                  await info_profile.push(data);
                }
                let info_visit: any = [];
                for(let x of visit) {
                  let data:object = {
                    "seq": x.seq,
                    "pid": x.pid,
                    "date_serv": x.date_serv,
                    "time_serv": x.time_serv,
                    "department": x.department
                  }
                  await info_visit.push(data);
                }
                reply.code(HttpStatus.OK).send({ info: info_profile, visit: info_visit })
            } else {
                reply.code(200).send({ info: 'No data!' })
            }

        } catch (error) {
            console.log(error);
            reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) })
        }
    });

    fastify.get('/view/:hn/:dateServ', { preHandler: [fastify.authenticate] }, async (req: fastify.Request, reply: fastify.Reply) => {
        let hn = req.params.hn;
        let dateServ = req.params.dateServ;
        // let uid = req.params.uid;
        // let requestId = req.params.request_id;
        let objService: any = {};
        let providerCode;
        let providerName;
        let profile = [];

        let providerCodeToken = hoscode;
        // if (requestId && hn && dateServ && uid) {
        if (hn && dateServ) {
            try {
                let rs_hospital: any = await hisModel.getHospital(dbHIS, providerCodeToken, hn);
                if (rs_hospital.length) {
                    providerCode = rs_hospital[0].provider_code;
                    providerName = rs_hospital[0].provider_name;
                }
                let rs_profile: any = await hisModel.getProfile(dbHIS, hn);;
                if (rs_profile.length) {
                    let info:any = [];
                    for(let x of rs_profile) {
                      let data:object = {
                        "hn": x.hn,
                        "cid": x.cid,
                        "title_name": x.title_name,
                        "first_name": x.first_name,
                        "last_name": x.last_name,
                        "pttype": x.pttype
                      }
                      info.push(data);
                    }
                    profile = info;
                }

                // const rs_vaccine: any = await hisModel.getVaccine(dbHIS, hn);
                const rs_vaccine_epi: any = await hisModel.getVaccineEpi(dbHIS, hn);
                const rs_vaccine_ovst: any = await hisModel.getVaccineOvst(dbHIS, hn);
                console.log('rs_vaccine_epi : ', rs_vaccine_epi);
                console.log('rs_vaccine_ovst : ', rs_vaccine_ovst);
                let vaccines: any = [];

                if (rs_vaccine_epi.length) {
                    for (const rv of rs_vaccine_epi) {
                        const objVcc = {
                            // "request_id": requestId,
                            // "uid": uid,
                            "provider_code": providerCode,
                            "provider_name": providerName,
                            "date_serv": moment(rv.date_serv).format('YYYY-MM-DD'),
                            "time_serv": rv.time_serv,
                            "vaccine_code": rv.vaccine_code,
                            "vaccine_name": rv.vaccine_name
                        }
                        vaccines.push(objVcc);
                    }
                    // objService.vaccines = vaccines;
                }

                if (rs_vaccine_ovst.length) {
                    for (const rv of rs_vaccine_ovst) {
                        const objVcc = {
                            // "request_id": requestId,
                            // "uid": uid,
                            "provider_code": providerCode,
                            "provider_name": providerName,
                            "date_serv": moment(rv.date_serv).format('YYYY-MM-DD'),
                            "time_serv": rv.time_serv,
                            "vaccine_code": rv.vaccine_code,
                            "vaccine_name": rv.vaccine_name
                        }
                        vaccines.push(objVcc);
                    }
                    // objService.vaccines = vaccines;
                }
                if (rs_vaccine_epi.length || rs_vaccine_ovst.length) {
                    objService.vaccines = vaccines;
                }

                let rs_allergy: any = await hisModel.getAllergyDetail(dbHIS, hn);
                if (rs_allergy.length) {
                    let allergy: any = [];
                    for (const ra of rs_allergy) {
                        const objAllergy = {
                            // "request_id": requestId,
                            // "uid": uid,
                            "provider_code": providerCode,
                            "provider_name": providerName,
                            "drug_name": ra.drug_name,
                            "symptom": ra.symptom
                        }
                        allergy.push(objAllergy);
                    }
                    objService.allergy = allergy;
                }

                let rs_services: any = await hisModel.getServices(dbHIS, hn, dateServ);
                // console.log('Service : ', rs_services);
                if (rs_services.length) {
                    const diagnosis = [];
                    const drugs = [];
                    const lab = [];
                    const procedure = [];
                    const appointment = [];
                    const refer = [];
                    for (const v of rs_services) {
                        const rs_diagnosis = await hisModel.getDiagnosis(dbHIS, hn, dateServ, v.seq);
                        if (rs_diagnosis.length) {
                            for (const rg of rs_diagnosis) {
                                const objDiagnosis = {
                                    // "request_id": requestId,
                                    // "uid": uid,
                                    "provider_code": providerCode,
                                    "provider_name": providerName,
                                    "seq": rg.seq,
                                    "date_serv": moment(rg.date_serv).format('YYYY-MM-DD'),
                                    "time_serv": rg.time_serv,
                                    "icd_code": rg.icd_code,
                                    "icd_name": rg.icd_name,
                                    "diag_type": rg.diag_type
                                }
                                diagnosis.push(objDiagnosis);
                            }
                            objService.diagnosis = diagnosis;
                        }

                        // const rs_procedure = await hisModel.getProcedure(dbHIS, hn, dateServ, v.seq)
                        const rs_procedure_ovst = await hisModel.getProcedureOvst(dbHIS, v.seq)
                        const rs_procedure_dtdx = await hisModel.getProcedureDtdx(dbHIS, v.seq)
                        console.log('rs_procedure_ovst : ', rs_procedure_ovst);
                        console.log('rs_procedure_dtdx : ', rs_procedure_dtdx);

                        if (rs_procedure_ovst.length) {
                            for (const rp of rs_procedure_ovst) {
                                const objProcedure = {
                                    // "request_id": requestId,
                                    // "uid": uid,
                                    "provider_code": providerCode,
                                    "provider_name": providerName,
                                    "seq": rp.seq,
                                    "date_serv": moment(rp.date_serv).format('YYYY-MM-DD'),
                                    "time_serv": rp.time_serv,
                                    "procedure_code": rp.procedure_code,
                                    "procedure_name": rp.procedure_name,
                                    "start_date": moment(rp.start_date).format('YYYY-MM-DD'),
                                    "start_time": rp.start_time,
                                    "end_date": rp.end_date ? moment(rp.end_date).format('YYYY-MM-DD') : rp.end_date,
                                    "end_time": rp.end_time
                                }
                                procedure.push(objProcedure);
                            }
                            // objService.procedure = procedure;
                        }
                        if (rs_procedure_dtdx.length) {
                            for (const rp of rs_procedure_dtdx) {
                                const objProcedure = {
                                    // "request_id": requestId,
                                    // "uid": uid,
                                    "provider_code": providerCode,
                                    "provider_name": providerName,
                                    "seq": rp.seq,
                                    "date_serv": moment(rp.date_serv).format('YYYY-MM-DD'),
                                    "time_serv": rp.time_serv,
                                    "procedure_code": rp.procedure_code,
                                    "procedure_name": rp.procedure_name,
                                    "start_date": moment(rp.start_date).format('YYYY-MM-DD'),
                                    "start_time": rp.start_time,
                                    "end_date": rp.end_date ? moment(rp.end_date).format('YYYY-MM-DD') : rp.end_date,
                                    "end_time": rp.end_time
                                }
                                procedure.push(objProcedure);
                            }
                            // objService.procedure = procedure;
                        }
                        if (rs_procedure_ovst.length || rs_procedure_dtdx.length) {
                            objService.procedure = procedure;
                        }

                        const rs_drugs = await hisModel.getDrugs(dbHIS, v.seq);
                        if (rs_drugs.length) {
                            for (const rd of rs_drugs) {
                                const objDrug = {
                                    // "request_id": requestId,
                                    // "uid": uid,
                                    "provider_code": providerCode,
                                    "provider_name": providerName,
                                    "seq": rd.seq,
                                    "date_serv": moment(rd.date_serv).format('YYYY-MM-DD'),
                                    "time_serv": rd.time_serv,
                                    "drug_name": rd.drug_name,
                                    "qty": rd.qty,
                                    "unit": rd.unit,
                                    "usage_line1": rd.usage_line1,
                                    "usage_line2": rd.usage_line2,
                                    "usage_line3": rd.usage_line3
                                }
                                drugs.push(objDrug);
                            }
                            objService.drugs = drugs;
                        }


                        const rs_lab = await hisModel.getLabs(dbHIS, v.seq);
                        if (rs_lab.length) {
                            for (const rl of rs_lab) {
                                const objLab = {
                                    // "request_id": requestId,
                                    // "uid": uid,
                                    "provider_code": providerCode,
                                    "provider_name": providerName,
                                    "seq": rl.seq,
                                    "date_serv": moment(rl.date_serv).format('YYYY-MM-DD'),
                                    "time_serv": rl.time_serv,
                                    "lab_code": rl.lab_code,
                                    "lab_name": rl.lab_name,
                                    "lab_result": rl.lab_result,
                                    "standard_result": rl.standard_result
                                }
                                lab.push(objLab);
                            }
                            objService.lab = lab;
                        }

                        const rs_apps = await hisModel.getAppointment(dbHIS, hn, dateServ, v.seq);
                        if (rs_apps && rs_apps.length > 0) {
                            for (const rs_app of rs_apps) {
                                const objAppointment = {
                                    // "request_id": requestId,
                                    // "uid": uid,
                                    "provider_code": providerCode,
                                    "provider_name": providerName,
                                    "seq": rs_app.seq,
                                    "date_serv": moment(rs_app.date_serv).format('YYYY-MM-DD'),
                                    "time_serv": rs_app.time_serv,
                                    "clinic": rs_app.department,
                                    "appoint_date": moment(rs_app.date).format('YYYY-MM-DD'),
                                    "appoint_time": rs_app.time,
                                    "detail": rs_app.detail
                                }
                                appointment.push(objAppointment);
                            }
                            objService.appointment = appointment;
                        }

                        const rs_refers = await hisModel.getRefer(dbHIS, hn, dateServ, v.seq);
                        if (rs_refers && rs_refers.length > 0) {
                            for (const rs_refer of rs_refers) {
                                const objRefer = {
                                    // "request_id": requestId,
                                    // "uid": uid,
                                    "provider_code": providerCode,
                                    "provider_name": providerName,
                                    "seq": rs_refer.seq,
                                    "date_serv": moment(rs_refer.date_serv).format('YYYY-MM-DD'),
                                    "time_serv": rs_refer.time_serv,
                                    "to_provider_code": rs_refer.depto_provider_codeartment,
                                    "to_provider_name": rs_refer.to_provider_name,
                                    "reason": rs_refer.refer_cause,
                                    "start_date": moment(rs_refer.date_serv).format('YYYY-MM-DD')
                                }
                                refer.push(objRefer);
                            }
                            objService.refer = refer;
                        }
                    }
                }

                if (objService) {
                    console.log(objService.diagnosis);
                    console.log(objService.procedure);
                    if (!objService.diagnosis && !objService.procedure) {
                        objService = [null];
                    }
                    reply.send({ ok: true, rows: objService, profile: profile });
                } else {
                    reply.send({ ok: false });
                }
            } catch (error) {
                console.log(error);
                reply.send({ ok: false, error: error.message });
            }
        } else {
            reply.send({ ok: false, error: 'Incorrect data!' });
        }


    });

    next();
}
module.exports = router;
