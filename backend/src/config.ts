export default () => ({
    secretKey: process.env.JWT_SECRET || 'secretKey',
    port: parseInt(process.env.SERVER_PORT, 10),
    db: {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      name: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
  });