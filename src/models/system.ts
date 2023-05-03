import { Knex } from 'knex';

export class SystemModel {

  getInfo(db: Knex) {
    return db('his_system').select();
  }
}