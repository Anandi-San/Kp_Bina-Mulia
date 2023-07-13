'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Galeris', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      tanggal: {
        type: Sequelize.DATE
      },
      lokasi: {
        type: Sequelize.TEXT
      },
      gambar1: {
        type: Sequelize.TEXT
      },
      gambar2: {
        type: Sequelize.TEXT
      },
      gambar3: {
        type: Sequelize.TEXT
      },
      gambar4: {
        type: Sequelize.TEXT
      },
      gambar5: {
        type: Sequelize.TEXT
      },
      gambar6: {
        type: Sequelize.TEXT
      },
      gambar7: {
        type: Sequelize.TEXT
      },
      gambar8: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Galeris');
  }
};