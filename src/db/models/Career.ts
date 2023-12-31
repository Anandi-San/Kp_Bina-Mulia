import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";
// import moment from 'moment-timezone';
import { convertToMakassarTime } from "../../helpers/timezone";

interface CareerAttributes {
	id?: number,
	title?: string | null,
	photo?: string | null,
	posisi?: string | null,
	kualifikasi?: string | null,
	jobdesc?: string | null,
	penempatan?: string | null,
	deadline?: Date | null,
	link?: string | null,
    deletedAt?: Date | null,
  
	createdAt?: Date,
	updatedAt? : Date
}

export interface CareerInput extends Optional<CareerAttributes, 'id'>{ }
export interface CareerOutput extends Required<CareerAttributes>{ }

class Career extends Model<CareerAttributes, CareerInput> implements CareerAttributes {
	public id!: number;
	public title!: string;
	public photo!: string;
	public posisi!: string;
	public kualifikasi!: string;
	public jobdesc!: string;
	public penempatan!: string;
	public deadline!: Date;
	public link!: string;
    public deletedAt!: Date;
  
	public createdAt!: Date;
	public updatedAt!: Date;
}

Career.init({
	id: {
		type: DataTypes.BIGINT,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	title: {
		type: DataTypes.STRING,
		allowNull: true
	},
	photo: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	posisi: {
		type: DataTypes.STRING,
		allowNull: true
	},
	kualifikasi: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	jobdesc: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	penempatan: {
		type: DataTypes.STRING,
		allowNull: true
	},
	deadline: {
		type: DataTypes.DATE,
		allowNull: true
	},
	link: {
		type: DataTypes.STRING,
		allowNull: true
	},
    deletedAt:{
        type: DataTypes.DATE,
        allowNull:true
    }
}, {
	timestamps: true,
	sequelize: connection,
	underscored: false
});

Career.beforeSave((career, options) => {
	if (career.isNewRecord) {
		career.createdAt = convertToMakassarTime(new Date());
	}
	career.updatedAt = convertToMakassarTime(new Date());
});

export default Career;
