module.exports = (UnitPrice, sadminId) => {
    await UnitPrice.create({
        unit: 1,
        price: 100,
        type: 'ram',
        userId: sadminId
    });
    await UnitPrice.create({
        unit: 1,
        price: 300,
        type: 'cpu',
        userId: sadminId
    });
    await UnitPrice.create({
        unit: 5,
        price: 500,
        type: 'storage',
        userId: sadminId
    });
};