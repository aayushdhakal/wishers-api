export declare class AuthResponseDto {
    accessToken: string;
    refreshToken?: string;
    user: UserResponseDto;
    expiresIn: number;
}
export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
    isActive: boolean;
    isAdmin?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
