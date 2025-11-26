import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CompletionService } from './completion.service';
import { CreateCompletionDto } from './dto/create-completion.dto';
import { UpdateCompletionDto } from './dto/update-completion.dto';

@Controller('api/completion')
export class CompletionController {
  constructor(private readonly completionService: CompletionService) {}

  // @Post()
  // create(@Body() createCompletionDto: CreateCompletionDto) {
  //   return this.completionService.create(createCompletionDto);
  // }

  // @Get()
  // findAll() {
  //   return this.completionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.completionService.findOne(+id);
  // }

  @Post(':id')
  update(@Param('id') id: string, @Req() req) {
    return this.completionService.create(id, req.user.id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.completionService.remove(+id);
  // }
}
