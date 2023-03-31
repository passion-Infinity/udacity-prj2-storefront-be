# Build a StoreFront Backend
## How to use this project
- Port: 3000
- URL: http://localhost:3000

### Technologies
- PostgresSQL
- Nodejs Express
- Typescript
- Pool
- Jasmine

### Dependencies Installer

* Express
```bash
npm i express
npm i -D @types/express
```

* Typescript
```bash
npm i -D typescript
```

* Ts-watch
```bash
npm i ts-watch
```

* DB-migrate
```bash
npm i db-migrate
```

* Cors
```bash
npm i cors
npm i -D @types/cors
```

* Bcrypt
```bash
npm i bcrypt
npm i -D @types/bcrypt
```

* Jsonwebtoken
```bash
npm i jsonwebtoken
npm i -D @types/jsonwebtoken
```

* Dotenv
```bash
npm i -D dotenv
npm i -D @types/dotenv
```

* Nodemon
```bash
npm i -D nodemon
```

* Ts-node
```bash
npm i -D ts-node
npm i -D @types/node
```

* Jasmine
```bash
npm i jasmine
npm i -D @types/jasmine
```

* Supertest
```bash
npm i supertest
npm i -D @types/supertest
```

* Pg
```bash
npm i pg
npm i -D @types/pg
```

### Create default config file

* Add the default TypeScript configuration file (tsconfig.json)
```bash
npx tsc --init
```

### Connect to Postgres (Localhost)

* Run docker-compose
```bash
docker-compose up
```

* Access to docker container
```bash
docker exec -it <container_name> bash/sh
```

* Connect to postgres
```bash
psql postgresql://<username>:<password>@localhost:<port>/postgres
psql postgresql://storefront@localhost:5432/postgres
```