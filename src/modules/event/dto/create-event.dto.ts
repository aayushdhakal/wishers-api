import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { EventType, NotificationType } from '@prisma/client';

export class CreateEventReminderDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  reminderDays: number;

  @IsArray()
  @IsEnum(NotificationType, { each: true })
  notificationTypes: NotificationType[];
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  eventDate: string;

  @IsEnum(EventType)
  eventType: EventType;

  @IsString()
  @IsNotEmpty()
  personName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  recurringEvent?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventReminderDto)
  reminders?: CreateEventReminderDto[];
}
