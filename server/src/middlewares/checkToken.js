const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const TokenError = require('../errors/TokenError');
const userQueries = require('../controllers/queries/userQueries');

module.exports.checkAuth = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    return next(new TokenError('need token'));
  }
  try {
    const tokenData = jwt.verify(accessToken, CONSTANTS.JWT_SECRET);
    const foundUser = await userQueries.findUser({ id: tokenData.userId });
    res.send({
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      role: foundUser.role,
      id: foundUser.id,
      avatar: foundUser.avatar,
      displayName: foundUser.displayName,
      balance: foundUser.balance,
      email: foundUser.email,
    });
  } catch (err) {
    next(new TokenError());
  }
};

module.exports.checkToken = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    return next(new TokenError('need token'));
  }
  try {
    req.tokenData = jwt.verify(accessToken, CONSTANTS.JWT_SECRET);
    const foundUser = await userQueries.findUser({ id: req.tokenData.userId });
    if (foundUser) {
      const {
        firstName,
        lastName,
        role,
        id,
        avatar,
        displayName,
        balance,
        email,
      } = foundUser;
      req.tokenData = {
        ...req.tokenData,
        firstName,
        lastName,
        role,
        id,
        avatar,
        displayName,
        balance,
        email,
      };
    }
    next();
  } catch (err) {
    next(new TokenError());
  }
};
