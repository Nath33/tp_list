const express = require('express')
const router = express.Router()
const BadRequestError = require('../errors/bad-request')
const { find } = require('lodash')

const db = require('../data/db')
const courseListCollection = db.courseList

function uuid(){
    var dt = new Date().getTime();
    return uuid = 'xxxxx-xxx-xxx-xxxxx'.replace(/[x]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
}

router.post('/', (req, res, next) => {
  if (!req.body.name) {
    return next(new BadRequestError('VALIDATION', 'Missing name'))
  }

  const name = req.body.name

  // Check for name uniqueness
  const result = find(courseListCollection, { name })
  if (result) {
    return next(new BadRequestError('VALIDATION', 'Name should be unique'))
  }

  const newCourseList = {
    id: uuid(),
    name
  }

  courseListCollection.push(newCourseList)

  res.json({
    data: newCourseList
  })
})

router.delete('/', (req, res, next) => {
  if (!req.body.id){
    return next(new BadRequestError('VALIDATION', 'Missing id'))
  }

  const id = req.body.id

  let position
  for (let i=0; i< courseListCollection.length;i++) {
    if(courseListCollection[i].id === id ) {
      position = i
    }
  }
  courseListCollection.splice(position, 1)

  return res.json({
    data: courseListCollection
  })
})

router.get('/',(req,res,next)=>{
  return res.json({
    data: courseListCollection
  })
})

module.exports = router
