const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, '..', '..', 'public/errorsLogger');

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath, {
    recursive: true,
  });
}

module.exports = (err, req, res, next) => {
  const stackTrace = {};
  console.log(err);
  if (
    err.message ===
      'new row for relation "Banks" violates check constraint "Banks_balance_ck"' ||
    err.message ===
      'new row for relation "Users" violates check constraint "Users_balance_ck"'
  ) {
    err.message = 'Not Enough money';
    err.code = 406;
  }
  if (!err.message || !err.code) {
    res.status(500).send('Server Error');
  } else {
    res.status(err.code).send(err.message);
  }
  const log = {
    message: err.message || 'Server Error',
    time: new Date().getTime(),
    code: err.code || '500',
    // stackTrace: { stackTrace },
  };
  const fileName = `${filePath}/errorsLogger.txt`;
  let existingData = '';
  if (fs.existsSync(fileName)) {
    existingData = fs.readFileSync(fileName, 'utf8');
  }
  fs.writeFile(
    fileName,
    existingData + JSON.stringify(log) + '\n',
    function (err) {
      if (err) throw err;
    }
  );
};
