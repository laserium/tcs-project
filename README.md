## 기능

- **Todo 생성**: 새로운 Todo 아이템을 생성할 수 있습니다.
- **Todo 조회**: 모든 Todo 리스트를 조회하거나 상태별로 필터링할 수 있습니다.
- **Todo 상세 조회**: 특정 ID를 가진 Todo 아이템의 상세 정보를 조회합니다.
- **Todo 업데이트**: 특정 Todo 아이템의 정보를 수정합니다.
- **Todo 삭제**: 특정 Todo 아이템을 삭제합니다.

## 기술 스택

- **프레임워크**: [NestJS](https://nestjs.com/)
- **언어**: TypeScript
- **데이터베이스**: PostgreSQL
- **ORM**: TypeORM
- **API 문서화**: Swagger (`@nestjs/swagger`)
- **유효성 검사**: `class-validator`, `class-transformer`

## 설치 및 실행 방법

### 사전 요구사항

- Node.js >= 18
- npm
- PostgreSQL 데이터베이스

### 의존성 설치


```bash
npm install --save @nestjs/config
npm install --save @nestjs/typeorm typeorm pg
npm install --save joi
```


### 환경 변수 설정

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=your_database
```

### 데이터베이스 설정

PostgreSQL에 지정한 데이터베이스를 생성합니다.

```sql
CREATE DATABASE your_database;
```

### 애플리케이션 실행

개발 환경에서 애플리케이션을 실행하려면:

```bash
npm run start:dev
```

애플리케이션은 기본적으로 `http://localhost:3000`에서 실행됩니다.

### API 문서 확인

애플리케이션이 실행 중일 때, Swagger UI를 통해 API 문서를 확인할 수 있습니다:

```
http://localhost:3000/api
```

## 디렉토리 구조

```
src/
 ├── app.module.ts
 ├── main.ts
 └── todos/
     ├── todos.controller.ts
     ├── todos.service.ts
     ├── todos.module.ts
     ├── todo.entity.ts
     └── todos.dto.ts
```

## 주요 의존성 버전

- `@nestjs/common`: ^7.0.0
- `@nestjs/core`: ^7.0.0
- `@nestjs/typeorm`: ^7.0.0
- `@nestjs/swagger`: ^4.0.0
- `typeorm`: ^0.2.0
- `pg`: ^8.0.0
- `class-transformer`: ^0.2.3

## 참고 자료

- **NestJS 공식 문서**: [https://docs.nestjs.com/](https://docs.nestjs.com/)
- **TypeORM 공식 문서**: [https://typeorm.io/](https://typeorm.io/)
- **PostgreSQL 공식 사이트**: [https://www.postgresql.org/](https://www.postgresql.org/)
- **Swagger를 사용한 API 문서화**: [https://docs.nestjs.com/openapi/introduction](https://docs.nestjs.com/openapi/introduction)

## 문제 해결

### `TodosService`에서 `TodoRepository` 주입 오류

- **원인**: `TodosModule`에서 `TypeOrmModule.forFeature([Todo])`를 `imports`에 추가하지 않아 `TodoRepository`를 주입받을 수 없었습니다.
- **해결 방법**: `todos.module.ts`에 `TypeOrmModule.forFeature([Todo])`를 추가하여 문제를 해결했습니다.

### `Bad Request` 에러 발생 시 디버깅

- **원인**: 요청 데이터가 유효성 검사를 통과하지 못해 400 에러가 발생했습니다.
- **해결 방법**:
  - 요청 데이터가 유효성 검사 스키마에 맞는지 확인했습니다.
  - `Joi` 스키마를 수정하여 NestJS의 유효성 검사 방식을 따랐습니다.
