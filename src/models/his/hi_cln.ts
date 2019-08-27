import * as knex from 'knex';

export class ClnsModel {
    tableName: string = 'cln';

    clnInfo(db: knex) {
        return db(this.tableName)
            .select('cln', 'namecln');
    }
    selectCln(db: knex, cln: any) {
        return db(this.tableName)
            .select('cln', 'namecln')
            .where('cln', cln)
    }
}