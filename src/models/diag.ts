import * as knex from 'knex';

export class DiagModel {
    tableName: string = 'his_diag';

    info(db: knex) {
        return db(this.tableName).select();
    }

    infoVn(db: knex) {
        return db(this.tableName).select('vn');
    }

    select(db: knex, vn: any) {
        return db(this.tableName).select().where('vn', vn);
    }

    save(db: knex, datas: any, vn: any) {
        return db(this.tableName).insert(datas);
    }

}