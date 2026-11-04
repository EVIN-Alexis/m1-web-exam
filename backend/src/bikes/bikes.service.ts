import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { BikesRepository } from "./bikes.repository";
import type {
  BikeModel,
  BikesPageModel,
  CreateBikeModel,
  UpdateBikeModel,
} from "./models/bike.model";

@Injectable()
export class BikesService {
  constructor(private readonly bikesRepository: BikesRepository) {}

  findPage(page: number, limit: number): Promise<BikesPageModel> {
    return this.bikesRepository.findPage(page, limit);
  }

  async findById(id: string): Promise<BikeModel> {
    const bike = await this.bikesRepository.findById(id);

    if (!bike) {
      throw new NotFoundException("Bike not found");
    }

    return bike;
  }

  create(input: CreateBikeModel): Promise<BikeModel> {
    return this.bikesRepository.create(input);
  }

  async update(id: string, input: UpdateBikeModel): Promise<BikeModel> {
    if (Object.keys(input).length === 0) {
      throw new BadRequestException("No fields provided");
    }

    const bike = await this.bikesRepository.update(id, input);

    if (!bike) {
      throw new NotFoundException("Bike not found");
    }

    return bike;
  }

  async delete(id: string): Promise<void> {
      const result = await this.bikesRepository.delete(id);
    
      if (result === "not_found") {
        throw new NotFoundException("Bike not found");
      }
  
      if (result === "already_sold") {
        throw new ConflictException("Cannot delete a bike that has been sold");
      }
    }
}