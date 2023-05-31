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

    // labresult(db: Knex){
    //     return db(`labresult`)
    //     .select(`labresult.*`,`pt.hn`,db.raw(`CONCAT(pt.pname,pt.fname,' ',pt.lname) as fullname`) ,`lbbk.senddate`)
    //     .innerJoin(`lbbk`,function(){
    //         this.on('lbbk.ln','labresult.ln').andOn(db.raw('date(lbbk.senddate) = date(Now())'))
    //     })
    //     .innerJoin(`pt`,`pt.hn`,`lbbk.hn`)
    //     .where(db.raw(`(labresult.lab_code_local = 'fbs' and (labresult.labresult <= 70 or labresult.labresult >= 400) ) or
    //     (labresult.lab_code_local = 'bun' and (labresult.labresult > 100) ) or
    //     (labresult.lab_code_local = 'na' and (labresult.labresult < 120 or labresult.labresult >= 150) ) or
    //     (labresult.lab_code_local = 'k' and (labresult.labresult <= 3.0 or labresult.labresult >= 6.0) ) or
    //     (labresult.lab_code_local = 'co2' and (labresult.labresult <= 15 or labresult.labresult >= 38) ) or
    //     (labresult.lab_code_local = 'tbili' and labresult.labresult >= 20) or
    //     (labresult.lab_code_local = 'tprot' and (labresult.labresult >= 40) ) or
    //     (labresult.lab_code_local = 'vct' and (labresult.labresult >= 20) ) or
    //     (labresult.lab_code_local = 'wbc' and labresult.lab_name = 'CBC' and (labresult.labresult <= 2000 or labresult.labresult >= 30000) ) or
    //     (labresult.lab_code_local = 'hb' and labresult.lab_name = 'CBC' and (labresult.labresult < 6.0 or labresult.labresult > 21.0) ) or
    //     (labresult.lab_code_local = 'hct' and labresult.lab_name = 'CBC' and (labresult.labresult < 20 or labresult.labresult >= 55) ) or
    //     (labresult.lab_code_local = 'pltc' and labresult.lab_name = 'CBC' and (labresult.labresult < 50000 or labresult.labresult >= 500000) )
    //     `))
    //     .groupBy(`labresult.lab_code_local`,`labresult.ln`);

    // }

    // async labResultLn(db: Knex, ln: any[]) {
    //     return db(`labresult`)
    //     .select(`labresult.*`,`pt.hn`,db.raw(`CONCAT(pt.pname,pt.fname,' ',pt.lname) as fullname`) ,`lbbk.senddate`)
    //     .innerJoin(`lbbk`,function(){
    //         this.on('lbbk.ln','labresult.ln').andOn(db.raw('date(lbbk.senddate) = date(Now())'))
    //     })
    //     .innerJoin(`pt`,`pt.hn`,`lbbk.hn`)
    //     .where(db.raw(`(labresult.lab_code_local = 'fbs' and (labresult.labresult <= 70 or labresult.labresult >= 400) ) or
    //     (labresult.lab_code_local = 'bun' and (labresult.labresult > 100) ) or
    //     (labresult.lab_code_local = 'na' and (labresult.labresult < 120 or labresult.labresult >= 150) ) or
    //     (labresult.lab_code_local = 'k' and (labresult.labresult <= 3.0 or labresult.labresult >= 6.0) ) or
    //     (labresult.lab_code_local = 'co2' and (labresult.labresult <= 15 or labresult.labresult >= 38) ) or
    //     (labresult.lab_code_local = 'tbili' and labresult.labresult >= 20) or
    //     (labresult.lab_code_local = 'tprot' and (labresult.labresult >= 40) ) or
    //     (labresult.lab_code_local = 'vct' and (labresult.labresult >= 20) ) or
    //     (labresult.lab_code_local = 'wbc' and labresult.lab_name = 'CBC' and (labresult.labresult <= 2000 or labresult.labresult >= 30000) ) or
    //     (labresult.lab_code_local = 'hb' and labresult.lab_name = 'CBC' and (labresult.labresult < 6.0 or labresult.labresult > 21.0) ) or
    //     (labresult.lab_code_local = 'hct' and labresult.lab_name = 'CBC' and (labresult.labresult < 20 or labresult.labresult >= 55) ) or
    //     (labresult.lab_code_local = 'pltc' and labresult.lab_name = 'CBC' and (labresult.labresult < 50000 or labresult.labresult >= 500000) )
        
    //     `))
    //     .whereNotIn(`lbbk.ln`,ln)
    //     .groupBy(`labresult.lab_code_local`,`labresult.ln`);

    // }
    

    async labresult(db: Knex){
        let data = await db.raw(`
        SELECT r.*,p.hn,CONCAT(p.pname,p.fname,' ',p.lname) as fullname ,l.senddate FROM labresult r 
        INNER JOIN lbbk l on l.ln = r.ln
        INNER JOIN pt p on p.hn = l.hn
        where  (
            (r.lab_code_local = 'fbs' and (r.labresult <= 70 or r.labresult >= 400) ) or
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
            (r.lab_code_local = 'pltc' and r.lab_name = 'CBC' and (r.labresult < 50000 or r.labresult >= 500000) )

        )
        and l.senddate = CURRENT_DATE
        GROUP BY r.lab_code_local,r.ln
        `);
      return data[0];
    }

    async labResultLn(db: Knex, ln: any[]) {
        let data = await db.raw(`
        SELECT r.*,p.hn,CONCAT(p.pname,p.fname,' ',p.lname) as fullname ,l.senddate FROM labresult r 
        INNER JOIN lbbk l on l.ln = r.ln
        INNER JOIN pt p on p.hn = l.hn
        where  (
            (r.lab_code_local = 'fbs' and (r.labresult <= 70 or r.labresult >= 400) ) or
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
            (r.lab_code_local = 'pltc' and r.lab_name = 'CBC' and (r.labresult < 50000 or r.labresult >= 500000) )

            )
        and l.senddate = CURRENT_DATE
        AND l.ln not in (${ln})
        GROUP BY r.lab_code_local,r.ln 
        `);
        return data[0];

    }
    async inSertLbbk(db: Knex, info: any) {
        return db('lbbk')
            .insert(info);
      }
}