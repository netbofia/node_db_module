/**
 * Created by Bruno Costa on 12-09-2020.
 */

class DB{
  constructor(configPath,tableDir){
    var config = require("../"+configPath);
    var Sequelize = require('sequelize');
    this.glob = require('glob');
    this.path = require('path');
    
    //DB credentials
    this.db = {
      sequelize: new Sequelize(
        config.sql.database,
        config.sql.username,
        config.sql.password,
        config.sql
      )
    };
    this.associate(tableDir)
  }   
  associate(tableDir){
    let db=this.db 
    let glob=this.glob
    let path=this.path
    //This is the configuration file that has all the credentials
    //db tables  //Do this for all Keys in Object requeire(dir that start with capital letters)
    //Get all file names in this directory that start with a capital letter and have a Java script extension.
    //This may be bad for performance 
    var tables=glob.sync(tableDir+'/'+'!([a-z]*.js|*.[^j][^s]*|.gitignore)')
    //Table / attribute association
    tables.forEach(table=>{
      var table=path.basename(table,'.js');
      db[table]=db.sequelize.import('./'+table);
    })

    //Foreign key association
    Object.keys(db).forEach(function(modelName) {
      if ('classMethods' in db[modelName].options) {
        db[modelName].options.classMethods.associate(db);
      }
    });

  }
}



module.exports = DB;