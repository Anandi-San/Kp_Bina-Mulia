import { DataTypes, Model, Optional } from 'sequelize';
import connection from "../../config/dbConnect";
import User from './User';

interface BeritaAttributes {
  id?: number,
  title?: string | null,
  userId?: number | null,
  deskripsi?: string | null,
  image1?: string | null,
  image2?: string | null,
  image3?: string | null,


  createdAt?: Date,
  updatedAt? : Date
}

export interface BeritaInput extends Optional<BeritaAttributes, 'id'>{ }
export interface BeritaOutput extends Required<BeritaAttributes>{ }

class Berita extends Model<BeritaAttributes, BeritaInput> implements BeritaAttributes {
  public id!: number;
  public title!: string;
  public userId!: number;
  public deskripsi!: string;
  public image1!: string;
  public image2!: string;
  public image3!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt! : Date;
}

Berita.init({
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
  userId: {
    allowNull: true,
    type: DataTypes.BIGINT
  },
  deskripsi: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  image1: {
    allowNull: false,
    type: DataTypes.TEXT
  },
  image2: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  image3: {
    allowNull: true,
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  sequelize: connection,
  underscored: false
});

Berita.belongsTo(User, {foreignKey: "userId"});

export default Berita;