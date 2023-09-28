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
import { UpdateUserDTO } from 'src/shared/utils/dto/users/update-user.dto';
import { AppError } from 'src/shared/handlers/AppError';
import { UpdatePurchaseStatusDTO } from 'src/shared/utils/dto/purchases/update-purchase-status.dto';
import { ErrorHandler } from 'src/shared/handlers/ErrorHandler';

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

  async store({ query, data }: IPurchaseProducts) {
    try {
      const { id } = query;
      const user = await this.usersService.findOneOrFail({ id });
      const { products, discount, deliveryAddress } = data;
      const allProducts =
        await this.productsService.findProductsByIds(products);
      const rawValue = HProductsFunctions.sumProductsValue(allProducts);
      const finalValue = HProductsFunctions.calculateFinalValue(
        rawValue,
        discount,
      );
      const purchaseToBeCreated: PurchaseItemsCreateInstanceDTO = {
        products,
        discount: Number(discount),
        finalValue,
        deliveryAddress,
        rawValue,
        status: EPurchaseStatus.CREATED,
        user,
      };
      const body = await this.purchasesRepository.create([purchaseToBeCreated]);
      const increasesSalesCount: UpdateUserDTO = {
        sales_count: user.sales_count++,
      };
      await this.usersService.update(user.id, increasesSalesCount);
      return await this.purchasesRepository.save(body);
    } catch (err) {
      throw new AppError(`Something went wrong: ${err.message}`, 400);
    }
  }

  async findAllProducts() {
    try {
      return await this.productsService.listAll();
    } catch (err) {
      ErrorHandler(err);
    }
  }

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
}
