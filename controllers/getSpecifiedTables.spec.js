const chai = require('chai')
const assert = chai.assert
const expect = chai.expect



describe('Test a query with the guided controller',function(){
  it('Query random table and random association',function(done){
    this.controller.then(data=>{
      if(data instanceof Error) done(data)
      done()
    })
  })
})


