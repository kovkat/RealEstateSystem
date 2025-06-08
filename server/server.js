import express from 'express';
import propertyRoutes from './routes/properties.js';
import { sequelize } from './db/index.js';
import cron from 'node-cron';
import { getAllOlxProperties } from './parsers/olxParser.js';
import { getAllDomriaProperties } from './parsers/domriaParser.js';
import { getAllLunProperties } from './parsers/lunparser.js';
import { Property, PropertyImage } from './models/Property.js';
import mlService from './mlService.js';
import { Review, ReviewImage } from './models/Review.js';
import cache from './cache.js';
import logger from './logger.js';

const app = express();
app.use(express.json());

// Підключення роутів для роботи з нерухомістю
app.use('/api/properties', propertyRoutes);

async function updateProperties() {
    try {
        console.log('🔄 Починаємо оновлення даних з зовнішніх джерел...');

        // Отримання даних з парсерів
        const [olxProps, domriaProps, lunProps] = await Promise.all([
            getAllOlxProperties(),
            getAllDomriaProperties(),
            getAllLunProperties()
        ]);

        // Об'єднання всіх оголошень
        const allProps = [...olxProps, ...domriaProps, ...lunProps];

        // Фільтрація дублікатів за унікальним посиланням
        const uniquePropsMap = new Map();
        allProps.forEach(prop => {
            if (!uniquePropsMap.has(prop.link)) {
                uniquePropsMap.set(prop.link, prop);
            }
        });

        const uniqueProps = Array.from(uniquePropsMap.values());

        // Очищення старих записів
        await PropertyImage.destroy({ where: {} });
        await Property.destroy({ where: {} });

        // Збереження нових оголошень у базу
        for (const prop of uniqueProps) {
            const createdProp = await Property.create({
                title: prop.title || '',
                description: prop.description || '',
                address: prop.location || '',
                city: prop.city || '',
                rooms: prop.rooms || null,
                area: prop.area || null,
                type: prop.type || 'apartment',
                source: prop.source || '',
                link: prop.link || '',
                price: prop.price || null,
            });
            if (prop.images && prop.images.length > 0) {
                for (const imgUrl of prop.images) {
                    await PropertyImage.create({
                        propertyId: createdProp.id,
                        url: imgUrl
                    });
                }
            }
        }

        console.log(`✅ Оновлено ${uniqueProps.length} оголошень`);
    } catch (error) {
        console.error('❌ Помилка оновлення даних:', error);
        if (logger) logger.error('Помилка оновлення даних: ' + error.message);
    }
}

// Запускаємо оновлення даних одразу при старті сервера
updateProperties();

// Налаштування планувальника: оновлення кожні 6 годин
cron.schedule('0 */6 * * *', () => {
    console.log('🕕 Запуск запланованого оновлення даних');
    updateProperties();
});

// Виклик моделей машинного навчання для оцінки шахрайства та рейтингу
app.use(async(req, res, next) => {
    try {
        const properties = await Property.findAll();
        await mlService.evaluateProperties(properties);
        next();
    } catch (error) {
        console.error('Помилка машинного навчання:', error);
        if (logger) logger.error('Помилка машинного навчання: ' + error.message);
        next(error);
    }
});


// Забезпечення кешування
app.use(cache.middleware);

// Логування запитів та помилок
app.use(logger.requestLogger);
app.use(logger.errorLogger);

(async() => {
    try {
        await sequelize.authenticate();
        console.log('✅ Підключення до бази даних встановлено');

        // Синхронізація структури БД із моделями
        await sequelize.sync({ alter: true });
        console.log('📦 Синхронізація таблиць завершена');

    } catch (error) {
        console.error('Помилка при запуску сервера:', error);
        if (logger) logger.error('Помилка при запуску сервера: ' + error.message);
    }
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});