process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/server/app');
const knex = require('../../src/server/db/knex');

describe('routes : users', () => {

  beforeEach((done) => {
    knex.migrate.rollback()
      .then(function () {
        knex.migrate.latest()
          .then(function () {
            knex.seed.run()
              .then(() => done());
          });
      });
  });

  afterEach((done) => {
    knex.migrate.rollback()
      .then(() => done());
  });

  describe('GET /api/v1/users', function () {
    it('should respond with all users', function (done) {
      chai.request(server).get('/api/v1/users').end(function (err, res) {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.data.length.should.eql(2);
        res.body.data[0].should.include.keys(
          'id', 'username', 'email', 'created_at'
        );
        done();
      });
    });
  });
});
