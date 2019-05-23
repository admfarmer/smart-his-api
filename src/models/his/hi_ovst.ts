import * as knex from 'knex';

export class HiOvstModel {

    testConnection(db: knex) {
        return db.raw(`select 'HI Work'`);
    }
    getOvstInfo(db: knex, hn: any, vstdttm: any) {
        return db('ovst')
            .select('hn', 'vn', 'pttype', 'vstdttm', 'cln', 'pttype', db.raw('time(vstdttm) as vsttime'))
            .where('hn', hn).andWhere('vstdttm', vstdttm)
            .limit(1);
    }

    saveOvst(db: knex, datas: any) {
        return db('ovst').insert(datas);
    }

    saveOvstOn(db: knex, datas, table) {
        return db(table).insert(datas);
    }

}