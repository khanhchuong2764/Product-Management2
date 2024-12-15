module.exports.GetPriceNew = (product) => {
    const Newproduct = product.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
        return item;
      });
    return Newproduct;
}


module.exports.GetPriceNewItem = (item) => {
    item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
    return item;
}

