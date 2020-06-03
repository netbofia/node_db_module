# node_db_module
Basic template to perform queries with sequelize 

Uses a simple guiding system to query multiple tables and build the resturn json with the results from the db query.

``` bash
  npm install node_db_module --save

  

``` 
Example of credentials file

``` JSON
{
  "sql": {
    "host":"127.0.0.1", 
    "database":"db",
    "username":"user",
    "password":"pass",
    "dialect":"mysql",
    "logging":false,
    "timezone":"+00:00"
  },
  "seedDB":false,
  "seedMongoDB":false,
  "seedDBForce":true,
  "db":"sql"
}

  
  
``` 

Starting instance of db module requires to variables:
- The path relative/absoulte to credentials JSON
- The absolute path to the tables dir. Note: Tables must start with capital letter!

``` JavaScript
  const db=require('node_db_module')(credentials,abspathtotables)
``` 

Example of table file
```JavaScript  
  'use strict';

  module.exports = function(sequelize, DataTypes) {
    const ExampleTable = sequelize.define('ExampleTable', {
      id: { 
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
    firstName: DataTypes.STRING(254),
    lastName: DataTypes.STRING(254),
  }, {
      tableName: 'ExampleTable',
      timestamps: false,
      underscored: false,

     classMethods: {
        associate: function associate(models) {
          ExampleTable.belongsTo(models.OtherTable, {
            foreignKey: 'id',              //on Study
            targetKey: 'exampleTable_id',  //foreign key  
          });              
        }
      },
    });

    return ExampleTable;
  };
  ```

## Getting table data with a simpler database model
This requires two dependencies the **structure** and the **controller**. Structure reflects the same filosophy of call structure explained in ../structures  


   You specify the **sourceTable** the table from which the query is built.
   Then you provide the graph of connected tables **tableConnections** this is a simple json structure, table names _must_ be capitalized. The hierachy of **tableConnections** reflects the database structure. Lttributes like **where** can be placed anywhere in the structure, to reflect the table to which th "where" clause belongs to.

``` javascript 
  
var tableConnections={
  Table1:{}
  Table2:{Table3:{}}
  Table4:{
    Table5:{},Table6:{
      Table:7:{}
    }
  }
}

```



#Structure JSON

        //Build skeleton and set values to string name of attribute if in the same table
        // a new object needs the _table key added with the respective table name
        // attributes that are the same set to ""
        // attributes from other tables need object with _table [_attribute]

Root of Object 
===============

Each key that has a string as a value with be filled with the value of the root table with the 

```
{
  key:''
}
```
key will be filled with the value of the attribute "key" in the current table

```
{
  key:'name'
}
```
key will be filled with the value of the attribute "name" in the current table

Single attribute from table with distance = 1
---------------------------------------------
```
{
  key: {_table:'table2',_attrubute:'name'}
}
```
Key will be filled with the value of the attribute "name" in table "table2"


Single attribute from table with distance >1 
---------------------------------------------
```
{
  key: {_table:['table2','table3'],_attrubute:'name'}
}
```
Key will be filled with the value of the attribute "name" in table "table3". The array of table in \_table must be sequentially traversed throughout the foreign key coupling the tables. For now the \_attribute is necessary always in this case.

Conversion to a different type
------------------------------
```
{
  key: {_table:'table3',_attrubute:'name',_parse:"int|str"}
}
```
Conversion to string or integer based on the value in the key \_parse".



Creating a new object
---------------------
```
{
  key: '',
  key2:{
    _table:"table2",
    id:"",
    name:'person',
    formula:{_table:''}
  }
}
```

Creating an array of strings
----------------------------
```
{
  key: '',
  key2:[{
      _table:"table2",
      _attribute:"name"
    }]
}
```




Creating an array of strings from multiple attributes
------------------------------------------------------
```
{
  key: '',
  key2:[{
      _table:"table2",
      _attribute:{
        _joiner:"=",
        _attributes:["name","id"]
      }
    }]
}
```

Creating an array of objects
----------------------------
```
{
  key: '',
  key2:[{
      _table:"table2",
      _model:{
        _table:"table2",
        id:"",
        name:'person',
        formula:{_table:''}
      }
    }]
}
```

Creating an object with a dynamic key
--------------------------------------
```
{
  key1:[{
    _table:"table1",
    _model:{
      _table:"table1"
      _key:"propertyName",
      _value:"propertyValue"
    }
  }]
}
```

This will produce the following 

Intermediary Result (cleanUpArray)  
```
{
  key1:[
    {"objHash":{_key:"key1",_value:"v1"}},
    {"objHash":{_key:"key2",_value:"v2"}},
    {"objHash":{_key:"key3",_value:"v3"}}
  ]
}
```
IR 2
```
{
  key1:[
    {
      "key1":"v1",
      "key2":"v2",
      "key3":"v3"
    }
  ]
}
```

```
{
  key1:{
      "key1":"v1",
      "key2":"v2",
      "key3":"v3"
    }
}
```
How to signal agglutination (do it by default)
How to signal transform to array (_key _value ?) Then transform in clean up?


Exceptions
----------

This exception has been introduced due to the fact that the continuing foreign key is variable therefore to retrieve it variable placeholder must be used to get the following tables.

The table in question here is the "ObservationUnit" table which has a variable foreign key depending on which one is filled out:

 -  studyId
 -  plantId
 -  plotId
 -  sampleId  

The placeholder to get the FK attribute that is not null is the varFK. That attribute in structure will retrieve the table name from the attribute name that is not null. 

Dealing with exceptions, if more than one attribute is not null, then an exception must be invoked, stating that more than one attribute, was found as not null.



If the current table is Sample, Plot or Plant and the next table is: 
  ObservationUnit

  Model must contain:
    Sample, SamplePlant, Plant, Plot and ObservationUnit

  Function will recursively retrieve the shortest path, by returning the level of the ObservationUnit.

If the current table is ObservationUnit and the next table is:
  Sample, Plot or Plant

  Model must contain:
    Sample, SamplePlant, Plant, Plot and ObservationUnit

  Function will go trough the fk in level to get the shortest path to the required table.

  Possible issues Mutiple plants for the same sample. 

Example:
```
{
  observationUnitDbId: {
    _table:'ObservationUnit',
    _attribute:'id'
  }, //or
  germplasmDbID: {
    _table:["ObservationUnit","Study","StudyGermplasm"],
    _attribute:'germplasmId'
  },
}
```
Don't state the tables in between the origin and destination.



