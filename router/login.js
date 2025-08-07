const express=require('express');
const {fetchData}=require('./mysqlconn');
const {createToken,verifyToken}=require('./token');
const router=express.Router();
router.get('/login',(req,res)=>{
   const {account,password}= req.query;
   let sqlStr="select a1.*,a2.levelName from vuedata.user a1 left join vuedata.level a2" +
              " on a1.level=a2.level where account='"+account +"'";
   fetchData(sqlStr,[]).then((result)=>{
        if(result.length===0){
            res.json({
                statusCode:401,
                message:'用户不存在',
                data:null
            })
            return;
        }
        const sql_password=result[0].password;
        if(password===sql_password){
            createToken(account,result[0].accountName).then(token=>{
                result[0].token=token;
                result[0].photo=`${req.protocol}://${req.hostname}:${req.socket.localPort}${result[0].photo}`
                res.json({
                    statusCode:200,
                    message:'success',
                    data:result[0]
                })
            }).catch(err=>{
                 res.json({
                statusCode:402,
                message:err,
                data:null
            })
            })
            
        }else{
            res.json({
                statusCode:402,
                message:'密码错误',
                data:null
            })
        }
        
   }).catch(err=>{
        console.error('get user:',err);
        res.json({
            statusCode:400,
            message:'用户不存在或非法用户',
            data:null
        })
   })
})
router.get('/checkToken',(req,res)=>{
    const {token=''} =req.query;
    if(token===''){
        res.json({
            statusCode:402,
            message:'token值为空',
            data:null
        });
        return;
    }
    verifyToken(token).then(decoded=>{
        const {account}=decoded;
        let sqlStr="select a1.*,a2.levelName from vuedata.user a1 left join vuedata.level a2" +
              " on a1.level=a2.level where account='"+account +"'"; 
        fetchData(sqlStr,[]).then(result=>{
            if(result.length===0){
                res.json({
                    statusCode:401,
                    message:'用户已不存在',
                    data:null
                })
                return;
            }
            result[0].photo=`${req.protocol}://${req.hostname}:${req.socket.localPort}${result[0].photo}`;
            res.json({
                statusCode:200,
                message:'success',
                data:result[0]
            })
        }).catch(err=>{
            console.error('checktoken error:',err);
            res.json({
            statusCode:402,
            message:err,
            data:null
            })
        })
    }).catch(err=>{
        console.error('checktoken error:',err);
        res.json({
            statusCode:402,
            message:err,
            data:null
        })
    })
})
module.exports=router;