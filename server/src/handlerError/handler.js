const fs = require('fs');
const cron = require('node-cron');
const stackTrace = require('stack-trace');
const path = require('path');
const filePath = path.resolve(__dirname, '..', '..', 'public/errorsLogger');
const fileName = `${filePath}/errorsLogger.txt`;

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath, {
    recursive: true,
  });
}

if (!fs.existsSync(fileName)) {
  fs.writeFileSync(fileName, '', 'utf-8');
}

async function logErrorToFile (error, filename) {
  const trace = stackTrace.parse(error);

  const logEntry = {
    message: error.message,
    time: Date.now(),
    code: error.code || 500,
    stackTrace: trace,
  };

  fs.appendFile(filename, JSON.stringify(logEntry, null, 2) + '\n\n', err => {
    if (err) {
      console.error('Ошибка записи в файл:', err);
    }
  });
}

function copyAndTransformLogFile (srcFile, destFile) {
  fs.readFile(srcFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка при чтении файла:', err);
      return;
    }

    const logEntries = data
      .trim()
      .split('\n\n')
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          console.error('Ошибка при парсинге строки:', e);
          return null;
        }
      })
      .filter(entry => entry !== null);

    const transformedEntries = logEntries.map(entry => ({
      message: entry.message,
      code: entry.code,
      time: entry.time,
    }));

    fs.writeFile(destFile, JSON.stringify(transformedEntries, null, 2), err => {
      if (err) {
        console.error('Ошибка при записи файла:', err);
      } else {
        fs.writeFile(srcFile, '', err => {
          if (err) {
            console.error('Ошибка при очистке файла:', err);
          }
        });
      }
    });
  });
}

cron.schedule('05 19 * * *', () => {
  const currentDate = new Date();
  const dayFileName = `${filePath}/errorLogs_${currentDate
    .toISOString()
    .slice(0, 10)}.txt`;

  copyAndTransformLogFile(fileName, dayFileName);
  console.log(
    `Содержимое файла ${fileName} скопировано и преобразовано в ${dayFileName} и очищено.`
  );
});

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
  await logErrorToFile(err, fileName);
};
