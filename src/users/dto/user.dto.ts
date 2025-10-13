export class UserDto {
    id!: number;
    fullName!: string;
    email!: string;
    role!: Role;
    createdAt!: Date;
    updatedAt!: Date;
}
enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}