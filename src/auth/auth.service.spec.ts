import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CardTokenDto } from './dto/cardToken.dto';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AuthController } from './auth.controller';

// Añade la declaración de mockCacheData aquí
const mockCacheData: Record<string, any> = {};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              return mockCacheData[key];
            }),
            set: jest.fn().mockImplementation((key, value) => {
              mockCacheData[key] = value;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
describe('AuthController', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const mockJwtService = {
      signAsync: jest.fn().mockImplementation((payload, options) => {
        // Simula la firma de un token
        return 'mocked-token';
      }),
    };

    const mockCacheManager = {
      get: jest.fn().mockImplementation((key) => {
        // Simula obtener un valor del caché
        return mockCacheData[key];
      }),
      set: jest.fn().mockImplementation((key, value) => {
        // Simula establecer un valor en el caché
        mockCacheData[key] = value;
      }),
      // Otros métodos del CACHE_MANAGER que puedas necesitar...
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    authService = moduleFixture.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should return a token on successful registration', async () => {
      const cardToken: CardTokenDto = {
        email: 'test@gmail.com',
        card_number: 1234567890123456,
        cvv: 123,
        expiration_month: '12',
        expiration_year: '2023',
      };

      jest
        .spyOn(authService, 'register')
        .mockImplementationOnce(async () => ({ token: 'mockedToken' }));

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(cardToken)
        .expect(201);

      expect(response.body).toEqual({ token: 'mockedToken' });
    });

    
  });

  describe('POST /auth/get-card-data', () => {
    it('should return card data on successful verification', async () => {
      const mockToken = 'mockedToken';

      jest
        .spyOn(authService, 'verifyAndGetData')
        .mockImplementationOnce(async () => ({
          email: 'test@gmail.com',
          card_number: 1234567890123456,
          expiration_month: '12',
          expiration_year: '2023',
          token: mockToken,
        }));

      const response = await request(app.getHttpServer())
        .post('/auth/get-card-data')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(201);

      expect(response.body).toEqual({
        email: 'test@gmail.com',
        card_number: 1234567890123456,
        expiration_month: '12',
        expiration_year: '2023',
        token: mockToken,
      });
    });
  });
});
