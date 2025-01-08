import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
 imports: [TodosModule,
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'tcs_project',
    entities: [],
    synchronize: true,
    logging: true,
    keepConnectionAlive: true,
  }),
],

})
export class AppModule {}
