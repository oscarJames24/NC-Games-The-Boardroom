const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app');
const request = require('supertest');


beforeEach(() => seed(testData));
afterAll(() => db.end());


describe('/api', () => {
    describe('GET', () => {
      test('status: 200: return message all ok', () => {
          return request(app)
          .get("/api")
          .expect(200)
          .then((result) => {
              expect(result.body).toEqual({message: 'all ok'});
          });
      });
    });
  });

  describe('/api/categories', () => {
    describe('GET', () => {
      test('status: 200: responds with array of objects', () => {
          return request(app)
          .get("/api/categories")
          .expect(200)
          .then((result) => {
              expect(result.body.categories).toHaveLength(4);
              result.body.categories.forEach((category) => {
                  expect(category).toEqual(
                      expect.objectContaining({
                          slug: expect.any(String),
                          description: expect.any(String)
                      })
                  )
              })
          });
      });
    });
  });