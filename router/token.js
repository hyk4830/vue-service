const {fetchData}=require('./mysqlconn');
const jwt=require('jsonwebtoken');
//定义一个密钥和过期时间
const getSecretKey= async()=>{
    try{
        const sqlstr="select keyValue,expiresIn from vuedata.baseConfig where keyCode='token_secret'";
        const result=await fetchData(sqlstr,[]);
        if(result.length>0){
            return result[0];
        }else{
            return '';
        }
    }catch(error){
        console.error('error fetching secretKey',error);
    }
}
//获取密钥
function createToken(account,accountName){
    return new Promise((resolve,reject)=>{
          getSecretKey().then(keyData=>{
            const secretKey=keyData.keyValue;
            const expiresInData=keyData.expiresIn !==(null||''||undefined)? keyData.expiresIn:'1h';
            const options={expiresIn:expiresInData}
            if(secretKey===''){
                reject('no secretKey');
            }
            let payload={
                account:account
                // accountName:accountName
            }
            const token=jwt.sign(payload,secretKey,options);
            resolve(token);
        }).catch(error=>{
            console.error('error 001');
        });
    })
}
function verifyToken(token){
    return new Promise((resolve,reject)=>{
        getSecretKey().then((secretInfo)=>{
            if(secretInfo.keyValue===undefined||secretInfo.keyValue===''){
                reject('no secret_key')
            }
            jwt.verify(token,secretInfo.keyValue,(err,decoded)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(decoded);//token有效，返回解码后的数据
                }
            })
        })
    })
}
module.exports={
    createToken,verifyToken
}