const catchError = require('../utils/catchError');
const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductImg = require('../models/ProductImg');

const getAll = catchError(async(req, res) => {
    const products = await Product.findAll({ include: [Category, ProductImg] });
    return res.json(products);
});

const create = catchError(async(req, res) => {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByPk( id, { include: [Category, ProductImg] } );
    if(!product) return res.sendStatus(404);
    return res.json(product);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const products = await Product.destroy({ where: {id} });
    if(products === 0) return res.sendStatus(404);
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const product = await Product.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(product[0] === 0) return res.sendStatus(404);
    return res.json(product[1][0]);
});

const setProductImages = catchError(async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if(!product) return res.sendStatus(404);
    await product.setProductImgs(req.body);
    const productImgs = await product.getProductImgs();
    return res.json(productImgs);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    setProductImages
}