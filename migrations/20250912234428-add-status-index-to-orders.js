export default {
  async up(queryInterface) {
    await queryInterface.addIndex('orders', ['status'], {
      name: 'orders_status_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('orders', 'orders_status_idx');
  },
};