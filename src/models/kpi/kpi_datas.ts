import * as knex from 'knex';

export class KpiDatasModel {
  tableName: string = 'kpi_datas';

  getInfo(db: knex) {
    return db(this.tableName).select()
      .where('status', 'Y');
  }

  getKpiDataYears(db: knex, years_id: any, kpi_id: any) {
    return db(this.tableName).select()
      .where('status', 'Y')
      .andWhere('years_id', years_id)
      .andWhere('kpi_id', kpi_id)
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
