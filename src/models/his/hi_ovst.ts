import * as knex from 'knex';

export class HiOvstModel {

    testConnection(db: knex) {
        return db.raw(`select 'HI Work'`);
    }

    getOvstInfo(db: knex, hn: any, vstdttm: any) {
        return db('ovst')
            .select('hn', 'vn', 'pttype', 'vstdttm', 'cln', db.raw('time(vstdttm) as vsttime'))
            .where('hn', hn).andWhere('vstdttm', vstdttm)
            .limit(1);
    }

    getOvstdx(db: knex, vn: any[]) {
        let sql = `
        SELECT dx.vn, o.hn, o.pttype, 
        date_format(o.vstdttm,'%Y-%m-%d') as vstdttm, 
        date_format(time(o.drxtime*100),'%H:%i:%s') as drxtime, 
        dx.icd10 as diag, dx.icd10name as diagname, 
        CONCAT(p.pname,p.fname,' ',p.lname) as fullname, 
        if(p.male=1,'ชาย','หญิง') as sex,
        u.nameovstos as dchtype,
        CONCAT('บ้านเลขที่ ',p.addrpart,' ','หมู่ที่ ',p.moopart,' ','ตำบล',t.nametumb,' ','อำเภอ',a.nameampur) as address        
        FROM ovstdx as dx 
        INNER JOIN ovst as o on o.vn = dx.vn 
        INNER JOIN pt as p on p.hn = o.hn 
        left join hi.changwat as c on p.chwpart=c.chwpart
        left join hi.ovstost as u on o.ovstost=u.ovstost
        left join hi.ampur as a on p.chwpart=a.chwpart and p.amppart=a.amppart
        left join hi.tumbon as t on p.chwpart=t.chwpart and p.amppart=t.amppart and p.tmbpart=t.tmbpart
        WHERE dx.icd10 in ('A90','A91','B084','B085') AND year(o.vstdttm) = '2019' AND o.vn not in (${vn})
        `;
        return db.raw(sql);

    }
    getOvstdxs(db: knex) {
        let sql = `
        SELECT dx.vn, o.hn, o.pttype, 
        date_format(o.vstdttm,'%Y-%m-%d') as vstdttm, 
        date_format(time(o.drxtime*100),'%H:%i:%s') as drxtime, 
        dx.icd10 as diag, dx.icd10name as diagname, 
        CONCAT(p.pname,p.fname,' ',p.lname) as fullname, 
        if(p.male=1,'ชาย','หญิง') as sex,
        u.nameovstos as dchtype,
        CONCAT('บ้านเลขที่ ',p.addrpart,' ','หมู่ที่ ',p.moopart,' ','ตำบล',t.nametumb,' ','อำเภอ',a.nameampur) as address        
        FROM ovstdx as dx 
        INNER JOIN ovst as o on o.vn = dx.vn 
        INNER JOIN pt as p on p.hn = o.hn 
        left join hi.changwat as c on p.chwpart=c.chwpart
        left join hi.ovstost as u on o.ovstost=u.ovstost
        left join hi.ampur as a on p.chwpart=a.chwpart and p.amppart=a.amppart
        left join hi.tumbon as t on p.chwpart=t.chwpart and p.amppart=t.amppart and p.tmbpart=t.tmbpart
        WHERE dx.icd10 in ('A90','A91','B084','B085') AND year(o.vstdttm) = '2019'
        `;
        return db.raw(sql);

    }

    saveOvst(db: knex, datas: any) {
        return db('ovst').insert(datas);
    }

    saveOvstOn(db: knex, datas, table) {
        return db(table).insert(datas);
    }

}