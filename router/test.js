var express=require('express');
var router=express.Router();
router.get('/test',(req,res)=>{
    console.log('ttt');
    res.send({message:'第一个接口',data:'测试'})
})
module.exports=router;