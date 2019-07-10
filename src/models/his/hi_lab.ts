import * as knex from 'knex';

export class LabsModel {

    labInfo(db: knex) {
        return db('lab').select('labcode', 'labname')
    }
    selectLab(db: knex, labcode: any) {
        return db('lab').select('labcode', 'labname')
            .where('labcode', labcode)
    }

}