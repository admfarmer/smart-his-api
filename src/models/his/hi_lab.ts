import * as knex from 'knex';

export class LabsModel {

    getInfo(db: knex) {
        return db('lab').select('labcode', 'labname');
    }
}