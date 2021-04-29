/**
 * Install MongoDB shell:
 * @link https://askubuntu.com/a/1127143
 *
 * usage:
 * > mongo mongodb+srv://{user}:{password}@{host}/${request db name} ./product-sps-migration.js
 */

const PRODUCT_DB_NAME = "product";

const productDB = db.getSiblingDB(PRODUCT_DB_NAME);
db.partners.find().forEach((partner) => {
  const serviceProviderId = partner.serviceProviderId;
  const supportedProducts = partner.supportedProducts;
  if (serviceProviderId && Array.isArray(supportedProducts)) {
    supportedProducts.forEach((productID) => {
      const product = productDB.products.update(
        { id: productID },
        { $addToSet: { serviceProviders: serviceProviderId } }
      );
    });
  }
});
