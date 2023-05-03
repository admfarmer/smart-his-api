import { Knex } from 'knex';

export class LabsModel {
    tableName: string = 'lab';

    labInfo(db: Knex) {
        return db(this.tableName)
            .select('labcode', 'labname')
    }
    selectLab(db: Knex, labcode: any) {
        console.log(labcode);
        
        return db(this.tableName)
            .select('labcode', 'labname')
            .where('labcode', labcode)
    }

    labresult(db: Knex){
        return db(`labresult r`)
        .select(`r.*`,`p.hn`,db.raw(`CONCAT(p.pname,p.fname,' ',p.lname) as fullname`) ,`l.senddate`)
        .innerJoin(`lbbk l`,`l.ln`,`r.ln`)
        .innerJoin(`pt p`,`p.hn`,`l.hn`)
        .whereRaw(`(r.lab_code_local = 'fbs' and (r.labresult <= 70 or r.labresult >= 400) ) or
        (r.lab_code_local = 'bun' and (r.labresult > 100) ) or
        (r.lab_code_local = 'na' and (r.labresult < 120 or r.labresult >= 150) ) or
        (r.lab_code_local = 'k' and (r.labresult <= 3.0 or r.labresult >= 6.0) ) or
        (r.lab_code_local = 'co2' and (r.labresult <= 15 or r.labresult >= 38) ) or
        (r.lab_code_local = 'tbili' and r.labresult >= 20) or
        (r.lab_code_local = 'tprot' and (r.labresult >= 40) ) or
        (r.lab_code_local = 'vct' and (r.labresult >= 20) ) or
        (r.lab_code_local = 'wbc' and r.lab_name = 'CBC' and (r.labresult <= 2000 or r.labresult >= 30000) ) or
        (r.lab_code_local = 'hb' and r.lab_name = 'CBC' and (r.labresult < 6.0 or r.labresult > 21.0) ) or
        (r.lab_code_local = 'hct' and r.lab_name = 'CBC' and (r.labresult < 20 or r.labresult >= 55) ) or
        (r.lab_code_local = 'pltc' and r.lab_name = 'CBC' and (r.labresult < 50000 or r.labresult >= 500000) )`)
        .whereRaw(`l.senddate BETWEEN '2021-01-01' and DATE(NOW())`)
        .groupBy(`r.lab_code_local,r.ln`);

    }

    async labResultLn(db: Knex, ln: any[]) {
        return db(`labresult r`)
        .select(`r.*`,`p.hn`,db.raw(`CONCAT(p.pname,p.fname,' ',p.lname) as fullname`) ,`l.senddate`)
        .innerJoin(`lbbk l`,`l.ln`,`r.ln`)
        .innerJoin(`pt p`,`p.hn`,`l.hn`)
        .whereRaw(`(r.lab_code_local = 'fbs' and (r.labresult <= 70 or r.labresult >= 400) ) or
        (r.lab_code_local = 'bun' and (r.labresult > 100) ) or
        (r.lab_code_local = 'na' and (r.labresult < 120 or r.labresult >= 150) ) or
        (r.lab_code_local = 'k' and (r.labresult <= 3.0 or r.labresult >= 6.0) ) or
        (r.lab_code_local = 'co2' and (r.labresult <= 15 or r.labresult >= 38) ) or
        (r.lab_code_local = 'tbili' and r.labresult >= 20) or
        (r.lab_code_local = 'tprot' and (r.labresult >= 40) ) or
        (r.lab_code_local = 'vct' and (r.labresult >= 20) ) or
        (r.lab_code_local = 'wbc' and r.lab_name = 'CBC' and (r.labresult <= 2000 or r.labresult >= 30000) ) or
        (r.lab_code_local = 'hb' and r.lab_name = 'CBC' and (r.labresult < 6.0 or r.labresult > 21.0) ) or
        (r.lab_code_local = 'hct' and r.lab_name = 'CBC' and (r.labresult < 20 or r.labresult >= 55) ) or
        (r.lab_code_local = 'pltc' and r.lab_name = 'CBC' and (r.labresult < 50000 or r.labresult >= 500000) )`)
        .whereNotIn(`l.ln`,ln)
        .groupBy(`r.lab_code_local,r.ln`);

    }
    
    async inSertLbbk(db: Knex, info: any) {
        return db('lbbk')
            .insert(info);
      }
}