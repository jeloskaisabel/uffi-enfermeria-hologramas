import cors from 'cors';

const corsOptions = {
    origin: '*',
};

export const configCors = () => cors(corsOptions);