import * as knex from 'knex';

export class KpiStgModel {
  tableName: string = 'kpi_stg';

  getISelect(db: knex) {
    return db(this.tableName).select()
  }

  getInfo(db: knex) {
    return db(this.tableName).select()
      .where('stg_status', '1')
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

  save(db: knex, info: any) {
    return db(this.tableName).insert(info);
  }

  update(db: knex, stg_id: any, info: any) {
    return db(this.tableName)
      .where('stg_id', stg_id)
      .update(info);
  }

  remove(db: knex, stg_id: any) {
    return db(this.tableName)
      .where('stg_id', stg_id)
      .del();
  }

}
