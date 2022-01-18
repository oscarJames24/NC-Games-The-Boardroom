const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app');
const request = require('supertest');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api', () => {
  describe('GET', () => {
    test('status 200: return message all ok', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then((result) => {
          expect(result.body).toEqual({ message: 'all ok' });
        });
    });
  });
});

describe('/api/categories', () => {
  describe('GET', () => {
    test('status 200: responds with array of objects', () => {
      return request(app)
        .get('/api/categories')
        .expect(200)
        .then((result) => {
          expect(result.body.categories).toHaveLength(4);
          result.body.categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
    test('status 404: returns a page not found error when path is misspelt', () => {
      return request(app)
        .get('/api/cartegeries')
        .expect(404)
        .then((result) => {
          expect(result.body).toEqual({ msg: 'Invalid URL - Page does not exist'})
        })
    });
  });
});

describe.only(`/api/reviews`, () => {
  describe('GET', () => {
    test(`status 200: returns object with "reviews key" with array of objects with required keys `, () => { return request(app)
      .get('/api/reviews/1')
      .expect(200)
      .then((result) => {
        expect(result.body.reviews).toHaveLength(9);
        result.body.reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_URL: expect.any(String),
              votes: expect.any(Number),
              category: expect.any(String),
              owner: expect.any(String),
              created_at: expect.any(String),
            })
          )
        })
      })
    });
  });
})