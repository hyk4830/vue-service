let mysql=require('mysql');

let pool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'hyk123',
    database:'vuedata',
    connectionLimit:10
});
async function fetchData(query,params){
    return new Promise((resolve,reject)=>{
        pool.query(query,params,(err,results,fields)=>{
            if(err){
                reject(err);
            }else{
                resolve(results);
            }
        })
    })
}
// connection.connect(err=>{
//     if(err){
//         console.error('error connecting to database:',error);
//         return;
//     }
//     console.log("数据链接成功");
// });

module.exports={pool,fetchData};
