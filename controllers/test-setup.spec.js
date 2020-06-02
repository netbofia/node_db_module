const db=require('.././sqldb')
const glob = require('glob')

let tables=glob.sync(__dirname+'/../sqldb/[A-Z]*.js')
var controller=require('./getSpecifiedTables')


beforeEach(function () {
  let sourceTable=getRandomTable(tables)
  let AssociatedTable=getRandomAssociation(db[sourceTable])
  structure={
    id:"",
    associatedId:{_table:AssociatedTable,_attribute:"id"}
  }
  let tableConnections={
    [AssociatedTable]:{}
  }
  this.controller=controller(sourceTable,tableConnections,structure)
})

afterEach(function () {
  
})


function getRandomTable(tables){
  if(tables.length>0){
    let table=tables[Math.floor(Math.random()*(tables.length))]
    return table.replace(/.*\//,"").split('.')[0]
  }else{
    return null
  }
}

function getRandomAssociation(model){
  let associations=Object.keys(model.associations)
  if(associations.length>0){
    let associationTable=associations[Math.floor(Math.random()*(associations.length))]
    return model.associations[associationTable].target.options.tableName
  }else{
    return null
  }
}