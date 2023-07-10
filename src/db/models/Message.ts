import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";
import { convertToMakassarTime } from "../../helpers/timezone";
import User from "./User";

interface MessageAttributes {
  id?: number,
  message?: string | null,
  userId?: number | null,

  createdAt?: Date,
  updatedAt? : Date
}

export interface MessageInput extends Optional<MessageAttributes, 'id'>{ }
export interface MessageOutput extends Required<MessageAttributes>{ }

class Message extends Model<MessageAttributes, MessageInput> implements MessageAttributes {
  public id!: number;
  public message!: string;
  public userId!: number;

  public createdAt!: Date;
  public updatedAt! : Date;
}

Message.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  message: {
    allowNull: true,
    type: DataTypes.STRING
  },
  userId: {
    allowNull: true,
    type: DataTypes.BIGINT
  }
}, {
  timestamps: true,
  sequelize: connection,
  underscored: false
});

Message.beforeSave((message, options) => {
	if (message.isNewRecord) {
		message.createdAt = convertToMakassarTime(new Date());
	}
	message.updatedAt = convertToMakassarTime(new Date());
});

Message.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Message, { foreignKey: 'userId' });

export default Message;