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