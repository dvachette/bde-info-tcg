import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routers/authRouter.js';

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRouter);


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});