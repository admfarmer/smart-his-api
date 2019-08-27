import * as knex from 'knex';

export class HiPTModel {
    tableName: string = 'pt';

    getPtCidInfo(db: knex, cid: any) {
        return db(this.tableName)
            .select('hn as hn', 'pop_id as cid', 'pttype', 'pname as title', 'fname as firstname', 'lname as lastname', 'male as sex', db.raw('date(brthdate) as birthdate'))
            .where('pop_id', cid).limit(1);
    }

    getPtHnInfo(db: knex, hn: any) {
        return db(this.tableName)
            .select('hn as hn', 'pop_id as cid', 'pttype', 'pname as title', 'fname as firstname', 'lname as lastname', 'male as sex', db.raw('date(brthdate) as birthdate'))
            .where('hn', hn).limit(1);
    }
    getPttypeInfo(db: knex, cid: any, pttype: any) {
        return db('insure as i')
            .select('p.pttype', 'p.namepttype', db.raw('date(i.datein) as datein'), db.raw('date(i.dateexp) as dateexp'), 'i.card_id')
            .innerJoin('pttype as p', 'p.pttype', 'i.pttype')
            .where('i.pop_id', cid).andWhere('p.pttype', pttype)
            .limit(1);
    }
}