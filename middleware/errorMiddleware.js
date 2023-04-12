const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

const errorHandler = (err, req, res, next ) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message : err.message,
        stack : process.env.NODE_ENV === "production" ? null : err.stack,   // In summary, the stack is a fundamental concept in programming that is used to keep track of the current state of a program's execution and is often used for debugging and error handling purposes.
    })
}

module.exports = {notFound, errorHandler};