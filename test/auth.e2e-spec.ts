import { INestApplication } from "@nestjs/common"
import { TestingModule, Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { setUp } from "../test-ormconfig"
import * as request from 'supertest'

describe('Auth controller (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    await setUp()

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('should login successfully', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'john123',
        password: '1234'
      })
      .expect(200)
  })
})