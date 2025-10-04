import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class PasswordMatchConstraint implements ValidatorConstraintInterface {
    validate(confirmPassword: string, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare class RegisterDto {
    email: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
}
