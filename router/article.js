
var express=require('express');
var {pool}=require('./mysqlconn');
var router =express.Router();
router.get('/getList',(req,res)=>{
    let resultData=[];
    const {type='all',account}=req.query;//使用默认值
    if(account===undefined){
        res.json({code:400,data:null,msg:'无用户信息'});
        return;
    }
    // let sqlStr="select a1.code,a1.title,a1.content,a1.image,a1.status,a1.createTime," +
    //             "a1.releaseTime, a1.isType,a1.status,a1.statusName," +
    //             "a2.readingVolumn,a2.likesVolumn,a2.forwardingVolumn "+
    //             "from vuedata.articlebase a1 left join vuedata.articleUseData a2 on a1.code=a2.code " 
    let sqlStr='select * from vuedata.articlebase a1 left join vuedata.articleUseData a2 on a1.code=a2.code';
    if(type!=='all'){
        sqlStr +=" where isType='" + type +"' and account='"+account+"'";
    }else{
        sqlStr +=" where account='"+account+"'";
    }
    // console.log('sql:',sqlStr);
    pool.query(sqlStr,(err,result,fields)=>{
        if(err){
            console.error("查询失败",err);
            res.json({code:400,data:null,msg:err.message});
            return;
        }
        result.forEach(element => {
            resultData.push({
                code:element.code,
                image:`${req.protocol}://${req.hostname}:${req.socket.localPort}${element.image}`,
                status:element.status,
                statusName:element.statusName,
                descript:{
                    title:element.title,
                    content:element.content
                },
                createTime:element.createTime,
                readingVolumn:element.readingVolumn,
                likesVolumn:element.likesVolumn,
                forwardingVolumn:element.forwardingVolumn
            })
        });
        res.json({code:200,data:resultData,msg:'成功'});
        //console.log('1:',fields);
        //console.log('2');
    })
    //console.log('3');
})
router.get('/themeList',(req,res)=>{
    pool.query('select * from theme',(err,result)=>{
        if(err){
            console.error("查询失败",err);
            res.json({code:400,data:null,msg:'查询失败'})
            return;
        }
        res.json({code:200,data:result,msg:'成功'})
    })
});
router.get('/typesInfo',(req,res)=>{
    pool.query('select * from article_type',(err,result)=>{
        if(err){
            console.log('查询失败：',err)
            res.json({code:400,data:null,msg:'查询失败'});
            return;
        }
        res.json({code:200,data:result,msg:'成功'});
    })
})

module.exports=router;