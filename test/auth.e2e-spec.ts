import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 25000);

  it('handles a singup request', () => {
    const username = 'username';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ username, password: '1234567' })
      .expect(201)
      .then((res) => {
        const { id, username } = res.body;
        expect(id).toBeDefined();
        expect(username).toEqual(username);
      });
  });
});
