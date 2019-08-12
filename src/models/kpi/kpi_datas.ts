import * as knex from 'knex';

export class KpiDatasModel {
  tableName: string = 'kpi_datas';

  getInfo(db: knex) {
    return db(this.tableName).select()
      .where('status', '0');
  }

  getKpiDataYears(db: knex, years_id: any) {
    return db(this.tableName).select()
      .where('status', '1')
      .andWhere('years_id', years_id)
  }

  save(db: knex, info: any) {
    return db(this.tableName).insert(info);
  }

  update(db: knex, id: any, info: any) {
    return db(this.tableName)
      .where('id', id)
      .update(info);
  }

  remove(db: knex, id: any) {
    return db(this.tableName)
      .where('id', id)
      .del();
  }

}
