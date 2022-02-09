import {
  AfterCreate,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Min,
  Model,
  Table,
} from 'sequelize-typescript';
import Account from './Account';
import Address from './Address';

/**
 * This is a confirmed TX after the maturing period (unlikely to sofer reorg)
 */
@Table({ tableName: 'tx' })
export default class Tx extends Model {
  @Column({ type: DataType.CHAR(64), primaryKey: true })
  tx: string;

  @Column({ primaryKey: true })
  index: number;

  @BelongsTo(() => Address)
  address: Address;

  @ForeignKey(() => Address)
  @Column({ allowNull: false })
  addressId: string;

  @Min(0.000001)
  @Column('float4')
  value: number;

  @Default(-1)
  @Column
  height: number;

  @CreatedAt
  createdAt: Date;

  @AfterCreate
  static async updateBalance(tx: Tx) {
    const account = await Account.findOne({
      include: {
        model: Address,
        attributes: [],
        where: { address: tx.addressId },
      },
    });

    return await account?.increment('balance', { by: tx.value });
  }

  @AfterCreate
  static async markAddressAsUsed(tx: Tx) {
    const address = await tx.$get('address');
    if (!address?.used) {
      await address?.update({ used: true });
    }
  }
}
