import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { setUp } from '../test-ormconfig'
import * as request from 'supertest'

describe('User Controller (e2e)', () => {
  let app: INestApplication
  let token: string

  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    await setUp()

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = moduleFixture.createNestApplication()
    await app.init()
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'john123',
        password: '1234'
      })
    token = loginResponse.body.access_token
  })

  // it('should be done', () => {
  //   console.log('Run successfully!!');
  // })

  it('should register a new user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'tuannghia200603@gmail.com',
        username: 'alex123',
        password: '1234',
        role: 'user'
      })
      .expect(201)
  })

  it('should find all users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

})