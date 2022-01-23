const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app');
const request = require('supertest');

beforeEach(() => seed(testData));
afterAll(() => db.end());

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
          expect(result.body).toEqual({ msg: 'Invalid URL - Page does not exist' });
        });
    });
  });
});

describe(`GET /api/reviews/:review_id`, () => {
  // ALL TESTS SIGNED OFF
  test(`status 200: returns object with "reviews" key with array of objects with required keys `, () => {
    return request(app)
      .get('/api/reviews/2')
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toEqual({
          review_id: expect.any(Number),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });

  test('400: returns "Bad Request. Invalid ID." when id is in the wrong data type ', () => {
    // this one should get picked up by psql error
    return request(app)
      .get('/api/reviews/notanId')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual('Bad Request - Invalid Input');
      });
  });
  test('404: returns "ID does not exist" when id does not exist', () => {
    return request(app)
      .get('/api/reviews/763')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual('Reivew ID not found');
      });
  });
});
// REVISIT PATCH - 400 - invalid votes type & 200 - missing key n
describe('PATCH - api/review/:review_id ', () => {

  test('Status 200: should amend reviews vote count by indicated amount - +1', () => {
    const voteUpdate = { inc_votes: 1 };
    return request(app)
      .patch('/api/reviews/1')
      .send(voteUpdate)
      .expect(200)
      .then((res) => {
        expect(res.body.review).toBeInstanceOf(Object);
        expect(res.body.review).toEqual({
          review_id: 1,
          title: 'Agricola',
          designer: 'Uwe Rosenberg',
          owner: 'mallionaire',
          review_img_url:
            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          review_body: 'Farmyard fun!',
          category: 'euro game',
          created_at: '2021-01-18T00:00:00.000Z',
          votes: 2,
        });
      });
  });

  test('Status 400: returns "Bad Request. Invalid ID." when id is in the wrong data type ', () => {
    // this one should get picked up by psql error
    const voteUpdate = { inc_votes: 1 };
    return request(app)
      .patch('/api/reviews/notanId')
      .send(voteUpdate)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual('Bad Request - Invalid Input');
      });
  });

  test('Status 404: returns "ID does not exist" when id does not exist', () => {
    return request(app)
      .get('/api/reviews/763')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual('Reivew ID not found');
      });
  });

  test('Status 400: returns "Bad Request. Invalid Input', () => {
    const voteUpdate = { inc_votes: 'not a number' };
    return request(app)
      .patch('/api/reviews/1')
      .send(voteUpdate)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual('Bad Request - Invalid Input');
      });
  });

  test('Status 200: returns unaffected review when sent object with incorrect key ', () => {
    return request(app)
      .patch('/api/reviews/1')
      .send()
      .expect(200)
      .then((res) => {
        expect(res.body.msg).toEqual('Missing input - review not updated');
      });
  });
});

describe('GET - /api/reviews', () => {
  test(`status 200: SORT BY DEFAULT - returns array of objects sorted by default of date in desc order`, () => {
    return request(app)
    .get('/api/reviews')
    .expect(200)
    .then((res) => {
      expect(res.body.reviews).toBeSortedBy('created_at', {
        descending: true,
      });
    });
  });
  test('Status 200: sorts by votes', () => {
    return request(app)
      .get('/api/reviews?sort_by=votes')
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy('votes', {
          descending: true,
        });
      });
  });
  test('Status 200: order ASC', () => {
    return request(app)
      .get('/api/reviews?order=ASC')
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy('created_at', {
          ascending: true,
        });
      });
  });
  test(`status 200: SORT BY query - return array of reviews sorted by number of votes and filtered by category social deduction`, () => {
    return request(app)
      .get('/api/reviews?sort_by=votes&order=ASC&category=social deduction')
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toHaveLength(11);
        expect(res.body.reviews).toBeSortedBy('votes', {
          ascending: true,
        });
      });
  });
  test(`status 200: SORT BY query - return array of reviews sorted by number of votes`, () => {
    return request(app)
      .get('/api/reviews?sort_by=votes&order=ASC')
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy('votes', {
          ascending: true,
        });
      });
  });
  test(`status 404: INVALID QUERY uses invalid keys so is rejected`, () => {
    return request(app)
      .get('/api/reviews?sort_by=votes&order=ASC&category=invalidCat')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('Bad Request - category does not exist');
      });
  });
  test(`status 400: INVALID QUERY uses invalid keys so is rejected`, () => {
    return request(app)
      .get('/api/reviews?sort_by=invalid')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Bad Request - unsortable');
      });
  });
  test(`status 404: INVALID QUERY uses invalid keys so is rejected`, () => {
    return request(app)
      .get('/api/reviews?category=invalid')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('Bad Request - category does not exist');
      });
  });
  test(`status 400: INVALID QUERY uses invalid keys so is rejected`, () => {
    return request(app)
      .get('/api/reviews?order=invalid')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Bad Request - order');
      });
  });
  
  test(`status 200: valid category but no reviews returns empty array`, () => {
    return request(app)
    .get('/api/reviews?category=children\'s games')
    .expect(200)
    .then((res) => {
      expect(res.body.reviews).toEqual([])
    });
  });
});

// GOT TO HERE
describe('GET - /api/reviews/:review_id/comments', () => {
  test('status 200: return array of comments by review_id with required comment properties', () => {
    return request(app)
      .get(`/api/reviews/3/comments`)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveLength(3);
        res.body.forEach((comments) => {
          expect(comments).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });

  test('Status 400: returns "Bad Request. Invalid ID." when id is in the wrong data type ', () => {
    // this one should get picked up by psql error
    return request(app)
      .get(`/api/reviews/invalid_Id/comments`)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual('Bad Request - Invalid Input');
      });
  });

  test('Status 404: returns "ID does not exist" when id does not exist', () => {
    return request(app)
      .get('/api/reviews/763/comments')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual('Reivew ID not found');
      });
  });
  test(`status 200: valid ID but no comments returns empty array`, () => {
    return request(app)
    .get('/api/reviews/1/comments')
    .expect(200)
    .then((res) => {
      expect(res.body).toEqual([])
    });
  });
});

describe('POST - api/reviews/:review_id/comments', () => {
  // ADD
  // - [ ] Status 400, invalid ID, e.g. string of "not-an-id"
  // - [ ] Status 404, non existent ID, e.g. 0 or 9999
  // - [ ] Status 404, username does not exist
  // - [ ] Status 201, ignores unnecessary properties

  test('status 201: requestbody accepts an object with username and body and responds with the posted comment', () => {
    return request(app)
      .post(`/api/reviews/3/comments`)
      .send({
        username: 'mallionaire',
        body: 'Woof woof gruff',
      })
      .expect(201)
      .then((res) => {
        console.log(res.body, 'res in testing');
        const newComment = res.body.body;
        expect(newComment).toBe('Woof woof gruff');
      });
  });

  test('status 400: missing field - returns error message', () => {
    return request(app)
      .post('/api/reviews/3/comments')
      .send({
        username: 'mallionaire',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Invalid input - missing fields'); // use this with handlepsqlerrors
      });
  });

  test('status 400: extra fields - returns error message', () => {
    return request(app)
      .post('/api/reviews/3/comments')
      .send({
        username: 'Mallionaire',
        body: 'Woof woof gruff',
        extra_field: 'extra comment',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Invalid input - extra fields submitted'); // use this with handlepsqlerrors
      });
  });
});
describe('DELETE - api/comments/:comment_id', () => {
  // TO ADD
  test('status 204: deletes specified comment from database and returns no content', () => {
    return request(app).delete('/api/comments/1').expect(204);
  });
  test('status:404 accepts id that does not exist and returns an error message to say couldnt delete as ID does not exist', () => {
    return request(app)
      .delete('/api/comments/79')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('Nothing deleted: Comment ID not found');
      });
  });
  test('Status 400: returns "Bad Request. Invalid ID." when id is in the wrong data type ', () => {
    // this one should get picked up by psql error
    return request(app)
      .delete('/api/comments/invalid')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual('Bad Request - Invalid Input');
      });
});
})

describe("GET - /api", () => {
  test("status:200, responds with an object of endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(require("../endpoints.json"));
      });
  });
});

describe('GET /api/users', () => {
    test('should respond with an array of objects with the username property', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toEqual([
            { username: 'mallionaire' },
            { username: 'philippaclaire9' },
            { username: 'bainesface' },
            { username: 'dav3rid' },
          ]);
        });
    });
});

describe('GET /api/users/:username', () => {
  // TO ADD
  // - [ ] Status 404, non existent ID, e.g 999
  // - [ ] Status 400, invalid ID, e.g "not-an-id"

  test('Status 200: should take username and respond with an object of username details with required keys', () => {
    return request(app)
      .get('/api/users/bainesface')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toEqual({
          username: 'bainesface',
          name: 'sarah',
          avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
        });
      });
  });
  test.only('400: returns "Bad Request. Invalid ID." when id is in the wrong data type ', () => {
    // this one should get picked up by psql error
    return request(app)
      .get('/api/users/invalidIdinvalidIdinvalidIdinvalidIdinvalidIdinvalidIdinvalidIdinvalidIdinvalidIdinvalidIdinvalidIdinvalidId')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toEqual('Bad Request - Invalid Input');
      });
  });
  test('404: returns "ID does not exist" when id does not exist', () => {
    return request(app)
      .get('/api/users/763')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual('Username not found');
      });
  });
});



describe('PATCH - api/comments/:comment_id', () => {
  // - [ ] Status 400, invalid ID, e.g. string of "not-an-id"
  // - [ ] Status 400, invalid inc_votes type, e.g. property is not a number
  // - [ ] Status 404, non existent ID, e.g. 0 or 9999
  // - [ ] Status 200, missing `inc_votes` key. No effect to comment.
  test('Status 200: should amend specified comment vote count by indicated amount - +1', () => {
    const voteUpdate = { inc_votes: 1 };
    return request(app)
      .patch('/api/comments/1')
      .send(voteUpdate)
      .expect(200)
      .then((res) => {
        console.log(res.body, 'res in test');
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toEqual({
          comment_id: 1,
          body: 'I loved this game too!',
          votes: 17,
          author: 'bainesface',
          review_id: 2,
          created_at: '2017-11-22T00:00:00.000Z',
        });
      });
  });
});
describe('POST - api/reviews', () => {
  // TO ADD
  // REVIEW PREV POST
  // ADD REVIEWS - BODY TOO LONG // WRONG URL? // TOO FEW FIELDS // TOO MANY FIELDS
  test('status 201: requestbody accepts an object with: owner, title, review_body, designer, category and responds with the posted review with prev properties plus: review_id, votes, created_at, comment_count', () => {
    return request(app)
      .post(`/api/reviews/`)
      .send({
        owner: 'mallionaire',
        title: 'Hive',
        review_body: 'So much fun harnessing the power of the ant!',
        designer: 'Freakin Deakin',
        category: 'dexterity',
      })
      .expect(201)
      .then((res) => {
        console.log(res.body.review, 'res in testing');
        expect(res.body.review).toEqual({
          review_id: 14,
          title: 'Hive',
          review_body: 'So much fun harnessing the power of the ant!',
          designer: 'Freakin Deakin',
          review_img_url:
            'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
          votes: 0,
          category: 'dexterity',
          owner: 'mallionaire',
          created_at: expect.any(String),
          comment_count: 0,
        });
      });
  });
});

describe('POST/api/categories', () => {
  // CHECK POST REQUIREMENTS FROM OTHER TESTS
  test('Status 201:  accepts object and returns object of newly added category', () => {
    return request(app)
      .post('/api/categories')
      .send({
        slug: 'strategy',
        description: 'games of skill and wit',
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          slug: 'strategy',
          description: 'games of skill and wit',
        });
      });
  });
});

describe('DELETE - /api/reviews/:review_id', () => {
  // CHECK TESTS FROM OTHER DELETE BLOCKS
  test('status 204: deletes specified review from database and returns no content', () => {
    return request(app).delete('/api/reviews/3').expect(204);
  });
  test('status:404 and returns an error message to say couldnt delete as ID does not exist', () => {
    return request(app)
      .delete('/api/reviews/79')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('Nothing deleted - Review ID does not exist');
      });
  });
});
