import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";

interface CareerAttributes {
	id?: number,
	title?: string | null,
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
	public posisi!: string;
	public kualifikasi!: string;
	public jobdesc!: string;
	public penempatan!: string;
	public deadline!: Date;
	public link!: string;
    public deletedAt!: Date;
  
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
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


export default Career;