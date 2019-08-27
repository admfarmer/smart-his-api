import * as knex from 'knex';

export class LabsModel {
    tableName: string = 'lab';

    labInfo(db: knex) {
        return db(this.tableName)
            .select('labcode', 'labname')
    }
    selectLab(db: knex, labcode: any) {
        return db(this.tableName)
            .select('labcode', 'labname')
            .where('labcode', labcode)
    }

}