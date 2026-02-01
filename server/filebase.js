import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  endpoint: "https://s3.filebase.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.FILEBASE_KEY,
    secretAccessKey: process.env.FILEBASE_SECRET
  }
});
