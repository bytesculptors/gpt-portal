jest.setTimeout(30000);
import { INestApplication } from "@nestjs/common"
import { TestingModule, Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { setUp } from "../test-ormconfig"
import * as request from 'supertest'
import { Repository } from "typeorm"
import { User } from "../src/user/entities/user.entity"
import { getRepositoryToken } from "@nestjs/typeorm";

describe('Thread Controller (e2e)', () => {
  let app: INestApplication
  let userToken: string
  let adminToken: string
  let userRepository: Repository<User>

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
    adminToken = adminLoginResponse.body.access_token
    await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
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
      .post('/threads')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Discuss about natural disasters'
      })
  })

  describe('User testing', () => {
    it('should create a new thread', () => {
      return request(app.getHttpServer())
        .post('/threads')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Homework thread'
        })
        .expect(201)
    })

    it('should update a thread', () => {
      return request(app.getHttpServer())
        .patch('/threads/1')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Discuss about wild animals'
        })
        .expect(200)
    })

    it('should find a thread', () => {
      return request(app.getHttpServer())
        .get('/users/threads')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
    })

    it('should delete a thread', () => {
      return request(app.getHttpServer())
        .delete('/threads/1')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
    })
  })

  describe('Admin testing', () => {
    it('should return 404 as the username does not exist', () => {
      return request(app.getHttpServer())
        .get('/threads')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ username: 'ttn206' })
        .expect(404)
    })

    it('should find all threads', () => {
      return request(app.getHttpServer())
        .get('/threads')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
    })

    it('should find threads of an user', () => {
      return request(app.getHttpServer())
        .get('/threads')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ username: 'alex123' })
        .expect(200)
    })

    it('should find a thread with an id', () => {
      return request(app.getHttpServer())
        .get('/threads/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
    })
  })
})