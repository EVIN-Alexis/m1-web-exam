import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { BikeEntity } from "./entities/bike.entity";
import type {
  BikeModel,
  BikesPageModel,
  CreateBikeModel,
  UpdateBikeModel,
} from "./models/bike.model";
import { BikeSellEntity } from "../customers/entities/bike-sell.entity";

@Injectable()
export class BikesRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findPage(page: number, limit: number): Promise<BikesPageModel> {
    const [entities, totalCount] = await this.dataSource
      .getRepository(BikeEntity)
      .findAndCount({
        order: {
          brand: "ASC",
          model: "ASC",
          id: "ASC",
        },
        skip: (page - 1) * limit,
        take: limit,
      });

    return {
      totalCount,
      bikes: entities.map((entity) => this.toBikeModel(entity)),
    };
  }

  async findById(id: string): Promise<BikeModel | null> {
    const entity = await this.dataSource
      .getRepository(BikeEntity)
      .findOneBy({ id });

    return entity ? this.toBikeModel(entity) : null;
  }

  async create(input: CreateBikeModel): Promise<BikeModel> {
    const repository = this.dataSource.getRepository(BikeEntity);
    const entity = repository.create(input);
    const savedEntity = await repository.save(entity);

    return this.toBikeModel(savedEntity);
  }

  async update(
    id: string,
    input: UpdateBikeModel,
  ): Promise<BikeModel | null> {
    const repository = this.dataSource.getRepository(BikeEntity);
    const entity = await repository.findOneBy({ id });

    if (!entity) {
      return null;
    }

    repository.merge(entity, input);
    const savedEntity = await repository.save(entity);

    return this.toBikeModel(savedEntity);
  }

  async delete(id: string): Promise<"deleted" | "not_found" | "already_sold"> {
      return this.dataSource.transaction(async (manager) => {
        const bikeRepository = manager.getRepository(BikeEntity);
        const saleRepository = manager.getRepository(BikeSellEntity);
    
        const bike = await bikeRepository.findOneBy({ id });
    
        if (!bike) {
          return "not_found";
        }
    
        const saleExists = await saleRepository.exist({
          where: { bikeId: id },
        });
    
        if (saleExists) {
          return "already_sold";
        }
    
        await bikeRepository.remove(bike);
    
        return "deleted";
      });
    }

  private toBikeModel(entity: BikeEntity): BikeModel {
    return {
      id: entity.id,
      brand: entity.brand,
      model: entity.model,
      description: entity.description,
      category: entity.category,
      frameMaterial: entity.frameMaterial,
      frameSizeCm: entity.frameSizeCm,
      wheelSizeInches: entity.wheelSizeInches,
      gearCount: entity.gearCount,
      weightKg: entity.weightKg,
      electric: entity.electric,
      priceCents: entity.priceCents,
    };
  }
}