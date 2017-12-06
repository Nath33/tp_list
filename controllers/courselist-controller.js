const express = require('express')
const router = express.Router()
const BadRequestError = require('../errors/bad-request')
const { find } = require('lodash')

const db = require('../data/db')
const courseListCollection = db.courseList

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
    id: courseListCollection.length + 1,
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

module.exports = router
