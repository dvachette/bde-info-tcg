import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from '#routers/authRouter.js';
import cors from 'cors';
import { config } from '#config/config.js';
import { adminCollectionRouter, collectionRouter } from '#routers/collectionRouter.js';
import { cardRouter } from '#routers/cardRouter.js';
const app = express();

// Setup cors middleware to allow requests from the frontend
app.use(cors({
    origin: config.FRONTEND_URL, // Allow requests from the frontend URL
    credentials: true, // Allow cookies to be sent with requests
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRouter);
app.use("/collection", collectionRouter);
app.use("/admin/collection", adminCollectionRouter);
app.use("/cards", cardRouter)


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});