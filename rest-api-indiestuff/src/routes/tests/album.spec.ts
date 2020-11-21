// import 'module-alias/register';

import { assert } from 'chai';
import { checkJwt } from '../../middlewares/checkJwt';
import * as jwt from "jsonwebtoken";

import {Album}  from '../../entity/Album';
import { TestFactory } from '../../test-utilities/testFactory';

const chai = require('chai')
  ,spies = require('chai-spies');

chai.use(spies);

describe('Testing user component', () => {
    // Create instances
    let thisTimeout;
    const factory: TestFactory = new TestFactory();
    const testAlbum: Album = Album.mockTestAlbum();
    const testAlbumModified: Album = { ...testAlbum, title: 'mockAlbumTitleModified' };
    const token = "some token";


    before(async () => {
        await factory.init();
        thisTimeout = setTimeout(() => {
            factory.close();
        }, 10000);
    });

    afterEach(async () => {
        clearTimeout(thisTimeout);
        await factory.close();
    });

    describe('POST /album', () => {
        it('responds with status 401', (done) => {
            // chai.spy.on(jwt, 'verify', () => false);
            factory.app
                .post('/album/edit')
                .set({ "Authorization": `Bearer ${token}` })
                .send()
                .set('Accept', 'application/json')
                .expect('Content-Type', "text/html; charset=utf-8")
                .expect(401, done);
        });
    });
});