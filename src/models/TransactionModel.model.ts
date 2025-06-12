import {
    Table,
    Column,
    Model,
    ForeignKey,
    DataType,
    BelongsTo,
    AllowNull,
    PrimaryKey,
    AutoIncrement,
    Default,
} from 'sequelize-typescript';
import Wallet from './WalletModel.model';

export enum TransactionType {
    CREDIT = 'credit',
    DEBIT = 'debit',
    TRANSFER = 'transfer',
}

export enum TransactionStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

@Table({ tableName: 'transactions', timestamps: true })
export default class Transaction extends Model<Transaction> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => Wallet)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    fromWalletId!: number;

    @BelongsTo(() => Wallet, 'fromWalletId')
    fromWallet!: Wallet;

    @ForeignKey(() => Wallet)
    @AllowNull(true)
    @Column(DataType.INTEGER)
    toWalletId?: number;

    @BelongsTo(() => Wallet, 'toWalletId')
    toWallet?: Wallet;

    @AllowNull(false)
    @Column(DataType.DECIMAL(15, 2))
    amount!: number;

    @AllowNull(false)
    @Column(DataType.ENUM(...Object.values(TransactionType)))
    type!: TransactionType;

    @AllowNull(true)
    @Column(DataType.STRING)
    description?: string;

    @AllowNull(false)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    date!: Date;

    @AllowNull(false)
    @Default(TransactionStatus.PENDING)
    @Column(DataType.ENUM(...Object.values(TransactionStatus)))
    status!: TransactionStatus;
}
