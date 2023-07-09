'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Careers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      posisi: {
        type: Sequelize.STRING
      },
      kualifikasi: {
        type: Sequelize.TEXT
      },
      jobdesc: {
        type: Sequelize.TEXT
      },
      penempatan: {
        type: Sequelize.STRING
      },
      deadline: {
        type: Sequelize.DATE
      },
      link: {
        type: Sequelize.STRING
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Careers');
  }
};