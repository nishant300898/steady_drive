const jwt = require('jsonwebtoken');

async function verifyToken(req, res) {
  let token = req.headers['authorization'];
  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    try {
      let result = {
        user: null,
      };
        result.user = jwt.verify(token, process.env.JWT_SECRET);
        return result;
    } catch (error) {
      return res.status(401).send({
        status: 'failure',
        message: 'Token is not valid',
      });
    }
  } else {
    return res.status(401).send({
      status: 'failure',
      message: 'Auth token is not supplied',
    });
  }
}

  (exports.isAuthenticated = async (req, res, next) => {
    let result = await verifyToken('doctor', req, res);
    if (result.valid) {
      req.user = result.user;
      next();
    }
  });

exports.generateTokenFoAdmin = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRY,
  });
};

exports.isAdminAuthenticated = async (req, res, next) => {
  let result = await verifyToken(req, res);
    req.admin = result.user;
    next();
};