import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('settings')
@ObjectType()
export default class Settings extends BaseEntity {
  @Field(() => ID)
  @Column({ primary: true, type: 'varchar' })
  id: string;

  @Field()
  @Column()
  value: string;

  private static Key = {
    CURRENT_HEIGHT: 'CURRENT_HEIGHT',
  };

  static async getCurrentHeight(): Promise<number> {
    const setting = await Settings.findOne({
      where: { id: Settings.Key.CURRENT_HEIGHT },
    });

    if (!setting) {
      throw new Error('Current height is unknown');
    }

    return parseInt(setting?.value);
  }

  static async setCurrentHeight(height: number) {
    return await Settings.upsert(
      { id: Settings.Key.CURRENT_HEIGHT, value: String(height) },
      ['id']
    );
  }
}
