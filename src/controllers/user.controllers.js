const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAll = catchError(async(req, res) => {
    const users = await User.findAll();
    return res.json(users);
});

const create = catchError(async(req, res) => {
    const user = await User.create(req.body);
    return res.status(201).json(user);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const user = await User.findByPk( id );
    if(!user) return res.sendStatus(404);
    return res.json(user);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const users = await User.destroy({ where: {id} });
    if(users === 0) return res.sendStatus(404);
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    delete req.body.password // Elimina la contraseña
    delete req.body.email // Elimina el email
    const user = await User.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(user[0] === 0) return res.sendStatus(404);
    return res.json(user[1][0]);
});

const login = catchError(async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if(!user) return res.status(401).json({ message: "Invalid credentials" });
    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
        { user },
        process.env.TOKEN_SECRET,
        { expiresIn: '1d' }
    );
    return res.json({ user, token });
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login
}