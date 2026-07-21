const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {

        return res.status(401).json({
            message: "Access Denied. Token Missing"
        });

    }

    if (!authHeader.startsWith("Bearer ")) {

        return res.status(401).json({
            message: "Invalid Authorization Format"
        });

    }

    const token = authHeader.split(" ")[1];

    /*if (!token) {

        return res.status(401).json({
            message: "Access Denied. Token Missing"
        });

    }*/


    try {

        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = verified;

        next();

    } catch (error) {

        res.status(401).json({
            message: "Invalid or Expired Token"
        });

    }

};