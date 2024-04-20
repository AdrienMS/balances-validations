import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  it('(GET) /', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('(POST) /movements/validation - No Body', () => {
    return request(app.getHttpServer())
      .post('/movements/validation')
      .expect(HttpStatus.I_AM_A_TEAPOT)
      .expect({
        message: `I'm a teapot`,
        reasons: [
          {
            reason: 'Incorrect parameter',
            detail: 'movements must be an array',
          },
          {
            reason: 'Incorrect parameter',
            detail: 'balances must contain at least 2 elements',
          },
          {
            reason: 'Incorrect parameter',
            detail: 'balances must be an array',
          },
        ],
      });
  });

  it('(POST) /movements/validation - balances empty', () => {
    return request(app.getHttpServer())
      .post('/movements/validation')
      .send({ movements: [], balances: [] })
      .expect(HttpStatus.I_AM_A_TEAPOT)
      .expect({
        message: `I'm a teapot`,
        reasons: [
          {
            reason: 'Incorrect parameter',
            detail: 'balances must contain at least 2 elements',
          },
        ],
      });
  });

  it('(POST) /movements/validation - date empty and balance is string on balance', () => {
    return request(app.getHttpServer())
      .post('/movements/validation')
      .send({ movements: [], balances: [{ balance: 'test' }] })
      .expect(HttpStatus.I_AM_A_TEAPOT)
      .expect({
        message: `I'm a teapot`,
        reasons: [
          {
            reason: 'Incorrect parameter',
            detail: 'balances.0.date must be a Date instance',
          },
          {
            reason: 'Incorrect parameter',
            detail:
              'balances.0.balance must be a number conforming to the specified constraints',
          },
        ],
      });
  });

  it('(POST) /movements/validation - movements missing some properties', () => {
    return request(app.getHttpServer())
      .post('/movements/validation')
      .send({
        movements: [
          {
            date: new Date('2024-05-03T00:00:00.000Z'),
            wording: 'D',
            amount: 80,
          },
          {
            id: 'test',
            date: 'test',
            wording: 'D',
            amount: 80,
          },
          {
            id: 4,
            date: new Date('2024-05-03T00:00:00.000Z'),
            wording: 80,
            amount: 'test',
          },
        ],
        balances: [{ balance: 'test' }],
      })
      .expect(HttpStatus.I_AM_A_TEAPOT)
      .expect({
        message: "I'm a teapot",
        reasons: [
          {
            reason: 'Incorrect parameter',
            detail:
              'movements.0.id must be a number conforming to the specified constraints',
          },
          {
            reason: 'Incorrect parameter',
            detail:
              'movements.1.id must be a number conforming to the specified constraints',
          },
          {
            reason: 'Incorrect parameter',
            detail: 'movements.1.date must be a Date instance',
          },
          {
            reason: 'Incorrect parameter',
            detail:
              'movements.2.amount must be a number conforming to the specified constraints',
          },
          {
            reason: 'Incorrect parameter',
            detail: 'balances.0.date must be a Date instance',
          },
          {
            reason: 'Incorrect parameter',
            detail:
              'balances.0.balance must be a number conforming to the specified constraints',
          },
        ],
      });
  });
});
