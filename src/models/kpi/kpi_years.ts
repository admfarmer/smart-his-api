import * as knex from 'knex';

export class KpiYearsModel {
  tableName: string = 'kpi_years';

  getInfo(db: knex) {
    return db(this.tableName).select()
      .where('status', 'Y');
  }

  getKpiYearsOne(db: knex, quarter: any, year: any) {
    return db(this.tableName).select()
      .where('status', 'Y')
      .andWhere('quarter', quarter)
      .andWhere('year', year);
  }

  getKpiYears(db: knex, year: any) {
    return db(this.tableName).select()
      .where('status', 'Y')
      .andWhere('year', year);
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