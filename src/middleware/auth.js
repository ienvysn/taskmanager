const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, "ienvysnn"); // safe key that we used to makw the hash password

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    console.log("object");
    if (!user) {
      throw new error();
    }
    // req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error });
  }
};

//EXPLAINATION
// The auth middleware is responsible for verifying a user's identity using a JSON Web Token (JWT). It starts by extracting the token from the Authorization header, removing the Bearer prefix. Then, it decodes and verifies the token using a secret key, ensuring the token is valid and untampered.
// Once decoded, it queries the database to find a user whose ID matches the one in the token and whose tokens array includes the provided token.
// If no such user is found, an error is thrown, denying access.
// If the user exists, the middleware calls next() to pass control to the next function in the request pipeline. Without next() the remaing code will not run.
// Errors, such as a missing or invalid token, result in a 401 Unauthorized response. While this middleware currently doesn't attach the user object to the request, it could be modified to do so for easier access in route handlers.
//  This middleware is a critical component for securing routes in the application.
// This code is then sent to userrouter as a parameter in the router.

module.exports = auth;
