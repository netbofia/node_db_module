/**
 * Created by Bruno Costa on 12-09-2020.
 */


class DB{
  constructor(configPath,tableDir){    
    var Sequelize = require('sequelize');
    this.glob = require('glob');
    this.path = require('path');
    this.fs = require('fs')    
    //DB credentials
    let config = this.getCredentials(configPath);
    this.db = {
      sequelize: new Sequelize(
        config.sql.database,
        config.sql.username,
        config.sql.password,
        config.sql
      )
    };
    this.importTables(tableDir)
    this.associate()
  }   
  importTables(tableDir){
    let db=this.db 
    let glob=this.glob
    let path=this.path
    let fs=this.fs
    //This is the configuration file that has all the credentials
    //db tables  //Do this for all Keys in Object requeire(dir that start with capital letters)
    //Get all file names in this directory that start with a capital letter and have a Java script extension.
    //This may be bad for performance 
    
    
    var tables=glob.sync(tableDir+'/'+'!([a-z]*.js|*.[^j][^s]*|.gitignore)') //relative to call path
    //Table / attribute association
    tables.forEach(table=>{
      var table=path.basename(table,'.js');
      let tablePath=`${tableDir}/${table}`
      if(fs.existsSync(tablePath+".js")){
        db[table]=db.sequelize.import(tablePath);
      }else{
        throw Error(`Path to ${table} was not found! This should be an absolute path! Otherwise it will be relative to the module.`)
      }
    })
  }
  associate(){
    let db=this.db 
    //Foreign key association
    Object.keys(db).forEach(function(modelName) {
      if ('classMethods' in db[modelName].options) {
        db[modelName].options.classMethods.associate(db);
      }
    });
  }
  getCredentials(credentialsPath){
    let credentials=this.fs.readFileSync(credentialsPath,'utf8')
    return JSON.parse(credentials)
  }
}


module.exports = DB;