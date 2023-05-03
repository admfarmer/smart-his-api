import { Knex } from 'knex';

export class Icd10Model {
    tableName: string = 'icd101';

    icd10Info(db: Knex) {
        return db(this.tableName)
            .select('icd10', 'icd10name');
    }
    selectIcd10(db: Knex, icd10: any) {
        return db(this.tableName)
            .select('icd10', 'icd10name')
            .where('icd10', icd10)
    }
}