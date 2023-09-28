import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchasesEntity } from 'src/entities/purchases.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { AppError } from 'src/shared/AppError';
import { UsersService } from '../users/users.service';
import { IPurchaseProducts } from 'src/utils/interfaces/purchase-products.interface';
import { HProductsFunctions } from 'src/helpers/calculators/products-functions.helper';
import { PurchaseItemsCreateInstanceDTO } from 'src/utils/dto/purchases/purchase-items-create-instance.dto';
import { EPurchaseStatus } from 'src/utils/enums/purchase-status-dictionary.enum';
import { UpdateUserDTO } from 'src/utils/dto/users/update-user.dto';
import { UpdatePurchaseStatusDTO } from 'src/utils/dto/purchases/update-purchase-status.dto';
import { ErrorHandler } from 'src/shared/ErrorHandler';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(PurchasesEntity)
    private readonly purchasesRepository: Repository<PurchasesEntity>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly errorHandler = new ErrorHandler(),
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
      throw new AppError(err.message, 501);
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
      this.errorHandler.attributeError(err);
    }
  }
}
