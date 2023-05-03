import { Knex } from 'knex';

export class KpiStgModel {
  tableName: string = 'kpi_stg';

  getISelect(db: Knex) {
    return db(this.tableName).select()
  }

  getInfo(db: Knex) {
    return db(this.tableName).select()
      .where('stg_status', '1')
  }

  getKpiStgOwn(db: Knex, stg_own: any) {
    return db(this.tableName).select()
      .where('stg_status', '1')
      .andWhere('stg_own', stg_own)
  }

  getKpiStg(db: Knex, stg_grp_id: any) {
    return db(this.tableName).select()
      .where('stg_status', '1')
      .andWhere('stg_grp_id', stg_grp_id);
  }

  save(db: Knex, info: any) {
    return db(this.tableName).insert(info);
  }

  update(db: Knex, stg_id: any, info: any) {
    return db(this.tableName)
      .where('stg_id', stg_id)
      .update(info);
  }

  remove(db: Knex, stg_id: any) {
    return db(this.tableName)
      .where('stg_id', stg_id)
      .del();
  }

}
