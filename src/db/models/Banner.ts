import { DataTypes, Model, Optional } from 'sequelize';
import connection from "../../config/dbConnect";

interface BannerAttributes {
  id?: number,
  title?: string | null,
  subtitle?: string | null,
  banner?: string | null,

  createdAt?: Date,
  updatedAt? : Date
}

export interface BannerInput extends Optional<BannerAttributes, 'id'>{ }
export interface BannerOutput extends Required<BannerAttributes>{ }

class Banner extends Model<BannerAttributes, BannerInput> implements BannerAttributes {
  public id!: number;
  public title!: string;
  public subtitle!: string;
  public banner!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt! : Date;
}

Banner.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  title: {
    allowNull: true,
    type: DataTypes.STRING
  },
  subtitle: {
    allowNull: true,
    type: DataTypes.STRING
  },
  banner: {
    allowNull: true,
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  sequelize: connection,
  underscored: false
});

export default Banner;