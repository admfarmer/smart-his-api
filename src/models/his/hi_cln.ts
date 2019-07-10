import * as knex from 'knex';

export class ClnsModel {

    clnInfo(db: knex) {
        return db('cln').select('cln', 'namecln');
    }
    selectCln(db: knex, cln: any) {
        return db('cln').select('cln', 'namecln')
            .where('cln', cln)
    }
}