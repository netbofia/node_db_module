module.exports = {
  //exmaple file
  sql: {
    host:     '127.0.0.1', 
    database: 'yourdatabase',
    username: 'username',
    password: 'password',
    //operatorsAliases: false,
    dialect: 'mysql', // PostgreSQL, MySQL, MariaDB, SQLite and MSSQL See more: http://docs.sequelizejs.com/en/latest/
    logging: false,   //True starts to make it cry.
    timezone: '+00:00',
  },
  seedDB:false,
  seedMongoDB:false,
  seedDBForce:true,
  db:'sql', // mongo,sql if you want to use any SQL change dialect above in sql config
}
