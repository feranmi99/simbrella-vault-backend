import { Table, Column, Model, DataType } from 'sequelize-typescript';


export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Table({ tableName: 'users' })
export default class User extends Model<User> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    first_name!: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    last_name!: string;

    @Column({
        type: DataType.STRING(100),
        unique: 'unique_user_email',
        allowNull: false,
    })
    email!: string;

    @Column({
        type: DataType.STRING(20),
        unique: 'unique_user_phone',
        allowNull: false,
    })
    phone!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)), // Sequelize ENUM for role
        defaultValue: UserRole.USER, // Default role is 'user'
        allowNull: false,
    })
    role!: UserRole;
}
