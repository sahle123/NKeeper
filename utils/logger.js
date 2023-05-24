const MONGODB_URI = require('../utils/database').MONGODB_URI;

const LumberMill = require('../models/logs');

// Logs error message to console
exports.logError = (errMessage) => {
  const msg = "[-] ERROR: " + String(errMessage);

  LumberMill
    .create({
      message: String(msg),
      databaseUri: MONGODB_URI
    })
    .catch(err => { _lumberMillFailed(err); });

  // For terminal.
  console.log(`\u001b[0;31m${msg}\u001b[0m`);
};

// Informational logs
exports.log = (message) => {
  const msg = "[i]: " + String(message);

  LumberMill
    .create({
      message: String(msg),
      databaseUri: MONGODB_URI
    })
    .catch(err => { _lumberMillFailed(err); });

  // For terminal.
  console.log(`\u001b[0;0m${msg}`);
};

// Informational log, but with a '+' sign. Indicating a positive message.
exports.plog = (message) => {
  const msg = "[+]: " + String(message);

  LumberMill
    .create({
      message: String(msg),
      databaseUri: MONGODB_URI
    })
    .catch(err => { _lumberMillFailed(err); });

  // For terminal.
  console.log(`\u001b[0;32m${msg}\u001b[0m`);
};

// DRY code for MongoDB logger failure.
function _lumberMillFailed(err) {
  console.log("[-] LumberMill is NOT working. Issue: " + err);
};