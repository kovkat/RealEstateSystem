const logger = {
    requestLogger: (req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
        next();
    },

    errorLogger: (err, req, res, next) => {
        console.error(`[ERROR ${new Date().toISOString()}] ${err.stack}`);
        res.status(500).json({ error: 'Внутрішня помилка сервера' });
    },
};

export default logger;