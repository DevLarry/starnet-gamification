import { PartialType } from '@nestjs/swagger';
import { CreateCompletionDto } from './create-completion.dto';

export class UpdateCompletionDto extends PartialType(CreateCompletionDto) {}
