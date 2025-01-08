import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo, TodoStatus } from './entities/todo.entity';
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
    todo.updatedAt = new Date();
    return await this.todosRepository.save(todo);
  }

  async remove(id: string): Promise<void> {
    const result = await this.todosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }
}