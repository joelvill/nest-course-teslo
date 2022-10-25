import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTable();

    const adminUser = await this.insertUser();

    this.insertNewProducts(adminUser);

    return `SEED EXECUTE SUCCESS`;
  }

  private async deleteTable() {
    await this.productService.deleteAllProducts();

    const queryRunner = this.userRepository.createQueryBuilder();
    await queryRunner.delete().where({}).execute();
  }

  private async insertUser() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(seedUsers);

    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromise = [];
    products.forEach((product) => {
      insertPromise.push(this.productService.create(product, user));
    });

    await Promise.all(insertPromise);

    return true;
  }
}
