import * as knex from 'knex';

export class LabresultModel {
    tableName: string = 'labresult';

    info(db: knex) {
        return db(this.tableName).select();
    }

    infoLn(db: knex) {
        return db(this.tableName).select('ln').where('ln','<>','0');
    }

    select(db: knex, ln: any) {
        return db(this.tableName).select().where('ln', ln);
    }

    save(db: knex, datas: any, ln: any) {
        return db(this.tableName).insert(datas);
    }
    async saveInfo(db: knex, datas: object) {
        return await db(this.tableName).insert(datas);
    }

}