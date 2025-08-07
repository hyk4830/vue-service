var express=require('express');
var app=express();
//解决跨域
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Content-Type,Content-Length,Authorization,Accept,X-Requested-Width,yourHeaderFeild');
    res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
    res.header('Content-Type','text/html;chartset=utf-8');
    next();
})

//用户登录相关
var login=require('./router/login');
app.use('/user',login)
var test=require('./router/test')
app.use('/test',test)
var article_base=require('./router/article');
app.use('/article',article_base);
var userInfo=require('./router/user')
app.use('/user',userInfo);
//上传文件
const register=require('./router/registration');
app.use('/user',register);
//设置静态文件目录
app.use(express.static('resource'));
app.listen(9016);