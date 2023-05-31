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
        return db(`labresult`)
        .select(`labresult.*`,`pt.hn`,db.raw(`CONCAT(pt.pname,pt.fname,' ',pt.lname) as fullname`) ,`lbbk.senddate`)
        .innerJoin(`lbbk`,function(){
            this.on('lbbk.ln','labresult.ln').andOn(db.raw('date(lbbk.senddate) = date(Now())'))
        })
        .innerJoin(`pt`,`pt.hn`,`lbbk.hn`)
        .where(db.raw(`(labresult.lab_code_local = 'fbs' and (labresult.labresult <= 70 or labresult.labresult >= 400) ) or
        (labresult.lab_code_local = 'bun' and (labresult.labresult > 100) ) or
        (labresult.lab_code_local = 'na' and (labresult.labresult < 120 or labresult.labresult >= 150) ) or
        (labresult.lab_code_local = 'k' and (labresult.labresult <= 3.0 or labresult.labresult >= 6.0) ) or
        (labresult.lab_code_local = 'co2' and (labresult.labresult <= 15 or labresult.labresult >= 38) ) or
        (labresult.lab_code_local = 'tbili' and labresult.labresult >= 20) or
        (labresult.lab_code_local = 'tprot' and (labresult.labresult >= 40) ) or
        (labresult.lab_code_local = 'vct' and (labresult.labresult >= 20) ) or
        (labresult.lab_code_local = 'wbc' and labresult.lab_name = 'CBC' and (labresult.labresult <= 2000 or labresult.labresult >= 30000) ) or
        (labresult.lab_code_local = 'hb' and labresult.lab_name = 'CBC' and (labresult.labresult < 6.0 or labresult.labresult > 21.0) ) or
        (labresult.lab_code_local = 'hct' and labresult.lab_name = 'CBC' and (labresult.labresult < 20 or labresult.labresult >= 55) ) or
        (labresult.lab_code_local = 'pltc' and labresult.lab_name = 'CBC' and (labresult.labresult < 50000 or labresult.labresult >= 500000) )
        `))
        .groupBy(`labresult.lab_code_local`,`labresult.ln`);

    }

    async labResultLn(db: Knex, ln: any[]) {
        return db(`labresult`)
        .select(`labresult.*`,`pt.hn`,db.raw(`CONCAT(pt.pname,pt.fname,' ',pt.lname) as fullname`) ,`lbbk.senddate`)
        .innerJoin(`lbbk`,function(){
            this.on('lbbk.ln','labresult.ln').andOn(db.raw('date(lbbk.senddate) = date(Now())'))
        })
        .innerJoin(`pt`,`pt.hn`,`lbbk.hn`)
        .where(db.raw(`(labresult.lab_code_local = 'fbs' and (labresult.labresult <= 70 or labresult.labresult >= 400) ) or
        (labresult.lab_code_local = 'bun' and (labresult.labresult > 100) ) or
        (labresult.lab_code_local = 'na' and (labresult.labresult < 120 or labresult.labresult >= 150) ) or
        (labresult.lab_code_local = 'k' and (labresult.labresult <= 3.0 or labresult.labresult >= 6.0) ) or
        (labresult.lab_code_local = 'co2' and (labresult.labresult <= 15 or labresult.labresult >= 38) ) or
        (labresult.lab_code_local = 'tbili' and labresult.labresult >= 20) or
        (labresult.lab_code_local = 'tprot' and (labresult.labresult >= 40) ) or
        (labresult.lab_code_local = 'vct' and (labresult.labresult >= 20) ) or
        (labresult.lab_code_local = 'wbc' and labresult.lab_name = 'CBC' and (labresult.labresult <= 2000 or labresult.labresult >= 30000) ) or
        (labresult.lab_code_local = 'hb' and labresult.lab_name = 'CBC' and (labresult.labresult < 6.0 or labresult.labresult > 21.0) ) or
        (labresult.lab_code_local = 'hct' and labresult.lab_name = 'CBC' and (labresult.labresult < 20 or labresult.labresult >= 55) ) or
        (labresult.lab_code_local = 'pltc' and labresult.lab_name = 'CBC' and (labresult.labresult < 50000 or labresult.labresult >= 500000) )
        
        `))
        .whereNotIn(`lbbk.ln`,ln)
        .groupBy(`labresult.lab_code_local`,`labresult.ln`);

    }
    
    async inSertLbbk(db: Knex, info: any) {
        return db('lbbk')
            .insert(info);
      }
}