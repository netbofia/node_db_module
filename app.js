var DB=require('./sqldb')
var db=new DB('./.config_res').db

module.exports=db
