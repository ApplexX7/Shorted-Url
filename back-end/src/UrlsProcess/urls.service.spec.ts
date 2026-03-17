import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { PrismaService } from '../prismadb/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
    url: {
        findMany: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
    },
};

describe('UrlsService', () => {
    let service: UrlsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UrlsService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<UrlsService>(UrlsService);
    });

    afterEach(() => jest.clearAllMocks());

    // --- getUrls ---
    describe('getUrls', () => {
        it('should return a list of URLs', async () => {
            const mockUrls = [
                { id: 1, shortCode: 'abc123', longUrl: 'https://example.com', createdAt: new Date() },
                { id: 2, shortCode: 'xyz789', longUrl: 'https://google.com', createdAt: new Date() },
            ];
            mockPrismaService.url.findMany.mockResolvedValue(mockUrls);

            const result = await service.getUrls(1, 15);

            expect(result).toEqual(mockUrls);
            expect(mockPrismaService.url.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: 'desc' },
                skip: 0,
                take: 15,
            });
        });

        it('should return empty array when no URLs exist', async () => {
            mockPrismaService.url.findMany.mockResolvedValue([]);
            const result = await service.getUrls(1, 15);
            expect(result).toEqual([]);
        });

        it('should skip correctly for page 2', async () => {
            mockPrismaService.url.findMany.mockResolvedValue([]);
            await service.getUrls(2, 15);
            expect(mockPrismaService.url.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: 'desc' },
                skip: 15,
                take: 15,
            });
        });
    });

    // --- shortedNewUrls ---
    describe('shortedNewUrls', () => {
        it('should create and return a new short URL', async () => {
            const longUrl = 'https://example.com/very/long/url';
            const mockCreated = {
                id: 1,
                shortCode: 'abc123',
                longUrl,
                createdAt: new Date(),
            };
            mockPrismaService.url.create.mockResolvedValue(mockCreated);

            const result = await service.shortedNewUrls(longUrl);

            expect(result).toEqual(mockCreated);
            expect(mockPrismaService.url.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ longUrl }),
            });
        });

        it('should generate a shortCode automatically', async () => {
            const longUrl = 'https://example.com';
            mockPrismaService.url.create.mockImplementation(({ data }) =>
                Promise.resolve({ id: 1, ...data, createdAt: new Date() })
            );

            const result = await service.shortedNewUrls(longUrl);

            expect(result.shortCode).toBeDefined();
            expect(result.shortCode.length).toBeGreaterThan(0);
        });
    });

    // --- findUrl ---
    describe('findUrl', () => {
        it('should return the long URL for a valid short code', async () => {
            const mockUrl = {
                id: 1,
                shortCode: 'abc123',
                longUrl: 'https://example.com',
                createdAt: new Date(),
            };
            mockPrismaService.url.findUnique.mockResolvedValue(mockUrl);

            const result = await service.findUrl('abc123');

            expect(result).toBe('https://example.com');
            expect(mockPrismaService.url.findUnique).toHaveBeenCalledWith({
                where: { shortCode: 'abc123' },
            });
        });

        it('should throw NotFoundException for invalid short code', async () => {
            mockPrismaService.url.findUnique.mockResolvedValue(null);
            await expect(service.findUrl('invalid')).rejects.toThrow(NotFoundException);
        });
    });
});