jest.setTimeout(30000)
import { INestApplication } from "@nestjs/common"
import { TestingModule, Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { setUp } from "../test-ormconfig"
import * as request from 'supertest'
import { User } from "../src/user/entities/user.entity"
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm";

describe('Message Controller (e2e)', () => {
  let app: INestApplication
  let userRepository: Repository<User>
  let userToken: string

  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    await setUp()

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = moduleFixture.createNestApplication()
    await app.init()

    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'john123',
        password: '1234'
      })
    await request(app.getHttpServer())
      .post('/user/register')
      .set('Authorization', `Bearer ${adminLoginResponse.body.access_token}`)
      .send({
        email: 'tuannghia200603@gmail.com',
        username: 'alex123',
        password: '1234',
        role: 'user'
      })
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    const user = await userRepository.findOneBy({ username: 'alex123' })
    await userRepository.update(user.id, { isVerified: true })

    const userLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'alex123',
        password: '1234'
      })
    userToken = userLoginResponse.body.access_token
    await request(app.getHttpServer())
      .post('/thread/create')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Discuss about natural disasters'
      })
    await request(app.getHttpServer())
      .post('/message/send/1')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        content: 'What is natural disasters?'
      })
  })

  it('should send a message to the thread', async () => {
    await request(app.getHttpServer())
      .post('/message/send/1')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        content: 'What is natural disasters?'
      })
      .expect(201)
  })

  it('should get all messages of a thread', async () => {
    await request(app.getHttpServer())
      .get('/message/getMessages/1')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
  })
})