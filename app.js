module.exports=function(config,tabledir){
  const DB=require('./sqldb')
  return new DB(config,tabledir).db
}
