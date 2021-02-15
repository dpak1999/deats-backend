import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class RestaurantInput {
  @Field(() => Int)
  restaurantId: number;
}

@ObjectType()
export class RestaurantOutput extends MutationOutput {
  @Field(() => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}
