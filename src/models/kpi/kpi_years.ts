import * as knex from 'knex';

export class KpiYearsModel {
  tableName: string = 'kpi_years';

  getInfo(db: knex) {
    return db(this.tableName).select()
      .where('status', 'Y');
  }

  getKpiYearsOne(db: knex, quarter: any, year: any) {
    return db(this.tableName).select()
      .where('kpi_status', '1')
      .andWhere('quarter', quarter)
      .andWhere('year', year);
  }

  getKpiYears(db: knex, year: any) {
    return db(this.tableName).select()
      .where('kpi_status', '1')
      .andWhere('year', year);
  }
}