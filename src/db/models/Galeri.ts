import { DataTypes, Model, Optional } from "sequelize";
import connection from "../../config/dbConnect";
// import moment from 'moment-timezone';
import { convertToMakassarTime } from "../../helpers/timezone";

interface GaleriAttributes {
	id?: number,
	title?: string | null,
	tanggal?: Date | null,
	lokasi?: string | null,
	gambar1?: string | null,
	gambar2?: string | null,
	gambar3?: string | null,
	gambar4?: string | null,
	gambar5?: string | null,
	gambar6?: string | null,
    gambar7?: string | null,
    gambar8?: string | null,

	createdAt?: Date,
	updatedAt? : Date
}

export interface GaleriInput extends Optional<GaleriAttributes, 'id'>{ }
export interface GaleriOutput extends Required<GaleriAttributes>{ }

class Galeri extends Model<GaleriAttributes, GaleriInput> implements GaleriAttributes {
	public id!: number;
	public title!: string;
	public tanggal!: Date;
	public lokasi!: string;
	public gambar1!: string;
	public gambar2!: string;
	public gambar3!: string;
	public gambar4!: string;
	public gambar5!: string;
	public gambar6!: string;
    public gambar7!: string;
    public gambar8!: string;
  
	public createdAt!: Date;
	public updatedAt!: Date;
}

Galeri.init({
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
	tanggal: {
		type: DataTypes.DATE,
		allowNull: true
	},
    lokasi: {
		type: DataTypes.STRING,
		allowNull: true
	},
	gambar1: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	gambar2: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	gambar3: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	gambar4: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	gambar5: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	gambar6: {
		type: DataTypes.TEXT,
		allowNull: true
	},
    gambar7:{
        type: DataTypes.TEXT,
        allowNull:true
    },
    gambar8:{
        type: DataTypes.TEXT,
        allowNull:true
    }
}, {
	timestamps: true,
	sequelize: connection,
	underscored: false
});

Galeri.beforeSave((galeri, options) => {
	if (galeri.isNewRecord) {
		galeri.createdAt = convertToMakassarTime(new Date());
	}
	galeri.updatedAt = convertToMakassarTime(new Date());
});

export default Galeri;
