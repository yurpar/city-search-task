import { RequestHandler } from "express";

export const get:RequestHandler = (req, res) => {
    res.json({ suggestions: [] });
}
