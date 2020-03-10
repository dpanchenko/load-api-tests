const fs = require('fs');
const readline = require('readline');
const { once } = require('events');

module.exports = async (fileName, lineReadCallaback) => {
  const fileStream = fs.createReadStream(fileName);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  rl.on('line', lineReadCallaback);

  await once(rl, 'close');
};
