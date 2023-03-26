const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Cart = require('../models/Cart');

const getAll = catchError(async(req, res) => {
    const userId = req.user.id;
    const purchases = await Purchase.findAll({ where: { userId } });
    return res.json(purchases);
});

const purchaseCart = catchError(async(req, res) => {
    const userId = req.user.id;
    const cart = await Cart.findAll({
        where: { userId }, 
        attributes: [ 'quantity', 'userId', 'productId' ],
        raw: true
    });
    await Purchase.bulkCreate(cart);
    await Cart.destroy({ where: { userId } });
    return res.sendStatus(200);
});

module.exports = {
    getAll,
    purchaseCart
}