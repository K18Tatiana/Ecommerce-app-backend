const catchError = require('../utils/catchError');
const Category = require('../models/Category');
const Product = require('../models/Product');

const getAll = catchError(async(req, res) => {
    const categories = await Category.findAll({ include: [Product] });
    return res.json(categories);
});

const create = catchError(async(req, res) => {
    const category = await Category.create(req.body);
    return res.status(201).json(category);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const category = await Category.findByPk( id, { include: [Product] } );
    if(!category) return res.sendStatus(404);
    return res.json(category);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const categories = await Category.destroy({ where: {id} });
    if(categories === 0) return res.sendStatus(404);
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const category = await Category.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(category[0] === 0) return res.sendStatus(404);
    return res.json(category[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}