const fs = require("fs");
const CSV = require("csv");

const num = (process.argv.length >= 3) ? process.argv[2] : 1;

const CSV_PATH = `./csv/csv-${num}.csv`;
const CSV_DATA_PATH = "./csv-data.js";

const BBL_CSV_PATH = `./csv/bbl-csv-${num}.csv`;
const BBL_CSV_DATA_PATH = "./bbl-csv-data.js";

function errorHandler(error, data) {
  if (error) {
    throw error;
  } else {
    // console.log(data);
  }
}

function dataHandler(data, itemHandler) {
  const output = {
    indexs: [],
    timestamps: [],
    x: [],
    y: [],
    z: [],
  }
  const length = data.length;
  const startTime = parseInt(data[1][1], 10);
  const endTime = parseInt(data[length - 1][1], 10);
  console.log(startTime, endTime - startTime);
  for (let i = 1; i < length; i++) {
    const item = data[i];
    itemHandler(output, item, startTime);
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

function findMaxValueTimestamp(outputObj) {
  let max = outputObj.x[0];
  const length = outputObj.x.length
  for (let i = 0; i< length; i++) {
    if (outputObj.x[i] > max) {
      max = outputObj.x[i];
    }
  }
  const maxIndex = outputObj.x.indexOf(max);
  const maxTimestamp = outputObj.timestamps[maxIndex];
  console.log(max, maxIndex);
  console.log("max x timestamp: ", maxTimestamp);
  return maxTimestamp;
}

const handleGyroCSV = new Promise((resolve, reject) => {
  const parser1 = CSV.parse({ delimiter: "," }, (error, data) => {
    if (error) {
      reject(error)
    }
    const outputObj = dataHandler(data, (output, item) => {
      output.indexs.push(parseInt(item[0], 10));
      output.timestamps.push(parseInt(item[1], 10));
      output.y.push(parseInt(item[2], 10));
      output.x.push(parseInt(item[3], 10));
      output.z.push(parseInt(item[4], 10));
    });
    resolve(outputObj);
  });
  fs.createReadStream(CSV_PATH).pipe(parser1);
});

const handleBBLCSV = new Promise((resolve, reject) => {
  const parser2 = CSV.parse({ delimiter: ",", relaxColumnCountMore: true, fromLine: 113  }, (error, data) => {
    if (error) {
      reject(error)
    }
    const outputObj = dataHandler(data, (output, item) => {
      output.indexs.push(parseInt(item[0], 10));
      output.timestamps.push(parseInt(item[1], 10));
      output.y.push(parseInt(item[25], 10));
      output.x.push(parseInt(item[26], 10));
      output.z.push(parseInt(item[27], 10));
    });
    resolve(outputObj);
  });

  fs.createReadStream(BBL_CSV_PATH).pipe(parser2);
});



Promise.all([handleGyroCSV, handleBBLCSV]).then(([ gyroOutput, bblOutput ]) => {
    const ts1 =  findMaxValueTimestamp(gyroOutput);
    const ts2 = findMaxValueTimestamp(bblOutput);
    const gap = ts2 - ts1;

    console.log("gap is: ", gap);

    bblOutput.timestamps = bblOutput.timestamps.map((ts) => ts - gap);

    saveJS(gyroOutput, CSV_DATA_PATH);
    saveJS(bblOutput, BBL_CSV_DATA_PATH);
}).catch((error) => {
  throw error;
})
