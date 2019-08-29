import * as knex from 'knex';

export class HiOvstModel {
    tableName: string = 'ovst';

    testConnection(db: knex) {
        return db.raw(`select 'HI Work'`);
    }

    getOvstInfo(db: knex, hn: any, vstdttm: any) {
        return db(this.tableName)
            .select('hn', 'vn', 'pttype', 'vstdttm', 'cln', db.raw('time(vstdttm) as vsttime'))
            .where('hn', hn).andWhere('vstdttm', vstdttm)
            .limit(1);
    }

    getOvstViews(db: knex, hn: any, vstdttm: any) {
        let sql = `
        SELECT o.hn,o.vn,o.pttype,o.cln,date(o.vstdttm) as vstdttm ,time(o.vstdttm) as vsttime,
        CONCAT(p.pname,p.fname,' ',p.lname) as fullname
        from ovst as o
        INNER JOIN pt as p on p.hn = o.hn 
        WHERE date(o.vstdttm) = ${vstdttm} 
        and o.hn = ${hn} and o.rcptno = '0'`;
        return db.raw(sql);

    }

    getOvstdx(db: knex, vn: any[]) {
        let sql = `
        SELECT dx.vn, o.hn, o.pttype, 
        date_format(o.vstdttm,'%Y-%m-%d') as vstdttm, 
        date_format(time(o.drxtime*100),'%H:%i:%s') as drxtime, 
        dx.icd10 as diag, dx.icd10name as diagname, 
		s.symptom as symptom,
        CONCAT(p.pname,p.fname,' ',p.lname) as fullname, 
        if(p.male=1,'ชาย','หญิง') as sex,
        ROUND((date(o.vstdttm)-p.brthdate)/10000) as age,
        u.nameovstos as dchtype,
        CONCAT('บ้านเลขที่ ',p.addrpart,' ','หมู่ที่ ',p.moopart,' ','ตำบล',t.nametumb,' ','อำเภอ',a.nameampur) as address        
        FROM ovstdx as dx 
        INNER JOIN ovst as o on o.vn = dx.vn 
        INNER JOIN pt as p on p.hn = o.hn 
        left join hi.changwat as c on p.chwpart=c.chwpart
        left join hi.ovstost as u on o.ovstost=u.ovstost
        left join hi.symptm as s on o.vn=s.vn
        left join hi.ampur as a on p.chwpart=a.chwpart and p.amppart=a.amppart
        left join hi.tumbon as t on p.chwpart=t.chwpart and p.amppart=t.amppart and p.tmbpart=t.tmbpart
        WHERE dx.icd10 in ('A90','A91','B084','B085') AND year(o.vstdttm) = year(NOW()) AND o.vn not in (${vn})
        `;
        return db.raw(sql);

    }

    getOvstdxs(db: knex) {
        let sql = `
        SELECT dx.vn, o.hn, o.pttype, 
        date_format(o.vstdttm,'%Y-%m-%d') as vstdttm, 
        date_format(time(o.drxtime*100),'%H:%i:%s') as drxtime, 
        dx.icd10 as diag, dx.icd10name as diagname, 
		s.symptom as symptom,
        CONCAT(p.pname,p.fname,' ',p.lname) as fullname, 
        if(p.male=1,'ชาย','หญิง') as sex,
        ROUND((date(o.vstdttm)-p.brthdate)/10000) as age,
        u.nameovstos as dchtype,
        CONCAT('บ้านเลขที่ ',p.addrpart,' ','หมู่ที่ ',p.moopart,' ','ตำบล',t.nametumb,' ','อำเภอ',a.nameampur) as address        
        FROM ovstdx as dx 
        INNER JOIN ovst as o on o.vn = dx.vn 
        INNER JOIN pt as p on p.hn = o.hn 
        left join hi.changwat as c on p.chwpart=c.chwpart
        left join hi.ovstost as u on o.ovstost=u.ovstost
        left join hi.symptm as s on o.vn=s.vn
        left join hi.ampur as a on p.chwpart=a.chwpart and p.amppart=a.amppart
        left join hi.tumbon as t on p.chwpart=t.chwpart and p.amppart=t.amppart and p.tmbpart=t.tmbpart
        WHERE dx.icd10 in ('A90','A91','B084','B085') AND year(o.vstdttm) = year(NOW())
        `;
        return db.raw(sql);

    }

    saveOvst(db: knex, datas: any) {
        return db(this.tableName)
            .insert(datas);
    }

    saveOvstOn(db: knex, datas, table) {
        return db(table)
            .insert(datas);
    }

    updateOvst(db: knex, vn: any, info: any) {
        let sql = `update ${this.tableName} set rcptno = ${info.rcptno} where vn = ${vn}`;
        return db.raw(sql);
    }

}