import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";
import { convertToMakassarTime } from "../../helpers/timezone";


interface RegisterAttributes {
  id?: number,
  name?: string | null,
  email?: string | null,
  password?: string | null,
  token?: string | null,
  isVerified?: boolean | null,

  createdAt?: Date,
  updatedAt? : Date
}

export interface RegisterInput extends Optional<RegisterAttributes, 'id'>{ }
export interface RegisterOutput extends Required<RegisterAttributes>{ }

class Register extends Model<RegisterAttributes, RegisterInput> implements RegisterAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public token!: string;
  public isVerified!: boolean;

  public createdAt!: Date;
  public updatedAt! : Date;
}

Register.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  name: {
    allowNull: true,
    type: DataTypes.STRING
  },
  email: {
    allowNull: true,
    type: DataTypes.STRING
  },
  password: {
    allowNull: true,
    type: DataTypes.STRING
  },
  token: {
    allowNull: true,
    type: DataTypes.STRING
  },
  isVerified: {
    allowNull: true,
    type: DataTypes.BOOLEAN
  }
}, {
  timestamps: true,
  sequelize: connection,
  underscored: false
});

Register.beforeSave((register, options) => {
	if (register.isNewRecord) {
		register.createdAt = convertToMakassarTime(new Date());
	}
	register.updatedAt = convertToMakassarTime(new Date());
});

export default Register;