const jwt = require("jsonwebtoken");
const User = require("../db/models/user");


const authenticate = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Authentication is required"
        })
    }
    
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json("You need to login first");
    }
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(verified._id);
    if (!user) {
      return res.status(401).json("You need to login first");
    }
    req.user = user;
    req.id = user._id
    next();
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = authenticate;