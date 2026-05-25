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
            SELECT 
                r.*,
                p.hn,
                CONCAT(p.pname, p.fname, ' ', p.lname) AS fullname,
                l.senddate 
            FROM labresult r  
            INNER JOIN lbbk l ON l.ln = r.ln
            INNER JOIN pt p ON p.hn = l.hn
            WHERE l.senddate = CURRENT_DATE()
            AND (
                -- แปลงค่า labresult โดยลบคอมมาออก แล้วเปลี่ยนเป็นตัวเลขทศนิยมเพื่อใช้เทียบค่า
                (r.lab_code_local = 'fbs'   AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) <= 70 OR CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 400)) OR
                (r.lab_code_local = 'bun'   AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) > 100)) OR
                (r.lab_code_local = 'na'    AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) < 120 OR CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 150)) OR
                (r.lab_code_local = 'k'     AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) <= 3.0 OR CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 6.0)) OR
                (r.lab_code_local = 'co2'   AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) <= 15 OR CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 38)) OR
                (r.lab_code_local = 'tbili' AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 20)) OR
                (r.lab_code_local = 'tprot' AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 40)) OR
                (r.lab_code_local = 'vct'   AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 20)) OR
                
                -- รวมกลุ่มผลแล็บกลุ่ม CBC
                (r.lab_name = 'CBC' AND (
                    (r.lab_code_local = 'wbc'  AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) <= 2000 OR CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 30000)) OR
                    (r.lab_code_local = 'hb'   AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) < 6.0 OR CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) > 21.0)) OR
                    (r.lab_code_local = 'hct'  AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) < 20 OR CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 55)) OR
                    (r.lab_code_local = 'pltc' AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) < 50000 OR CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 500000))
                ))
            )
            ORDER BY l.senddate DESC, p.hn ASC;
        `);
      return data[0];
    }

    async labResultLn(db: Knex, ln: any[]) {
        let data = await db.raw(`
            SELECT 
                r.*,
                p.hn,
                CONCAT(p.pname, p.fname, ' ', p.lname) AS fullname,
                l.senddate 
            FROM labresult r 
            INNER JOIN lbbk l ON l.ln = r.ln
            INNER JOIN pt p ON p.hn = l.hn
            WHERE l.senddate = CURRENT_DATE()
            AND l.ln NOT IN (${ln})  -- เงื่อนไขยกเว้นเลขใบแล็บเดิมที่คุณเพิ่มเข้ามา
            AND (
                (r.lab_code_local = 'fbs'   AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) <= 70 OR CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 400)) OR
                (r.lab_code_local = 'bun'   AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) > 100)) OR
                (r.lab_code_local = 'na'    AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) < 120 OR CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 150)) OR
                (r.lab_code_local = 'k'     AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) <= 3.0 OR CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 6.0)) OR
                (r.lab_code_local = 'co2'   AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) <= 15 OR CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 38)) OR
                (r.lab_code_local = 'tbili' AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 20)) OR
                (r.lab_code_local = 'tprot' AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 40)) OR
                (r.lab_code_local = 'vct'   AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 20)) OR
                
                -- รวมกลุ่มผลแล็บกลุ่ม CBC
                (r.lab_name = 'CBC' AND (
                    (r.lab_code_local = 'wbc'  AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) <= 2000 OR CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 30000)) OR
                    (r.lab_code_local = 'hb'   AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) < 6.0 OR CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) > 21.0)) OR
                    (r.lab_code_local = 'hct'  AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) < 20 OR CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 55)) OR
                    (r.lab_code_local = 'pltc' AND (CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) < 50000 OR CAST(REPLACE(r.labresult, ',', '') AS DECIMAL(10,2)) >= 500000))
                ))
            )
            ORDER BY l.senddate DESC, p.hn ASC;
        `);
        return data[0];

    }
    async inSertLbbk(db: Knex, info: any) {
        return db('lbbk')
            .insert(info);
      }
}