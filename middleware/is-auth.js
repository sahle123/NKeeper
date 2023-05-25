const logger = require('../utils/logger');

module.exports = (req, res, next) => {
    //console.log(req.session);
    if(!req.session.isLoggedIn) {
        logger.logError("This user is not authenticated. Redirecting to login page...");
        return res.redirect('/login');
    }
    next();
};