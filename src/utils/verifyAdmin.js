const verifyAdmin = (req, res, next) => {
    if(req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "You must be admin" });
    }
}

module.exports = verifyAdmin;