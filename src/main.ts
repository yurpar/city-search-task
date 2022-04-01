import express from 'express';
const main = express();
const port = 3000;

main.get('/', (req, res) => {
    res.json({ status: "OK" });
});

main.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
