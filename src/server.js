const { createServer } = require('http');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();

  return app.getHttpAdapter().getInstance();
}

createServer(async (req, res) => {
  const appInstance = await bootstrap();
  appInstance(req, res);
}).listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});
