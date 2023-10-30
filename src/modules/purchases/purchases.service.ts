import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
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
import { UsersEntity } from 'src/entities/user.entity';
import { TGetAllProductsReturn } from 'src/shared/utils/types/return-get-all-products.type';
import { TCalculateRawFinalValue } from 'src/shared/utils/types/calculate-raw-final-value.type';

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

  async find() {
    return await this.purchasesRepository.find();
  }

  async findUserPurchase(user: any) {
    return await this.purchasesRepository.find({
      where: { user: user },
    });
  }

  async updatePurchase({ id, status }: UpdatePurchaseStatusDTO) {
    try {
      const purchase = await this.purchasesRepository.findOneOrFail({
        where: id,
      });
      if (purchase.status != EPurchaseStatus.AWAITING_PAYMENT) {
        throw new AppError(
          `The purchase with id ${id} is on the incorrect status for conciliation `,
          400,
        );
      }
      return await this.purchasesRepository.merge(purchase, { status });
    } catch (err) {
      return ErrorHandler(err);
    }
  }

  async getUserShopCar(req: any): Promise<PurchasesEntity> {
    const shopCar = await this.purchasesRepository.findOne({
      where: {
        user: { id: req.user.id },
        status: EPurchaseStatus.CREATED,
      },
    });
    if (!shopCar) return {} as PurchasesEntity;
    return shopCar;
  }

  async getProductsFromShopCar(req: any) {
    const { products } = await this.getUserShopCar(req);
    const { productsFound } =
      await this.productsService.findProductsByIds(products);
    const idToEntityMap = productsFound.reduce((acc, entity) => {
      acc[entity.id] = entity;
      return acc;
    }, {});
    const arrayOfEntities = products.map((id) => idToEntityMap[id]);
    return arrayOfEntities;
  }

  async updateShopCar(productId: any, req: any) {
    const shopCar = await this.purchasesRepository.findOne({
      where: {
        user: { id: req.user.id },
        status: EPurchaseStatus.CREATED,
      },
    });
    if (!shopCar) {
      return this.createPurchase({
        data: {
          discount: 0,
          products: [productId],
          deliveryAddress: 'In-store pickup',
        },
        user: req.user,
      });
    } else {
      shopCar.products.push(productId);
    }
    return this.purchasesRepository.save(shopCar);
  }

  async removeItemFromShopCar(productId: any, req: any) {
    try {
      const shopCar = await this.purchasesRepository.findOne({
        where: {
          user: { id: req.user.id },
          status: EPurchaseStatus.CREATED,
        },
      });

      if (!shopCar) {
        throw new NotFoundException('Shopping cart not found');
      }

      const productIndex = shopCar.products.indexOf(+productId);

      if (productIndex === -1) {
        throw new NotFoundException('Product not found in the shopping cart');
      }

      shopCar.products.splice(productIndex, 1);

      return await this.purchasesRepository.save(shopCar);
    } catch (error) {
      throw new BadRequestException(
        `Error removing product from shopping cart ${error}`,
      );
    }
  }

  async createPurchase({ data, user }: IPurchaseProducts) {
    try {
      // Get user information by email.
      const userInstance = await this.getUserInstance(user.email);

      // Define the purchase status about to be create.
      let purchaseStatus = EPurchaseStatus.CREATED;

      // Put each information from body request on a constant.
      const { products, discount, deliveryAddress } = data;

      // Get all products from database filtering by id.
      const { productsFound, missingIds } = await this.getAllProducts(products);

      // Calculate raw value and final value of the purchase.
      const { rawValue, finalValue } = this.calculateFinalAndRawValue({
        discount,
        productsFound,
        missingIds,
      });

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
      throw err;
    }
  }

  private async getUserInstance(email: string) {
    return await this.usersService.findOneOrFail({ email });
  }

  private async getAllProducts(
    productIds: number[],
  ): Promise<TGetAllProductsReturn> {
    return await this.productsService.findProductsByIds(productIds);
  }

  private calculateFinalAndRawValue({
    discount,
    productsFound,
    missingIds,
  }: TCalculateRawFinalValue) {
    if (missingIds.length > 0 ? true : false) {
      throw new AppError(`Products were not found: ${missingIds}`, 400);
    }
    const rawValue = HProductsFunctions.sumProductsValue(productsFound);
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
