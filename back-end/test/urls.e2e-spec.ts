import 'dotenv/config'
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prismadb/prisma.service';

describe('Urls (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let createdShortCode: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        prisma = moduleFixture.get<PrismaService>(PrismaService);
        await prisma.url.deleteMany();
    });

    afterAll(async () => {
        await prisma.url.deleteMany();
        await app.close();
    });

    // --- POST /post/newURl ---
    describe('POST /post/newURl', () => {
        it('should create a short URL and return 201', async () => {
            const res = await request(app.getHttpServer())
                .post('/post/newURl')
                .send({ longetUrl: 'https://example.com/very/long/url' })
                .expect(201);

            expect(res.body).toHaveProperty('shortCode');
            expect(res.body).toHaveProperty('longUrl', 'https://example.com/very/long/url');
            expect(res.body).toHaveProperty('id');

            createdShortCode = res.body.shortCode;
        });

        it('should return 400 for missing longetUrl', async () => {
            await request(app.getHttpServer())
                .post('/post/newURl')
                .send({})
                .expect(400);
        });
    });

    // --- GET /urls ---
    describe('GET /urls', () => {
        it('should return 200 with a list of URLs', async () => {
            const res = await request(app.getHttpServer())
                .get('/urls')
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
        });

        it('should support pagination with page and limit', async () => {
            const res = await request(app.getHttpServer())
                .get('/urls?page=1&limit=5')
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeLessThanOrEqual(5);
        });
    });

    // --- GET /:shortCode ---
    describe('GET /:shortCode', () => {
        it('should redirect to the original URL', async () => {
            await request(app.getHttpServer())
                .get(`/${createdShortCode}`)
                .expect(302);
        });

        it('should return 404 for invalid short code', async () => {
            await request(app.getHttpServer())
                .get('/invalidcode999')
                .expect(404);
        });
    });
});