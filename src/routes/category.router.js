const { getAll, create, getOne, remove, update } = require('../controllers/category.controllers');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT');
const verifyAdmin = require('../utils/verifyAdmin');

const categoryRouter = express.Router();

categoryRouter.route('/')
    .get(getAll)
    .post(verifyJWT, verifyAdmin, create);

categoryRouter.route('/:id')
    .get(getOne)
    .delete(verifyJWT, verifyAdmin, remove)
    .put(verifyJWT, verifyAdmin, update);

module.exports = categoryRouter;