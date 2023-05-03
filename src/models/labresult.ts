import { Knex } from 'knex';

export class LabresultModel {
    tableName: string = 'labresult';

    info(db: Knex) {
        return db(this.tableName).select();
    }

    infoLn(db: Knex) {
        return db(this.tableName).select('ln').where('ln','<>','0');
    }

    select(db: Knex, ln: any) {
        return db(this.tableName).select().where('ln', ln);
    }

    save(db: Knex, datas: any, ln: any) {
        return db(this.tableName).insert(datas);
    }
    async saveInfo(db: Knex, datas: object) {
        return await db(this.tableName).insert(datas);
    }

}