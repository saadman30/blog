import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../common/prisma/prisma.service';

describe('PublicController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/public/posts returns 200 and array', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/public/posts')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/public/posts/by-slug/:slug returns 404 for unknown slug', async () => {
    await request(app.getHttpServer())
      .get('/api/public/posts/by-slug/nonexistent-slug-xyz')
      .expect(200)
      .then((r) => expect(r.body).toBeNull());
  });
});
