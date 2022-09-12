// Based on https://moralis.io/how-to-bulk-mint-nfts-batch-minting-guide/

require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const imageDir = path.join(__dirname, "..", "example", "images");
const metadataDir = path.join(__dirname, "..", "example", "metadata");
const API_KEY = process.env.MORALIS_API_KEY;

async function bulkUpload() {
  const imageFiles = await readImageFiles(); // Error: promises undefined
  const promises = imageFiles[0];
  const images = imageFiles[1];

  await Promise.all(promises);
  const imagePathArray = await post(images);
  const ipfsLinkImages = JSON.parse(imagePathArray)[0]["path"].substr(0, 87);
  console.log("Posted", images.length, "images to", ipfsLinkImages);

  const imageHash = JSON.parse(imagePathArray)[0]["path"].substr(34, 46);
  const metadataFiles = await readMetadataFiles(imageHash);
  const metadataPathArray = await post(metadataFiles);
  const ipfsLinkMetadata = JSON.parse(metadataPathArray)[0]["path"].substr(
    0,
    87
  );
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
      // Insert IPFS link of image
      imageName = file.substr(0, file.length - 4) + ".png";
      data["image"] = "ipfs://" + imageHash + "/images/" + imageName;
      metadataFiles.push({
        path: `metadata/${file}`,
        content: data,
      });
    });
  });
}

async function readImageFiles() {
  let promises = [];
  let images = [];

  const files = await fs.promises.readdir(imageDir, function (err, files) {
    if (err) {
      console.error(err);
    } else return files;
  });

  files.forEach(function (file) {
    const filePath = path.join(imageDir, file);
    promises.push(
      new Promise((res, rej) => {
        fs.readFile(filePath, (err, data) => {
          if (err) rej();
          images.push({
            path: `images/${file}`,
            content: data.toString("base64"),
          });
          res();
        });
      })
    );
  });
  return [promises, images];
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
