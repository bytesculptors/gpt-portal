## Description

A chat application which is similar to ChatGPT with streaming answering using OpenAI key.
Tech stack: NestJS, PostgreSQL

## Environment file
Create .env file in the root folder with the following information (contact me for real information key if needed)
```bash
OPENAI_API_KEY=<YOUR_OPEN_AI_KEY>
DB_TYPE=<YOUR_DATABASE_TYPE>
DB_NAME=<YOUR_DATABASE_NAME>
DB_HOST=<YOUR_DATABASE_HOST>
DB_TEST=<YOUR_DATABASE_TEST_NAME>
DB_USERNAME=<YOUR_DATABASE_USERNAME>
DB_PASSWORD=<YOUR_DATABASE_PASSWORD>
DB_PORT=<YOUR_DATABASE_PORT>

EMAIL_USER=<YOUR_EMAIL_ADDRESS>
EMAIL_AUTH_PASS=<YOUR_EMAIL_AUTH_KEY>
```

## Installation

```bash
$ git clone https://github.com/bytesculptors/gpt-portal
$ cd gpt-portal
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```
