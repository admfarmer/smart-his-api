import { Knex } from 'knex';

export class KpiYearsModel {
  tableName: string = 'kpi_years';

  getSelect(db: Knex) {
    return db(this.tableName).select()
  }

  getInfo(db: Knex) {
    return db(this.tableName).select()
      .where('status', 'Y');
  }

  getKpiYearsOne(db: Knex, quarter: any, year: any) {
    return db(this.tableName).select()
      .where('status', 'Y')
      .andWhere('quarter', quarter)
      .andWhere('year', year);
  }

  getKpiYears(db: Knex, year: any) {
    return db(this.tableName).select()
      .where('status', 'Y')
      .andWhere('year', year);
  }

  save(db: Knex, info: any) {
    return db(this.tableName).insert(info);
  }

  update(db: Knex, id: any, info: any) {
    return db(this.tableName)
      .where('id', id)
      .update(info);
  }

  remove(db: Knex, id: any) {
    return db(this.tableName)
      .where('id', id)
      .del();
  }
}