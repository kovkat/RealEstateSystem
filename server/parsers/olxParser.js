// server/parsers/olxParser.js
import puppeteer from 'puppeteer';

function cleanPrice(priceStr) {
    if (!priceStr) return 0;
    if (typeof priceStr === 'number') return priceStr;
    const digits = priceStr.replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : 0;
}

function fixImageUrl(imgUrl) {
    if (!imgUrl) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (imgUrl.startsWith('http')) return imgUrl;
    return `https://www.olx.ua${imgUrl}`;
}

async function getOlxPropertiesByCity(citySlug) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0 Safari/537.36'
    );

    const baseUrl = `https://www.olx.ua/uk/nedvizhimost/kvartiry/dolgosrochnaya-arenda-kvartir/${citySlug}/`;
    let currentPage = 1;
    const allProperties = [];

    while (true) {
        const url = `${baseUrl}?page=${currentPage}`;
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        const propertiesOnPage = await page.evaluate(() => {
            const cards = document.querySelectorAll('div[data-testid="l-card"]');
            const data = [];

            cards.forEach(card => {
                const titleEl = card.querySelector('h6');
                const priceEl = card.querySelector('p[data-testid="ad-price"]');
                const linkEl = card.querySelector('a');
                const locationEl = card.querySelector('p[data-testid="location-date"]');
                const descriptionEl = card.querySelector('div[data-testid="ad-description"]');

                const title = titleEl ? titleEl.innerText.trim() : '';
                const price = priceEl ? priceEl.innerText.trim() : '';
                const link = linkEl ? linkEl.href : '';
                const location = locationEl ? locationEl.innerText.trim() : '';
                const description = descriptionEl ? descriptionEl.innerText.trim() : '';
                const images = Array.from(card.querySelectorAll('img')).map(img => img.src);

                if (title && price && link) {
                    data.push({ title, price, link, location, description, images });
                }
            });

            return data;
        });

        if (propertiesOnPage.length === 0) {
            break;
        }

        allProperties.push(...propertiesOnPage);
        currentPage++;

        const hasNextPage = await page.evaluate(() => {
            const nextBtn = document.querySelector('a[data-testid="pagination-forward"]');
            return !!nextBtn && !nextBtn.getAttribute('aria-disabled');
        });

        if (!hasNextPage) break;
    }

    await browser.close();

    return allProperties.map(item => {
        const areaMatch = (item.description && item.description.match(/(\d{1,4})\s?м²/)) || (item.description && item.description.match(/(\d{1,4})\s?m/));
        const area = areaMatch ? parseInt(areaMatch[1], 10) : null;

        const roomsMatch = item.title.match(/(\d)[- ]?к/i) || (item.description && item.description.match(/(\d)[- ]?кімн/i));
        const rooms = roomsMatch ? parseInt(roomsMatch[1], 10) : null;

        const cityMatch = item.location && item.location.match(/^\s*([\wа-яА-ЯіІїЇєЄґҐ]+),?\s+/);
        const city = cityMatch ? cityMatch[1] : null;

        return {
            title: item.title,
            price: cleanPrice(item.price),
            link: item.link,
            location: item.location,
            description: item.description,
            area,
            rooms,
            city,
            images: item.images.map(fixImageUrl),
        };
    });
}

async function getAllOlxProperties() {
    const cities = ['kyiv', 'lviv', 'odesa', 'kharkiv'];
    let results = [];
    for (const city of cities) {
        const props = await getOlxPropertiesByCity(city);
        results = results.concat(props);
    }
    return results;
}

export { getAllOlxProperties };