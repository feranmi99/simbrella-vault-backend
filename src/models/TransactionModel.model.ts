import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import Wallet from './WalletModel.model';

export enum TransactionType {
    CREDIT = 'credit',
    DEBIT = 'debit',
    TRANSFER = 'transfer',
}

@Table({ tableName: 'transactions' })
export default class Transaction extends Model<Transaction> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @ForeignKey(() => Wallet)
    @Column({ type: DataType.INTEGER, allowNull: false })
    fromWalletId!: number;

    @ForeignKey(() => Wallet)
    @Column({ type: DataType.INTEGER, allowNull: true })
    toWalletId!: number;

    @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
    amount!: number;

    @Column({
        type: DataType.ENUM(...Object.values(TransactionType)),
        allowNull: false,
    })
    type!: TransactionType;

    @Column({ type: DataType.STRING })
    description!: string;
}
