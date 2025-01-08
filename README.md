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

## 주요 코드 설명

### REST API 생성 방법

이 섹션에서는 프로젝트에서 REST API를 어떻게 만들었는지 단계별로 설명합니다.

#### Todos 모듈 생성

NestJS CLI를 사용하여 `todos` 모듈을 생성합니다.

```bash
nest generate module todos
```

#### 컨트롤러 및 서비스 생성

`todos` 모듈 내에 컨트롤러와 서비스를 생성합니다.

```bash
nest generate controller todos --no-spec
nest generate service todos --no-spec
```

#### 엔티티(Entity) 생성 및 설정

`Todo` 엔티티를 정의하여 데이터베이스 테이블과 매핑합니다.

```typescript
// src/todos/todo.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TodoStatus {
  IN_PROCESS = 'IN PROCESS',
  DONE = 'DONE',
  IDLE = 'IDLE',
}

@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36 })
  name: string;

  @Column('text', { default: '' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  startDateAt: Date | null;

  @Column({ nullable: true })
  dueDateAt: Date | null;

  @Column({
    type: 'enum',
    enum: TodoStatus,
    default: TodoStatus.IDLE,
  })
  status: TodoStatus;
}
```

#### TypeORM 설정

`app.module.ts`와 `todos.module.ts`에서 TypeORM을 설정하고 `Todo` 엔티티를 등록합니다.

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './todos/todos.module';
import { Todo } from './todos/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'root',
      database: process.env.DATABASE_NAME || 'tcs_project',
      entities: [Todo],
      synchronize: true,
      logging: true,
    }),
    TodosModule,
  ],
})
export class AppModule {}
```

```typescript
// src/todos/todos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { Todo } from './todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
```

#### DTO(Data Transfer Object) 정의

요청 데이터의 유효성 검사를 위해 DTO를 정의하고 `class-validator` 데코레이터를 사용합니다.

```typescript
// src/todos/todos.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  Length,
  IsEnum,
} from 'class-validator';
import { TodoStatus } from './todo.entity';

export class SwaggerCreateTodosDto {
  @ApiProperty({
    name: 'name',
    required: true,
    type: String,
    minLength: 4,
    maxLength: 36,
  })
  @IsString()
  @Length(4, 36)
  name: string;

  @ApiProperty({
    name: 'description',
    required: false,
    type: String,
    default: '',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ name: 'startDateAt', required: false, type: Date })
  @IsOptional()
  @IsDateString()
  startDateAt?: string | null;

  @ApiProperty({ name: 'dueDateAt', required: false, type: Date })
  @IsOptional()
  @IsDateString()
  dueDateAt?: string | null;

  @ApiProperty({
    name: 'status',
    required: false,
    type: String,
    enum: ['IN PROCESS', 'DONE', 'IDLE'],
  })
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}

export class SwaggerPutTodosDto {
  @ApiProperty({
    name: 'name',
    required: false,
    type: String,
    minLength: 4,
    maxLength: 36,
  })
  @IsOptional()
  @IsString()
  @Length(4, 36)
  name?: string;

  @ApiProperty({
    name: 'description',
    required: false,
    type: String,
    default: '',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ name: 'startDateAt', required: false, type: Date })
  @IsOptional()
  @IsDateString()
  startDateAt?: string | null;

  @ApiProperty({ name: 'dueDateAt', required: false, type: Date })
  @IsOptional()
  @IsDateString()
  dueDateAt?: string | null;

  @ApiProperty({
    name: 'status',
    required: false,
    type: String,
    enum: ['IN PROCESS', 'DONE', 'IDLE'],
  })
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}
```

#### 서비스 구현

`TodosService`에서 비즈니스 로직을 처리하고, TypeORM `Repository`를 사용하여 데이터베이스와 상호 작용합니다.

```typescript
// src/todos/todos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { SwaggerCreateTodosDto, SwaggerPutTodosDto } from './todos.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: SwaggerCreateTodosDto): Promise<Todo> {
    const todo = this.todosRepository.create(createTodoDto);
    return await this.todosRepository.save(todo);
  }

  async findMany(status?: string): Promise<Todo[]> {
    const query = this.todosRepository.createQueryBuilder('todo');
    if (status) {
      query.where('todo.status = :status', { status });
    }
    return await query.getMany();
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todosRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async update(id: string, updateTodoDto: SwaggerPutTodosDto): Promise<Todo> {
    const todo = await this.findOne(id);
    Object.assign(todo, updateTodoDto);
    return await this.todosRepository.save(todo);
  }

  async remove(id: string): Promise<void> {
    const result = await this.todosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }
}
```

#### 컨트롤러 구현

`TodosController`에서 HTTP 요청을 처리하고, 서비스 메서드를 호출하여 응답합니다.

```typescript
// src/todos/todos.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  HttpCode,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { SwaggerCreateTodosDto, SwaggerPutTodosDto } from './todos.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @HttpCode(201)
  @ApiConsumes('application/x-www-form-urlencoded')
  async create(@Body() todo: SwaggerCreateTodosDto) {
    return await this.todosService.create(todo);
  }

  @Get()
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    enum: ['IN PROCESS', 'DONE', 'IDLE'],
  })
  async findMany(@Query('status') status: string) {
    return await this.todosService.findMany(status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.todosService.findOne(id);
  }

  @Put(':id')
  @ApiConsumes('application/x-www-form-urlencoded')
  async update(
    @Param('id') id: string,
    @Body() todo: SwaggerPutTodosDto,
  ) {
    return await this.todosService.update(id, todo);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.todosService.remove(id);
    return { message: 'Todo deleted successfully' };
  }
}
```

#### Swagger를 통한 API 문서화

`@nestjs/swagger`와 Swagger UI를 사용하여 API 문서를 생성하고 확인할 수 있도록 설정합니다.

- 위의 `main.ts`에서 Swagger 설정을 추가했습니다.
- 각 컨트롤러와 DTO에 `@ApiProperty`, `@ApiConsumes`, `@ApiQuery` 등의 Swagger 데코레이터를 사용하여 API 문서를 풍부하게 만들었습니다.

### 엔티티(Entity) 정의 및 테이블 자동 생성

- 엔티티를 정의하고 `TypeOrmModule.forFeature([엔티티])`에 등록하면 TypeORM은 자동으로 데이터베이스에 해당 테이블을 생성합니다.
- `synchronize: true` 옵션을 활성화하여 애플리케이션이 시작될 때 엔티티 정의에 따라 데이터베이스 스키마를 동기화합니다.
- **주의:** `synchronize: true` 옵션은 개발 환경에서만 사용하는 것이 좋습니다. 프로덕션 환경에서는 데이터베이스 마이그레이션을 사용하는 것이 안전합니다.

## 디렉토리 구조

```
src/
 ├── app.module.ts
 ├── main.ts
 └── todos/
     ├── todo.entity.ts
     ├── todos.controller.ts
     ├── todos.dto.ts
     ├── todos.module.ts
     └── todos.service.ts
```

## 주요 의존성 버전

- `@nestjs/common`: ^7.0.0
- `@nestjs/core`: ^7.0.0
- `@nestjs/typeorm`: ^7.0.0
- `@nestjs/swagger`: ^4.0.0
- `typeorm`: ^0.2.29
- `pg`: ^8.0.0
- `class-validator`: ^0.12.2
- `class-transformer`: ^0.2.3

## 설치된 npm 패키지

프로젝트 개발 중 설치한 npm 패키지들은 다음과 같습니다:

1. **NestJS 및 핵심 의존성**

   ```bash
   npm install @nestjs/common @nestjs/core @nestjs/platform-express
   ```

2. **TypeORM 및 PostgreSQL 드라이버**

   ```bash
   npm install @nestjs/typeorm typeorm pg
   ```

3. **유효성 검사 및 변환 패키지**

   ```bash
   npm install class-validator class-transformer
   ```

4. **Swagger를 사용한 API 문서화**

   ```bash
   npm install @nestjs/swagger swagger-ui-express
   ```

5. **Reflect Metadata**

   ```bash
   npm install reflect-metadata
   ```

6. **개발 관련 패키지**

   ```bash
   npm install --save-dev typescript ts-node
   ```

7. **Joi**

   ```bash
   npm install joi
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
