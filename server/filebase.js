import { S3Client } from "@aws-sdk/client-s3";

// const AWS = require('aws-sdk');

export const s3 = new S3Client({
  endpoint: "https://s3.filebase.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.FILEBASE_KEY,
    secretAccessKey: process.env.FILEBASE_SECRET
  }
});


// const fs = require('fs');
// const path = require('path');

// // Configura tus credenciales de Filebase
// const s3 = new AWS.S3({
//   endpoint: 'https://s3.filebase.com', // endpoint S3 de Filebase
//   accessKeyId: 'TU_ACCESS_KEY',
//   secretAccessKey: 'TU_SECRET_KEY',
//   s3ForcePathStyle: true, // necesario para Filebase
// });
