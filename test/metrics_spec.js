//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let app = require('../app')
let should = chai.should()

let dom_load_examples = [0.164, 0.253112233]

const testData = ({navigation_started_at, dom_load = dom_load_examples[0]}) => ({
  url: 'http://localhost:3002/',
  user_agent: 'Mozilla/5.0 (X11; Linux x86_64)',
  dom_load,
  fcp: 0.21949499999755062,
  ttfb: 0.002,
  window_load: 0.257,
  files: [{
    name: 'http://localhost:3002/static/js/bundle.js',
    file_type: 'script',
    responseEnd: 0.05904500000178814
  }, {
    name: 'http://localhost:3002/static/media/logo.5d5d9eef.svg',
    file_type: 'img',
    responseEnd: 0.16503999999986263
  }],
  navigation_started_at
})

chai.use(chaiHttp)
//Our parent block
describe('Metrics', () => {
  describe('/GET metrics', () => {
    it('should GET all the books in the past half hour', (done) => {
      // Create new and old data
      let currentTime = new Date()
      let previousTime = new Date().setHours(currentTime.getHours() - 1)
      chai.request(app)
        .post('/metrics')
        .set('Content-Type', 'application/json')
        .send(testData({
          navigation_started_at: previousTime.toString(),
          dom_load: dom_load_examples[1]
        }))
        .end((err, res) => {
          res.should.have.status(200)
        })
      chai.request(app)
        .post('/metrics')
        .set('Content-Type', 'application/json')
        .send(testData({
          navigation_started_at: currentTime.toString()
        }))
        .end((err, res) => {
          res.should.have.status(200)
        })

      // Test the result
      chai.request(app)
        .get('/metrics')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.be.least(1)
          res.body[res.body.length - 1].dom_load.should.be.eq(dom_load_examples[0])
          res.body.forEach(metric => {
            metric.navigation_started_at.should.be.not.eq(dom_load_examples[1])
          })
          done()
        })
    })
  })

  describe('/POST metrics', () => {
    it('should return created metric object', (done) => {
      let data = testData({ navigation_started_at: new Date().toString() })
      chai.request(app)
        .post('/metrics')
        .set('Content-Type', 'application/json')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.data.user_agent.should.be.eq(data.user_agent)
          res.body.data.fcp.should.be.eq(data.fcp)
          res.body.data.files[0].responseEnd.should.be.eq(data.files[0].responseEnd)
          done()
        })
    })
    it('should return 500 code for invalid object', (done) => {
      let data = { something: 'not acceptable' }
      chai.request(app)
        .post('/metrics')
        .set('Content-Type', 'application/json')
        .send(data)
        .end((err, res) => {
          console.log(res)
          res.should.have.status(500)
          res.body.should.be.a('object')
          done()
        })
    })
  })
})
