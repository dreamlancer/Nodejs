const mongoose = require('mongoose');

const dbHandler = require('./db-handler');
const informationController = require('../controllers/information');
const informationModel = require('../models/information');

beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

// describe('information ', () => {

//     /**
//      * Tests that a valid information can be created through the informationService without throwing any errors.
//      */
//     it('can be created correctly', async () => {
//         expect(async () => await informationController.create(productComplete))
//             .not
//             .toThrow();
//     });
// });

// const productComplete = {
//     name: 'iPhone 11',
//     price: 699,
//     description: 'A new dual‑camera system captures more of what you see and love. '
// };

test("It adds two numbers", () => {
    expect(1 + 1).toBe(2);
});