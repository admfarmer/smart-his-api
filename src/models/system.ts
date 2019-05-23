import * as knex from 'knex';

export class SystemModel {

  getInfo(db: knex) {
    return db('his_system').select();
  }
}