import express from 'express'

const app = express();

const PORT = process.env.NODEPORT ?? 3001

app.listen(PORT, () => console.log('Running on', PORT))