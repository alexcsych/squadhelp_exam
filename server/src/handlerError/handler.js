const fs = require('fs');
const stacktrace = require('stacktrace-js');
const path = require('path');
const filePath = path.resolve(__dirname, '..', '..', 'public/errorsLogger');

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath, {
    recursive: true,
  });
}

const fileName = `${filePath}/errorsLogger.txt`;

const logError = async err => {
  try {
    let existingData;
    let logData;

    if (fs.existsSync(fileName)) {
      existingData = fs.readFileSync(fileName, 'utf8');
      if (existingData.trim() !== '') {
        try {
          logData = JSON.parse(existingData);
        } catch (error) {
          console.error('Error:', error);
          logData = [];
        }
      }
    }

    const stats = await fs.promises.stat(fileName);
    const modificationDate = stats.mtime;
    if (
      modificationDate.getDate() < new Date().getDate() ||
      modificationDate.getMonth() < new Date().getMonth() ||
      modificationDate.getFullYear() < new Date().getFullYear()
    ) {
      const updatedData = logData.map(obj => {
        const { message, code, time } = obj;
        return { message, code, time };
      });
      const allLogs = JSON.stringify(updatedData);
      await fs.promises.writeFile(
        `${filePath}/${modificationDate.getFullYear()}-${
          modificationDate.getMonth() + 1
        }-${modificationDate.getDate()}.txt`,
        allLogs
      );
      logData = [];
    }

    const stackframes = await stacktrace.fromError(err);
    const stackTrace = stackframes.map(sf => sf.toString()).join(' ');

    const log = {
      message: err.message || 'Server Error',
      time: new Date().getTime(),
      code: err.code || 500,
      stackTrace: stackTrace,
    };

    logData.push(log);
    const allLogs = JSON.stringify(logData);
    fs.promises.writeFile(fileName, allLogs).catch(error => {
      console.error('Error writing file:', error);
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = async (err, req, res, next) => {
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

  await logError(err);
};
