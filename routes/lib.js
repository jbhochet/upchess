import express from "express";
import { fileURLToPath } from 'node:url';
import path from "path";

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// bootstrap
router.use("/bootstrap", express.static(path.join(__dirname, "../node_modules/bootstrap/dist")));

// jquery
router.use("/jquery", express.static(path.join(__dirname, "../node_modules/jquery/dist")));

// chessboard.js
router.use("/chessboardjs", express.static(path.join(__dirname, "../node_modules/@chrisoakman/chessboardjs/dist")));

// chess.js
router.use("/chess", express.static(path.join(__dirname, "../node_modules/chess.js/dist")));

export default router;
