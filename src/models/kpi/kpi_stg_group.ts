import * as knex from 'knex';

export class KpiStgGroupModel {
  tableName: string = 'kpi_stg_group';

  getInfo(db: knex) {
    return db(this.tableName).select()
      .where('stg_group_status', 'Y');
  }

  getKpiStgGroupOwn(db: knex, stg_group_own: any) {
    return db(this.tableName).select()
      .where('stg_group_status', '1')
      .andWhere('stg_group_own', stg_group_own)
  }
}
