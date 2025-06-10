import { Table, Column, Model, DataType } from 'sequelize-typescript';

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
        unique: true,
        allowNull: false,
    })
    email!: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
    })
    phone!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;
}
