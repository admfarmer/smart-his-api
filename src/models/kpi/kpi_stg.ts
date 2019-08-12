import * as knex from 'knex';

export class KpiStgModel {
  tableName: string = 'kpi_stg';

  getInfo(db: knex) {
    return db(this.tableName).select().where('stg_status', 'Y');
  }

  getKpiStgOwn(db: knex, stg_own: any) {
    return db(this.tableName).select()
      .where('stg_status', '1')
      .andWhere('stg_own', stg_own)
  }

  getKpiStg(db: knex, stg_grp_id: any) {
    return db(this.tableName).select()
      .where('stg_status', '1')
      .andWhere('stg_grp_id', stg_grp_id);
  }
}
