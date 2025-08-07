const express=require('express');
const router=express();
const multer=require('multer');
const path=require('path');
const {fetchData}=require('./mysqlconn');
//设置存储位置和文件名
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        const rootDir= path.join(__dirname, '..');
        cb(null,path.join(rootDir,'resource/photo'));
    },
    filename:function(req,file,cb){
        //cb(null,file.filename+'-'+Date.now()+path.extname(file.originalname));//文件名
        cb(null,Date.now()+'-'+Buffer.from(file.originalname,'latin1').toString('utf-8'));
       // cb(null,Date.now()+'-'+file.originalname);
    }
})
const upload=multer({storage:storage});
router.post('/register',upload.single('photo'),(req,res)=>{
    const {account,accountName,password,level='4'}=req.body;
    if(account===(undefined||'')||accountName===(undefined||'')||password===(undefined||'')){
        res.json({
            statusCode:400,
            message:'用户注册的关键信息缺失！'
        })
    }
    const sqlStr="select * from vuedata.user where account='"+account +"'"
    fetchData(sqlStr,[]).then(results=>{
        if(results.length>0){
           return res.json({
                statusCode:400,
                message:'用户已存在'
            })
        }
        const photo=req.file? `/photo/${req.file.filename}`:'/photo/default.jpg';
        const insertSql="insert into vuedata.user(account,accountName,password,level,photo)"+
                `values('${account}','${accountName}','${password}','${level}','${photo}')`;
        fetchData(insertSql,[]).then(result=>{
            res.json({
                statusCode:200,
                message:'注册成功'
            })
        }).catch(err=>{
            res.json({
                statusCode:400,
                message:err
            })
        })        
    }).catch(err=>{
        res.json({
                statusCode:400,
                message:err
            })
    })   
})
router.post('/files',upload.array('photos',9),(req,res,next)=>{
    if(!req.files||!req.files.length<1){
        res.json({
            statusCode:400,
            message:'not file upload'
        })
        return;
    }
    res.json({
        statusCode:200,
        message:'uploaded success'
    })
})
module.exports=router;