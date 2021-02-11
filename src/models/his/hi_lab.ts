import * as knex from 'knex';

export class LabsModel {
    tableName: string = 'lab';

    labInfo(db: knex) {
        return db(this.tableName)
            .select('labcode', 'labname')
    }
    selectLab(db: knex, labcode: any) {
        console.log(labcode);
        
        return db(this.tableName)
            .select('labcode', 'labname')
            .where('labcode', labcode)
    }

    async labresult(db: knex){
        let data = await db.raw(`
        SELECT r.*,p.hn,CONCAT(p.pname,p.fname,' ',p.lname) as fullname ,l.senddate FROM labresult r 
        INNER JOIN lbbk l on l.ln = r.ln
        INNER JOIN pt p on p.hn = l.hn
        where  (
        (r.lab_code_local = 'fbs' and (r.labresult <= 70 or r.labresult >= 400) ) or
        (r.lab_code_local = 'na' and (r.labresult < 120 or r.labresult >= 150) ) or
        (r.lab_code_local = 'k' and (r.labresult <= 3.0 or r.labresult >= 6.0) ) or
        (r.lab_code_local = 'co2' and (r.labresult <= 10 or r.labresult >= 38) ) or
        (r.lab_code_local = 'tbili' and r.labresult >= 20) or
        (r.lab_code_local = 'tprot' and (r.labresult >= 40) ) or
        (r.lab_code_local = 'vct' and (r.labresult >= 20) ) or
        (r.lab_code_local = 'wbc' and r.lab_name = 'CBC' and (r.labresult <= 1500 or r.labresult >= 30000) ) or
        (r.lab_code_local = 'hb' and r.lab_name = 'CBC' and (r.labresult < 6.0 or r.labresult > 21.0) ) or
        (r.lab_code_local = 'hct' and r.lab_name = 'CBC' and (r.labresult < 20 or r.labresult >= 55) ) or
        (r.lab_code_local = 'pltc' and r.lab_name = 'CBC' and (r.labresult < 50000 or r.labresult >= 500000) )
        )
        and l.senddate BETWEEN '2021-01-01' and DATE(NOW())
        GROUP BY r.lab_code_local,r.ln
        `);
      return data[0];
    }

    async labResultLn(db: knex, ln: any[]) {
        let data = await db.raw(`
        SELECT r.*,p.hn,CONCAT(p.pname,p.fname,' ',p.lname) as fullname ,l.senddate FROM labresult r 
        INNER JOIN lbbk l on l.ln = r.ln
        INNER JOIN pt p on p.hn = l.hn
        where  (
            (r.lab_code_local = 'fbs' and (r.labresult <= 70 or r.labresult >= 400) ) or
            (r.lab_code_local = 'na' and (r.labresult < 120 or r.labresult >= 150) ) or
            (r.lab_code_local = 'k' and (r.labresult <= 3.0 or r.labresult >= 6.0) ) or
            (r.lab_code_local = 'co2' and (r.labresult <= 10 or r.labresult >= 38) ) or
            (r.lab_code_local = 'tbili' and r.labresult >= 20) or
            (r.lab_code_local = 'tprot' and (r.labresult >= 40) ) or
            (r.lab_code_local = 'vct' and (r.labresult >= 20) ) or
            (r.lab_code_local = 'wbc' and r.lab_name = 'CBC' and (r.labresult <= 1500 or r.labresult >= 30000) ) or
            (r.lab_code_local = 'hb' and r.lab_name = 'CBC' and (r.labresult < 6.0 or r.labresult > 21.0) ) or
            (r.lab_code_local = 'hct' and r.lab_name = 'CBC' and (r.labresult < 20 or r.labresult >= 55) ) or
            (r.lab_code_local = 'pltc' and r.lab_name = 'CBC' and (r.labresult < 50000 or r.labresult >= 500000) )
            )
        and l.senddate BETWEEN '2021-01-01' and DATE(NOW())
        AND l.ln not in (${ln})
        GROUP BY r.lab_code_local,r.ln 
        `);
        return data[0];

    }
    
    async inSertLbbk(db: knex, info: any) {
        return db('lbbk')
            .insert(info);
      }
}