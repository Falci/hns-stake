import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@Entity('accunt')
@ObjectType()
export default class Account extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  address: string;
  @Field(() => Number)
  @Column()
  index: number;

  @Field(() => Number)
  @Column('float')
  balance: number;
}
