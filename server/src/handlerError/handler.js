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
let existingData = '';

module.exports = async (err, req, res, next) => {
  if (fs.existsSync(fileName)) {
    existingData = fs.readFileSync(fileName, 'utf8');
  }

  try {
    const stats = await fs.promises.stat(fileName);
    const modificationDate = stats.mtime;
    if (
      modificationDate.getDate() < new Date().getDate() ||
      modificationDate.getMonth() < new Date().getMonth() ||
      modificationDate.getFullYear() < new Date().getFullYear()
    ) {
      const fileData = existingData
        .split('\n')
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (error) {
            console.error('Error parsing JSON:', error);
            return null;
          }
        })
        .filter(data => data !== null);
      const updatedData = fileData
        .map(obj => {
          const { message, code, time } = obj;
          return { message, code, time };
        })
        .map(obj => JSON.stringify(obj))
        .join('\n');
      await fs.promises.writeFile(
        `${filePath}/${modificationDate.getDate()}-${modificationDate.getMonth()}-${modificationDate.getFullYear()}.txt`,
        updatedData
      );
      await fs.promises.writeFile(fileName, '');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }

  const stackTracePromise = stacktrace.fromError(err);

  stackTracePromise.then(stackframes => {
    const stackTrace = stackframes.map(sf => sf.toString()).join(' ');
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
      code: err.code || 500,
      stackTrace: stackTrace,
    };
    if (fs.existsSync(fileName)) {
      existingData = fs.readFileSync(fileName, 'utf8');
    }
    fs.promises
      .writeFile(fileName, existingData + JSON.stringify(log) + '\n')
      .catch(error => {
        console.error('Error writing file:', error);
      });
  });
};
