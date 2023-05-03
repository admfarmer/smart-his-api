import { Knex } from 'knex';

export class KpiDatasModel {
  tableName: string = 'kpi_datas';

  getSelect(db: Knex) {
    return db(this.tableName).select()
  }

  getInfo(db: Knex) {
    return db(this.tableName).select()
      .where('status', 'Y');
  }

  getKpiDataYears(db: Knex, years_id: any, kpi_id: any) {
    return db(this.tableName).select()
      .where('status', 'Y')
      .andWhere('years_id', years_id)
      .andWhere('kpi_id', kpi_id)
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
