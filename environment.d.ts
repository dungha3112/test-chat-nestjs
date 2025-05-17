declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number;
    DATABASE_URL: string;

    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES_IN: string;

    REFRESH_TOKEN_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: string;

    CRYPTO_KEY: string;
    // REDIS_HOST: string;
    // REDIS_PORT: number;
    // REDIS_PASSWORD: string;
  }
}
