export const errorHandler = (err, req, res, next) => {
    console.error('An error occurred', err.stack);
    res.status(500).send('Internal Server Error!');
}