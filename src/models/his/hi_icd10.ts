import * as knex from 'knex';

export class Icd10Model {
    tableName: string = 'icd101';

    icd10Info(db: knex) {
        return db(this.tableName)
            .select('icd10', 'icd10name');
    }
    selectIcd10(db: knex, icd10: any) {
        return db(this.tableName)
            .select('icd10', 'icd10name')
            .where('icd10', icd10)
    }
}