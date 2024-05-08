import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';
import { EnumRelationShip, EnumRole } from 'src/ts/enum';

@InputType()
export class UpdateUserDto {
  @IsOptional()
  @Field(() => String, { nullable: true })
  username: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  role: EnumRole;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  isActive: number;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  usersBlocked: string[];

  @IsOptional()
  @Field(() => String, { nullable: true })
  fullname: string;

  @IsOptional()
  @IsEmail()
  @Field(() => String, { nullable: true })
  email: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  address: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  company: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  university: string;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  relationship: EnumRelationShip;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  files: string[];

  @IsOptional()
  @Field(() => Number, { nullable: true })
  gender: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  dayOfBirth: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  avatar: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  coverImage: string;

  @IsOptional()
  @MaxLength(11)
  @MinLength(10)
  @Field(() => String, { nullable: true })
  phone: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description: string;

  @IsOptional()
  @Field(() => Date, { defaultValue: new Date() })
  updatedAt: Date;
}
