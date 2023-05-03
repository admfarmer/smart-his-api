import { Knex } from 'knex';

export class DiagModel {
    tableName: string = 'his_diag';

    info(db: Knex) {
        return db(this.tableName).select();
    }

    infoVn(db: Knex) {
        return db(this.tableName).select('vn');
    }

    select(db: Knex, vn: any) {
        return db(this.tableName).select().where('vn', vn);
    }

    save(db: Knex, datas: any, vn: any) {
        return db(this.tableName).insert(datas);
    }
    async saveInfo(db: Knex, datas: object) {
        return await db(this.tableName).insert(datas);
    }

}