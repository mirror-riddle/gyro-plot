const fs = require("fs");
const CSV = require("csv");

if (process.argv.length < 3) {
  return;
}

const CSV_PATH = process.argv[2];
const CSV_DATA_PATH = "./csv-data.js";

const parser1 = CSV.parse({ delimiter: "," }, (error, data) => {
  if (error) {
    throw error;
  }
  const outputObj = dataHandler(data, (output, item) => {
    output.indexs.push(parseInt(item[0], 10));
    output.timestamps.push(parseInt(item[1], 10) / 1e6);
    output.y.push(parseInt(item[2], 10));
    output.x.push(parseInt(item[3], 10));
    output.z.push(parseInt(item[4], 10));
  });
  saveJS(outputObj, CSV_DATA_PATH);
});
fs.createReadStream(CSV_PATH).pipe(parser1);

function dataHandler(data, itemHandler) {
  const output = {
    indexs: [],
    timestamps: [],
    x: [],
    y: [],
    z: [],
  }
  const length = data.length;
  for (let i = 1; i < length; i++) {
    const item = data[i];
    itemHandler(output, item);
  }
  return output;
}

function saveJS(output, outputPath) {
  const outputStr = "export default " + JSON.stringify(output, null, 2);
  fs.writeFile(outputPath, outputStr, {}, (error) => {
    if (error) {
      throw error;
    }
  });
}
