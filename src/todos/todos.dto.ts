import { ApiProperty } from "@nestjs/swagger";

export class SwaggerCreateTodosDto {
  @ApiProperty({ name: 'id', required: true, type: String, minLength:4, maxLength: 36 })
  id: string;

  @ApiProperty({ name: 'name', required: true, type: String, minLength:4, maxLength: 36 })
  name: string;

  @ApiProperty({ name: 'description', required: false, type: String, default: '' })
  description: string;

  @ApiProperty({ name: 'startDateAt', required: false, type: Date })
  startDateAt: Date | string | null

  @ApiProperty({ name: 'dueDateAt', required: false, type: Date })
  dueDateAt: Date | string | null
}

export class SwaggerPutTodosDto {
  @ApiProperty({ name: 'name', required: true, type: String, minLength:4, maxLength: 36 })
  name: string;

  @ApiProperty({ name: 'description', required: false, type: String, default: '' })
  description: string;

  @ApiProperty({ name: 'startDateAt', required: false, type: Date })
  startDateAt: Date | string | null

  @ApiProperty({ name: 'dueDateAt', required: false, type: Date })
  dueDateAt: Date | string | null

  @ApiProperty({ name: 'status', required: false, type: String, enum: ["IN PROCESS", "DONE", "IDLE"] })
  status: string
}