import { Body, Controller, Get, Post, Put, Delete, Param, Query, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { TodosService } from './todos.service';
import { ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { SwaggerCreateTodosDto, SwaggerPutTodosDto } from './todos.dto';
import * as Joi from 'joi';
import { ITodoItem } from './interfaces/todo-item.interface';
import { ITodoList } from './interfaces/todo-list.interface';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService){}

  @Post()
  @HttpCode(201)
  @ApiConsumes('application/x-www-form-urlencoded')
  async create(@Body() todo: SwaggerCreateTodosDto) {
    const params = Joi.object({
      id: Joi.string().min(4).max(36).required(),
      name: Joi.string().min(4).max(36).required(),
      description: Joi.string().default(''),
      startDateAt: Joi.date().valid(null),
      dueDateAt: Joi.date().valid(null)
    }).validate(todo);
    if(params.error) throw new HttpException({ status: 400, error: "Bad Request"}, HttpStatus.BAD_REQUEST);

    console.log(params.value)
  }

  @Get()
  @ApiQuery({ name: 'status', required: false, type: String, enum:["IN PROCESS", "DONE", "IDLE"]})
  async findAll(@Query('status') status: string) {
    console.log(status)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
throw new HttpException({
status: HttpStatus.NOT_FOUND,
error: "Not Found"
}, HttpStatus.NOT_FOUND);
  }

  @Put(':id')
  @ApiConsumes('application/x-www-form-urlencoded')
  async update(@Param('id') id: string, @Body() todo: SwaggerPutTodosDto) {
    const params = Joi.object({
      name: Joi.string().min(4).max(36),
      description: Joi.string(),
      startDateAt: Joi.date().valid(null),
      dueDateAt: Joi.date().valid(null),
      status: Joi.valid("IN PROCESS", "DONE", "IDLE")
    }).validate(todo);
    if(params.error) throw new HttpException({ status: 400, error: "Bad Request"}, HttpStatus.BAD_REQUEST);

    console.log(params.value)
  }

  @Delete(':id')
  async remove(@Param('id') id: string){
  }

}