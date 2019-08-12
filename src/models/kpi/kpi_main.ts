import * as knex from 'knex';

export class KpiMainModel {
  tableName: string = 'kpi_main';

  getInfo(db: knex) {
    return db(this.tableName).select()
      .where('kpi_status', '1');
  }
  getKpistg(db: knex, kpistg: any) {
    return db(this.tableName).select()
      .where('kpi_status', '1')
      .andWhere('kpi_stg_id', kpistg);
  }
}