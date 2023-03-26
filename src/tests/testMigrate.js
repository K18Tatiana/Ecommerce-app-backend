const sequelize = require('../utils/connection');
const User = require('../models/User');
require('../models/Category');
require('../models/Product');
require('../models/Cart');
require('../models');

const main = async() => {
    try{
        await sequelize.sync({ force: true });
        // funciones de create...
        await User.create({
            firstName: "Test",
            lastName: "User",
            email: "test@gmail.com",
            password: "test1234",
            phone: "123456789"
        });
        process.exit();
    } catch(error){
        console.log(error);
    }
}

main();