const catchError = require('../utils/catchError');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getAll = catchError(async(req, res) => {
    const userId = req.user.id;
    const cart = await Cart.findAll({ where: { userId }, include: [ Product ] });
    return res.json(cart);
});

const create = catchError(async(req, res) => {
    const userId = req.user.id;
    const { quantity, productId } = req.body
    const cart = await Cart.create({ quantity, productId, userId });
    return res.status(201).json(cart);
});

const getOne = catchError(async(req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const cart = await Cart.findOne({ where: { id, userId }, include: [ Product ] });
    if(!cart) return res.sendStatus(404);
    return res.json(cart);
});

const remove = catchError(async(req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const cart = await Cart.destroy({ where: {id, userId} });
    if(cart === 0) return res.sendStatus(404);
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const userId = req.user.id;
    const { quantity } = req.body;
    const { id } = req.params;
    const cart = await Cart.update(
        { quantity },
        { where: {id, userId}, returning: true }
    );
    if(cart[0] === 0) return res.sendStatus(404);
    return res.json(cart[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}