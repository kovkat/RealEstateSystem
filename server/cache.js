const cacheStore = new Map();

const cache = {
    middleware: (req, res, next) => {
        const key = req.originalUrl;
        if (cacheStore.has(key)) {
            return res.json(cacheStore.get(key));
        }

        const originalJson = res.json.bind(res);
        res.json = (body) => {
            cacheStore.set(key, body);
            originalJson(body);
        };

        next();
    },
};

export default cache;