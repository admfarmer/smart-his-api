import * as knex from 'knex';

export class KpiMainModel {
  tableName: string = 'kpi_main';

  getSelect(db: knex) {
    return db(this.tableName).select()
  }

  getInfo(db: knex) {
    return db(this.tableName).select()
      .where('kpi_status', '1');
  }

  getKpistg(db: knex, kpistg: any) {
    return db(this.tableName).select()
      .where('kpi_status', '1')
      .andWhere('kpi_stg_id', kpistg);
  }

  save(db: knex, info: any) {
    return db(this.tableName).insert(info);
  }

  update(db: knex, kpi_id: any, info: any) {
    return db(this.tableName)
      .where('kpi_id', kpi_id)
      .update(info);
  }

  remove(db: knex, kpi_id: any) {
    return db(this.tableName)
      .where('kpi_id', kpi_id)
      .del();
  }

  async getKpiDetail(db: knex, kpi_id: any) {
    let data = await db.raw(`
      SELECT d.*,y.quarter,y.year,m.kpi_name,m.kpi_scale FROM kpi_datas AS d
      INNER JOIN kpi_main AS m ON m.kpi_id = d.kpi_id
      INNER JOIN kpi_years AS y ON y.id = d.years_id
      WHERE m.kpi_id = '${kpi_id}' AND d.status = 'Y'`);
    return data[0];
  }

}