const catchError = require('../utils/catchError');
const ProductImg = require('../models/ProductImg');
const fs = require('fs');
const path = require('path');

const getAll = catchError(async(req, res) => {
    const productImg = await ProductImg.findAll();
    return res.json(productImg);
});

const create = catchError(async(req, res) => {
    if(req.user.role !== 'admin') return res.status(403).json({ message: "Invalid role" });
    const images = req.files.map(file => {
        const url = req.protocol + '://' + req.headers.host + '/uploads/' + file.filename;
        const filename  = file.filename;
        return { url, filename };
    });
    const productImgs = await ProductImg.bulkCreate(images);
    return res.status(201).json(productImgs);
});

const remove = catchError(async(req, res) => {
    if(req.user.role !== 'admin') return res.status(403).json({ message: "Invalid role" });
    const { id } = req.params;
    const image = await ProductImg.findByPk(id);
    if(!image) return res.sendStatus(404);
    // fs.unlinkSync(path.join(__dirname, '..', 'public', 'uploads', image.filename));
    await image.destroy();
    return res.sendStatus(204);
});

module.exports = {
    getAll,
    create,
    remove
}