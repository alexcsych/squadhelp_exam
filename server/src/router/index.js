const express = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const hashPass = require('../middlewares/hashPassMiddle');
const userController = require('../controllers/userController');
const contestController = require('../controllers/contestController');
const checkToken = require('../middlewares/checkToken');
const validators = require('../middlewares/validators');
const chatQueries = require('../controllers/queries/chatQueries');
const upload = require('../utils/fileUpload');
const router = express.Router();

router.post(
  '/registration',
  validators.validateRegistrationData,
  hashPass,
  userController.registration
);

router.put('/login', validators.validateLogin, userController.login);

router.get(
  '/dataForContest',
  checkToken.checkToken,
  contestController.dataForContest
);

router.put(
  '/pay',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomer,
  upload.uploadContestFiles,
  basicMiddlewares.parseBody,
  validators.validateContestCreation,
  userController.payment
);

router.get(
  '/getCustomersContests',
  checkToken.checkToken,
  contestController.getCustomersContests
);

router.get(
  '/getContestById',
  checkToken.checkToken,
  basicMiddlewares.canGetContest,
  contestController.getContestById
);

router.post(
  '/getAllContests',
  checkToken.checkToken,
  basicMiddlewares.onlyForCreative,
  contestController.getContests
);

router.get('/getUser', checkToken.checkAuth);

router.put(
  '/updateContest',
  checkToken.checkToken,
  upload.updateContestFile,
  contestController.updateContest
);

router.get(
  '/offers',
  checkToken.checkToken,
  basicMiddlewares.onlyForModerator,
  contestController.getOffers
);

router.put(
  '/offers',
  checkToken.checkToken,
  basicMiddlewares.onlyForModerator,
  contestController.updateOffer
);

router.post(
  '/setNewOffer',
  checkToken.checkToken,
  upload.uploadLogoFiles,
  basicMiddlewares.canSendOffer,
  contestController.setNewOffer
);

router.put(
  '/setOfferStatus',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomerWhoCreateContest,
  contestController.setOfferStatus
);

router.put(
  '/changeMark',
  checkToken.checkToken,
  basicMiddlewares.onlyForCustomer,
  userController.changeMark
);

router.put(
  '/updateUser',
  checkToken.checkToken,
  upload.uploadAvatar,
  userController.updateUser
);

router.put(
  '/cashout',
  checkToken.checkToken,
  basicMiddlewares.onlyForCreative,
  userController.cashout
);

router.post('/newMessage', checkToken.checkToken, chatQueries.addMessage);

router.get('/getChat', checkToken.checkToken, chatQueries.getChat);

router.get('/getPreview', checkToken.checkToken, chatQueries.getPreview);

router.put('/blackList', checkToken.checkToken, chatQueries.blackList);

router.put('/favorite', checkToken.checkToken, chatQueries.favoriteChat);

router.post('/createCatalog', checkToken.checkToken, chatQueries.createCatalog);

router.put(
  '/updateNameCatalog',
  checkToken.checkToken,
  chatQueries.updateNameCatalog
);

router.post(
  '/addNewChatToCatalog',
  checkToken.checkToken,
  chatQueries.addNewChatToCatalog
);

router.post(
  '/removeChatFromCatalog',
  checkToken.checkToken,
  chatQueries.removeChatFromCatalog
);

router.delete(
  '/deleteCatalog',
  checkToken.checkToken,
  chatQueries.deleteCatalog
);

router.get('/getCatalogs', checkToken.checkToken, chatQueries.getCatalogs);

module.exports = router;
