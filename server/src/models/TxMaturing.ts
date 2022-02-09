import Sequelize, { Op } from 'sequelize';
import {
  AfterCreate,
  AfterDestroy,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Min,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import Address from './Address';
import Tx from './Tx';

/**
 * This is a confirmed TX to an address in our database.
 * These entities lives while the TX has too low confirmations and could be affected by a reorg.
 */
@Table({ tableName: 'tx_maturing' })
export default class TxMaturing extends Model {
  @Column({ type: DataType.CHAR(64), primaryKey: true })
  tx: string;

  @Column({ primaryKey: true })
  index: number;

  @BelongsTo(() => Address)
  address: Address;

  @ForeignKey(() => Address)
  @Column
  addressId: string;

  @Min(0.000001)
  @Column('float4')
  value: number;

  @Default(-1)
  @Column
  height: number;

  @Default(-1)
  @Column
  goodAfter: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @AfterCreate
  @AfterDestroy
  static async updateUnconfirmedBalance(tx: TxMaturing) {
    const address = await tx.$get('address');
    if (!address?.used) {
      address?.update({ used: true });
    }

    const { unconfirmed } = (await TxMaturing.findOne({
      attributes: [
        [Sequelize.fn('sum', Sequelize.col('value')), 'unconfirmed'],
      ],
      raw: true,
      include: {
        model: Address,
        attributes: [],
        where: { accountId: address!.accountId },
      },
    })) as unknown as { unconfirmed: number };

    const account = await address?.$get('account');
    account!.update({ unconfirmed });
  }

  static async mature(height: number) {
    const mature = await TxMaturing.findAll({
      where: {
        goodAfter: {
          [Op.lte]: height,
        },
        height: {
          [Op.gt]: -1,
        },
      },
    });

    mature.forEach(async (txMaturing) => {
      txMaturing.sequelize.transaction(async (transaction) => {
        await Tx.create(
          {
            tx: txMaturing.tx,
            index: txMaturing.index,
            addressId: txMaturing.addressId,
            value: txMaturing.value,
            height: txMaturing.height,
          },
          { transaction }
        );
        await txMaturing.destroy({ transaction });
      });
    });
  }
}
