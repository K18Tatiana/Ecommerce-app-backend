const sequelize = require('../utils/connection');
const User = require('../models/User');
require('../models/Category');
require('../models/Product');
require('../models/Cart');
require('../models/Purchase')
require('../models');

const main = async() => {
    try{
        await sequelize.sync({ force: true });
        // funciones de create...
        await User.create({
            firstName: "admin",
            lastName: "user",
            email: "admin@gmail.com",
            password: "admin1234",
            phone: "123456789",
            role: 'admin'
        });
        process.exit();
    } catch(error){
        console.log(error);
    }
}

main();