const oracledb = require('../models/Oracle')

class SungJuk {
    options = {
        resultSet: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT
    }; // 얘가 없으면 select구문이 제대로 동작하지않는다.
    selectsql = 'select sjno,name,kor,eng,mat,regdate from sungjuks order by sjno desc ';
    // 생성자 정의 - 변수 초기화
    // 즉, 매개변술 전달된 값을 클래스 멤버변수에 대입함
    // 특정 함수에 값들을 전달하기 위해서?
    constructor(name,kor,eng,mat,tot,avg,grd) {
        this.name = name;
        this.kor = kor;
        this.eng = eng;
        this.mat = mat;
        this.tot = tot;
        this.avg = avg;
        this.grd = grd;
    }
    //성적 저장
    async insert () {

            let conn = null;
            let sql = 'insert into sungjuks (sjno,name,kor,eng,mat,tot,avg,grd)values (sjno.nextval,:1,:2,:3,:4,:5,:6,:7)';
            let book = [this.name,this.kor,this.eng,this.mat,this.tot,this.avg,this.grd];

            try {
                conn = await oracledb.makeConn();
                let result = await conn.execute(sql, book);
                await conn.commit();
                console.log(result);
            }catch(err)
            {
                console.log(err);
            }
            finally
            {
                await oracledb.closeConn(conn);
            }
        }


    //성적 전체조회
    async select() {
        let conn = null;
        let result = null;
        try {
            conn = await oracledb.makeConn();
            result = await conn.execute(this.selectsql,[],this.options)

            let rs = result.resultSet
            let row = null;
            while((row = await rs.getRow())){
                result = new SungJuk(row[1],row[2],row[3],row[4]);
                result.sjno = row[0];
                result.regdate = row[5];
            }

        }catch (e){
            console.log(e);
        }finally {
            await oracledb.closeConn(conn);
        }

        return await result;
    }
    //성적 상세조회
    selectOne(sjno) {}
}

module.exports =SungJuk;
