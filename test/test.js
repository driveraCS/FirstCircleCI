var should = require('chai').should(),
	expect = require('chai').expect,
	supertest = require('supertest'),
	server = require('../server.js');

describe('User API', function() {
	
	before(function() {
		supertest(server).post('/locations')
		.set('Accept', 'application/json')
		.send({
			'addressProvince': "Cartago",
			'addressCanton': "Turrialba",
			'addressDistrict': "Santa Teresita",
			'userId': 1
		})
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function (err, res) {
			location1 = res.body;
		});
	});
	
	after(function(done){
		server.close(done)
	});
	
	it('should return a 200 response', function(done) {
		supertest(server).get('/users/1')
		.set('Accept', 'application/json')
		.expect(200, done);
	});
	
	it('should be an object with keys and values', function(done) {
		supertest(server).get('/users/1')
		.set('Accept', 'application/json')
		.expect(200)
		.end(function(err, res) {
			expect(res.body).to.have.property('name');
			expect(res.body.name).to.not.equal(null);
			expect(res.body).to.have.property('email');
			expect(res.body.email).to.not.equal(null);
			expect(res.body).to.have.property('phoneNumber');
			expect(res.body.phoneNumber).to.not.equal(null);
			done();
		});
	});
	
	it('should be updated with a new name', function(done) {
		supertest(server).put('/users/1')
		.set('Accept', 'application/json')
		.send({
			'name': 'Kevin',
			'email': 'kevin@test.com',
			'phoneNumber': '89456123'
		})
		.expect(200)
		.end(function(err, res) {
			expect(res.body.name).to.equal('Kevin');
			expect(res.body.email).to.equal('kevin@test.com');
			expect(res.body.phoneNumber).to.equal('89456123');
			done();
		});
	});
	
	it('should not be able to access other users locations', function(done) {
		supertest(server).get('/users/2/location')
		.set('Accept', 'application/json')
		.send({
			'userId': 1
		})
		.expect(401)
		.end(function(err, res) {
			if(err) return done(err);
			expect(res.error.text).to.equal('Unauthorized');
			done();
		});
	});
	
	it('should access their own locations', function(done) {
    supertest(server).get('/users/1/location')
    .set('Accept', 'application/json')
    .send({
      'userId': 1
    })
    .expect(200)
    .end(function(err, res) {
      expect(res.body.userId).to.equal(1);
      expect(res.body.addressProvince).to.equal("Cartago");
      done();
    });
  });
	
});