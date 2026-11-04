import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { BikesService } from "./bikes.service";
import { CreateBikeDto } from "./dto/create-bike.dto";
import { UpdateBikeDto } from "./dto/update-bike.dto";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";

@Controller("bikes")
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Get()
  findPage(@Query() query: PaginationQueryDto) {
    return this.bikesService.findPage(query.page, query.limit);
  }

  @Get(":id")
  findById(@Param("id", ParseUUIDPipe) id: string) {
    return this.bikesService.findById(id);
  }

  @Post()
  create(@Body() body: CreateBikeDto) {
    return this.bikesService.create(body);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdateBikeDto,
  ) {
    return this.bikesService.update(id, body);
  }

  @Delete(":id")
  delete(@Param("id", ParseUUIDPipe) id: string) {
    return this.bikesService.delete(id);
  }
}