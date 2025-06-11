import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  BeforeCreate,
} from 'sequelize-typescript';
import User from './UserModel.model';
import crypto from 'crypto';

@Table({ tableName: 'wallets', timestamps: true })
class Wallet extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(18, 2))
  balance!: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  currency?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  accountNumber?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  walletAddress!: string;

  @AllowNull(false)
  @Column(DataType.ENUM('personal', 'business', 'savings'))
  type!: 'personal' | 'business' | 'savings';


  @BeforeCreate
  static generateWalletAddress(instance: Wallet) {
    const uniqueAddress = crypto.randomBytes(20).toString('hex'); // 40-char hex string
    instance.walletAddress = `0x${uniqueAddress}`;
  }
}

export default Wallet;
