// server/parsers/lunParser.js
import puppeteer from 'puppeteer';

function cleanPrice(priceStr) {
    if (!priceStr) return 0;
    const digits = priceStr.replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : 0;
}

async function getLunPropertiesByCity(citySlug) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
    );

    const baseUrl = `https://www.lun.ua/uk/arenda-kvartir-${citySlug}`;
    const allProperties = [];
    let currentPage = 1;
    let hasNextPage = true;

    while (hasNextPage) {
        const url = `${baseUrl}?page=${currentPage}`;
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        const propertiesOnPage = await page.evaluate(() => {
            const cards = document.querySelectorAll('.property-card-list__item');
            const data = [];

            cards.forEach(card => {
                const titleEl = card.querySelector('.property-card__title');
                const priceEl = card.querySelector('.price');
                const linkEl = card.querySelector('a.property-card__link');
                const descEl = card.querySelector('.property-card__description');
                const locationEl = card.querySelector('.property-card__location');
                const imageEls = card.querySelectorAll('img');

                const title = titleEl ? titleEl.innerText.trim() : '';
                const price = priceEl ? priceEl.innerText.trim() : '';
                const link = linkEl ? linkEl.href : '';
                const description = descEl ? descEl.innerText.trim() : '';
                const location = locationEl ? locationEl.innerText.trim() : '';

                const images = Array.from(imageEls).map(img => img.src);

                if (title && price && link) {
                    data.push({ title, price, link, description, location, images });
                }
            });

            return data;
        });

        if (propertiesOnPage.length === 0) {
            hasNextPage = false;
            break;
        }

        allProperties.push(...propertiesOnPage);

        // Перевірка на кнопку "Наступна сторінка"
        hasNextPage = await page.evaluate(() => {
            const nextBtn = document.querySelector('a.paging-next');
            return nextBtn && !nextBtn.classList.contains('disabled');
        });

        currentPage++;
    }

    await browser.close();

    // Обробка і парсинг додаткових полів: площа, кімнати, місто
    return allProperties.map(item => {
        const areaMatch = item.description.match(/(\d{1,4})\s?м²/i);
        const area = areaMatch ? parseInt(areaMatch[1], 10) : null;

        const roomsMatch = item.title.match(/(\d)[- ]?кімн/i);
        const rooms = roomsMatch ? parseInt(roomsMatch[1], 10) : null;

        const cityMatch = item.location.match(/([\wа-яА-ЯіІїЇєЄґҐ]+)/);
        const cityName = cityMatch ? cityMatch[1] : citySlug;

        return {
            ...item,
            price: cleanPrice(item.price),
            area,
            rooms,
            city: cityName,
            type: 'apartment',
        };
    });
}

async function getAllLunProperties() {
    const cities = ['kyiv', 'lviv', 'odesa', 'kharkiv'];
    let results = [];
    for (const city of cities) {
        const props = await getLunPropertiesByCity(city);
        results = results.concat(props);
    }
    return results;
}

export { getAllLunProperties };