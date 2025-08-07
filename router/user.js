var express=require('express');
var router=express.Router();
var {pool}=require('./mysqlconn');

router.get('/userInfo',(req,res)=>{
    let resultData='';
    if(req.query.account===undefined){
        res.json({code:400,data:null,message:'参数错误：未传入账号'});
        return ;
    }
    let sqlStr="select * from vuedata.userinfo a1 left join"+
        " vuedata.level a2 on a1.level=a2.level where a1.account='" +req.query.account +"'";
    pool.query(sqlStr,(err,result,fields)=>{
        if(err){
            console.error('查询失败：',err);
            res.json({code:400,data:null,message:'查询失败'});
        }else{
            if(result.length<1){
                res.json({code:401,data:null,message:'用户不存在'});
            }else{
                res.json({code:200,data:result[0],message:'查询成功'});
            }
            
        }
    })
})

module.exports=router;