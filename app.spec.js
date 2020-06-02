const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const glob = require('glob')

let tables=glob.sync(__dirname+'/sqldb/[A-Z]*.js')
let config=".config_res"
let tableDir=__dirname+"/sqldb"
const db=require('./app')(config,tableDir)

describe('Testing database setup',function(){
  it('Test table files exist!',function(){
    assert.typeOf(getRandomTable(tables),'string')
  })
  it('Testing credentials',function(done){
    db.sequelize.authenticate().then(done)
  })
  it('Test simple query',function(done){
    let table=getRandomTable(tables)
    db[table].findAll({}).then(data=>{
      if(data instanceof Error) done(data)
      done()
    })
  })
})


function getRandomTable(tables){
  if(tables.length>0){
    let table=tables[Math.floor(Math.random()*(tables.length))]
    return table.replace(/.*\//,"").split('.')[0]
  }else{
    return null
  }
}