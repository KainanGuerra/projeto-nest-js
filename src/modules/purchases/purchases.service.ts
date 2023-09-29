import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchasesEntity } from 'src/entities/purchases.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { HProductsFunctions } from 'src/shared/helpers/calculators/products-functions.helper';
import { IPurchaseProducts } from 'src/shared/utils/interfaces/purchase-products.interface';
import { PurchaseItemsCreateInstanceDTO } from 'src/shared/utils/dto/purchases/purchase-items-create-instance.dto';
import { EPurchaseStatus } from 'src/shared/utils/enums/purchase-status-dictionary.enum';
import { AppError } from 'src/shared/handlers/AppError';
import { UpdatePurchaseStatusDTO } from 'src/shared/utils/dto/purchases/update-purchase-status.dto';
import { ErrorHandler } from 'src/shared/handlers/ErrorHandler';
import { UpdateUserDTO } from 'src/shared/utils/dto/users/update-user.dto';
import { ProductsEntity } from 'src/entities/products.entity';
import { UsersEntity } from 'src/entities/user.entity';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(PurchasesEntity)
    private readonly purchasesRepository: Repository<PurchasesEntity>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async findAll() {
    return await this.purchasesRepository.find();
  }

  async findMany(user: any) {
    return await this.purchasesRepository.find({
      where: { user: user },
    });
  }

  // async store({ data, user }: IPurchaseProducts) {
  //   try {
  //     const userInstance = await this.usersService.findOneOrFail({
  //       email: user.email,
  //     });
  //     const { products, discount, deliveryAddress } = data;
  //     const allProducts =
  //       await this.productsService.findProductsByIds(products);
  //     const rawValue = HProductsFunctions.sumProductsValue(allProducts);
  //     const finalValue = HProductsFunctions.calculateFinalValue(
  //       rawValue,
  //       discount,
  //     );
  //     const purchaseToBeCreated: PurchaseItemsCreateInstanceDTO = {
  //       products,
  //       discount,
  //       finalValue,
  //       deliveryAddress,
  //       rawValue,
  //       status: EPurchaseStatus.CREATED,
  //       user,
  //     };
  //     const body = await this.purchasesRepository.create([purchaseToBeCreated]);
  //     const salesCount = userInstance.sales_count + 1;
  //     const increasesSalesCount: UpdateUserDTO = {
  //       sales_count: salesCount,
  //     };
  //     await this.usersService.update(user.id, increasesSalesCount);
  //     return await this.purchasesRepository.save(body);
  //   } catch (err) {
  //     ErrorHandler(err);
  //   }
  // }

  async updatePurchase({ id, status }: UpdatePurchaseStatusDTO) {
    try {
      const purchase = await this.purchasesRepository.findOneOrFail({
        where: id,
      });
      if (purchase.status != EPurchaseStatus.AWAITING_PAYMENT) {
        throw new AppError(`The purchase with id ${id} has been `, 400);
      }
      return await this.purchasesRepository.merge(purchase, { status });
    } catch (err) {
      return ErrorHandler(err);
    }
  }

  async store({ data, user }: IPurchaseProducts) {
    try {
      const userInstance = await this.getUserInstance(user.email);
      let purchaseStatus = EPurchaseStatus.CREATED;
      const { products, discount, deliveryAddress } = data;
      const allProducts = await this.getAllProducts(products);
      const { rawValue, finalValue } = this.calculateFinalAndRawValue(
        discount,
        allProducts,
      );

      // defines different status if user has already created first purchase
      if (userInstance.sales_count > 0)
        purchaseStatus = EPurchaseStatus.AWAITING_PAYMENT;

      const purchaseToBeCreated = this.createPurchaseItem({
        products,
        discount,
        finalValue,
        deliveryAddress,
        rawValue,
        user,
        status: purchaseStatus,
      });
      const savedPurchase = await this.savePurchase(purchaseToBeCreated);
      await this.updateUserSalesCount(
        userInstance,
        userInstance.sales_count + 1,
      );
      return savedPurchase;
    } catch (err) {
      ErrorHandler(err);
    }
  }

  private async getUserInstance(email: string) {
    return await this.usersService.findOneOrFail({ email });
  }

  private async getAllProducts(
    productIds: number[],
  ): Promise<ProductsEntity[]> {
    return await this.productsService.findProductsByIds(productIds);
  }

  private calculateFinalAndRawValue(discount, allProducts: ProductsEntity[]) {
    const rawValue = HProductsFunctions.sumProductsValue(allProducts);
    return {
      rawValue,
      finalValue: HProductsFunctions.calculateFinalValue(rawValue, discount),
    };
  }

  private createPurchaseItem(data: PurchaseItemsCreateInstanceDTO) {
    return {
      ...data,
    };
  }

  private async savePurchase(purchase: PurchaseItemsCreateInstanceDTO) {
    const body = await this.purchasesRepository.create([purchase]);
    return await this.purchasesRepository.save(body);
  }

  private async updateUserSalesCount(userId: UsersEntity, salesCount: number) {
    const increasesSalesCount: UpdateUserDTO = { sales_count: salesCount };
    await this.usersService.update(userId.id, increasesSalesCount);
  }
}
