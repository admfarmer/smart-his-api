import { Knex } from 'knex';

export class ClnsModel {
    tableName: string = 'cln';

    clnInfo(db: Knex) {
        return db(this.tableName)
            .select('cln', 'namecln');
    }
    selectCln(db: Knex, cln: any) {
        return db(this.tableName)
            .select('cln', 'namecln')
            .where('cln', cln)
    }
}