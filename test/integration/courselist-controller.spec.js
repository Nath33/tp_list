const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
chai.should()

const { find } = require('lodash')

const db = require('../../data/db')
const app = require('../../app')

const courseListFixture = require('../fixtures/courseList')

describe('CourselistController', () => {
  beforeEach(() => { courseListFixture.up() })
  afterEach(() => { courseListFixture.down() })

  describe('When I create a courseList (POST /course-lists)', () => {
    it('should reject with a 400 when no name is given', () => {
      return request(app).post('/course-lists').then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Missing name'
          }
        })
      })
    })

    it('should reject when name is not unique', () => {
      return request(app)
        .post('/course-lists')
        .send({ name: 'Toto' })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Name should be unique'
            }
          })
      })
    })

    it('should succesfuly create a courseList', () => {
      const mockName = 'My New List'

      return request(app)
        .post('/course-lists')
        .send({ name: mockName })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.name.should.equal(mockName)

          const result = find(db.courseList, { name: mockName } )
          result.should.not.be.empty
          result.should.eql({
            id: res.body.data.id,
            name: res.body.data.name
          })
        })
    })
  })

  describe('When I delete a course list (DELETE /course-lists)', () => {
    it('Should reject a 400 when course list does not exist', () => {
      return request(app)
        .delete('/course-lists')
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Missing id'
            }
          })
        })
    })
    it('Should delete a list', () => {
      let mockId
      for (let i = 0; i < db.courseList.length; i++) {
        if (db.courseList[i].name === 'Toto') {
          mockId = db.courseList[i].id
        }
      }
      return request(app)
        .delete('/course-lists')
        .send({ id: mockId })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('array')

          const result = find(db.courseList, { id: mockId })
          expect(result).to.be.undefined
        })
    })
  })

  describe('When I get all course lists (GET /course-lists', () => {
    it('Should successfully show all course lists', () => {
      return request(app)
        .get('/course-lists')
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('array')
          res.body.data.length.should.be.eql(2)
        })
    })
  })

})
