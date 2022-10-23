// Based on https://moralis.io/how-to-bulk-mint-nfts-batch-minting-guide/
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const API_KEY = process.env.MORALIS_API_KEY;

const readF = require('util').promisify(fs.readFile)

const imageDir = path.join(__dirname, "..", "example", "images");
const metadataDir = path.join(__dirname, "..", "example", "metadata");

var promises = [];
var images = [];

async function bulkUpload() {
  await readImageFiles();

  await Promise.all(promises);
  const imagePathArray = await post(images);
  const ipfsLinkImages = imagePathArray[0]["path"].substr(0, 87); // JSON.parse()
  console.log("Posted", images.length, "images to", ipfsLinkImages);

  const imageHash = imagePathArray[0]["path"].substr(34, 46);
  const metadataFiles = await readMetadataFiles(imageHash);
  const metadataPathArray = await post(metadataFiles);
  const ipfsLinkMetadata = metadataPathArray[0]["path"].substr(0, 87);
  console.log("Posted", images.length, "metadata files to", ipfsLinkMetadata);
}

async function readMetadataFiles(imageHash) {
  let metadataFiles = [];

  const files = fs.promises.readdir(imageDir, function (err, files) {
    if (err) {
      console.error(err);
    } else return files;
  });

  files.forEach(function (file) {
    const filePath = path.join(metadataDir, file);
    fs.readFile(filePath, (err, data) => {
      if (err) console.error(err);
      else {
        // Insert IPFS link of image
        imageName = file.substr(0, file.length - 5) + ".png";
        data["image"] = "ipfs://" + imageHash + "/images/" + imageName;
        metadataFiles.push({
          path: `metadata/${file}`,
          content: data,
        });
      }
    });
  });
  return metadataFiles;
}

async function readImageFiles() {
  const files = await fs.promises.readdir(imageDir, function (err, files) {
    if (err) console.error(err);
    else return files;
  });

  files.forEach(function (file) {
    test(file);
  });
}

async function test(file) {
  const filePath = path.join(imageDir, file);
  const content = await readF(filePath);
  const promise = new Promise((resolve, reject) => {
    if (!content) reject();
    else {
      images.push(content);
      resolve();
    }
  });
  promises.push(promise);
}

async function post(ipfsArray) {
  axios
    .post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", ipfsArray, {
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

bulkUpload();
