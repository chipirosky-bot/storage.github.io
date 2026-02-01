import express from "express";
import cors from "cors";
import { db } from "./db.js";
import "dotenv/config";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./filebase.js";

import path from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
dotenv.config({ path: path.resolve("../.env") }); // Cargar .env desde la raíz

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

/**
 * Test
 */
const rows = await db.all("SELECT * FROM items");
console.log("ITEMS EN DB:", rows);

/**
 * Obtener contenido de una carpeta
 * id = null → raíz
 */
app.get("/api/folder/:id", async (req, res) => {
  const { id } = req.params;

  let folders, files;

  if (id === "root") {
    folders = await db.all(
      "SELECT id, name FROM items WHERE type = 'folder' AND parent_id IS NULL"
    );

    files = await db.all(
      "SELECT id, name FROM items WHERE type = 'file' AND parent_id IS NULL"
    );
  } else {
    folders = await db.all(
      "SELECT id, name FROM items WHERE type = 'folder' AND parent_id = ?",
      [id]
    );

    files = await db.all(
      "SELECT id, name FROM items WHERE type = 'file' AND parent_id = ?",
      [id]
    );
  }

  res.json({ folders, files });
});



app.get("/api/file/:id/download", async (req, res) => {
  const file = await db.get(
    "SELECT name, file_path FROM items WHERE id = ? AND type = 'file'",
    [req.params.id]
  );

  if (!file) {
    return res.status(404).send("File not found");
  }

  const command = new GetObjectCommand({
    Bucket: "my-own-storage",
    Key: file.file_path
  });

  const data = await s3.send(command);

  // res.setHeader(
  //   "Content-Disposition",
  //   `attachment; filename="${file.name}"`
  // );
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename="${file.name}"`
  );

  data.Body.pipe(res);
});



app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
