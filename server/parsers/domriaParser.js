// server/parsers/domriaParser.js
import puppeteer from 'puppeteer';

function cleanPrice(priceStr) {
    const digits = priceStr.replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : 0;
}

async function getDomriaPropertiesByCity(citySlug) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
    );

    const baseUrl = `https://dom.ria.com/uk/arenda-kvartir/${citySlug}/?page=`;
    const allProperties = [];
    let pageNum = 1;

    while (true) {
        await page.goto(baseUrl + pageNum, { waitUntil: 'networkidle2', timeout: 60000 });

        const links = await page.evaluate(() => {
            const cards = document.querySelectorAll('.ticket-item a.ticket-link');
            return Array.from(cards).map(link => link.href);
        });

        if (links.length === 0) break;

        for (const link of links) {
            const itemPage = await browser.newPage();
            await itemPage.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });

            const data = await itemPage.evaluate(() => {
                const titleEl = document.querySelector('h1');
                const title = titleEl ? titleEl.innerText.trim() : '';

                const priceEl = document.querySelector('.price_value');
                const price = priceEl ? priceEl.innerText.trim() : '';

                const descEl = document.querySelector('.full-description');
                const description = descEl ? descEl.innerText.trim() : '';

                const locEl = document.querySelector('.address');
                const location = locEl ? locEl.innerText.trim() : '';

                const areaMatch = description.match(/(\d{1,4})\s?(м²|м2|m²|m2)/i);
                const area = areaMatch ? parseInt(areaMatch[1], 10) : null;

                const roomsMatch = description.match(/(\d)[- ]?кімн/i);
                const rooms = roomsMatch ? parseInt(roomsMatch[1], 10) : null;

                const imageEls = document.querySelectorAll('.new-gallery img');
                const images = Array.from(imageEls).map(img => img.src);

                return { title, price, description, location, area, rooms, images };
            });

            allProperties.push({
                ...data,
                price: cleanPrice(data.price),
                link,
                city: citySlug === 'kiev' ? 'Київ' : citySlug.charAt(0).toUpperCase() + citySlug.slice(1),
                type: 'apartment',
            });

            await itemPage.close();
        }

        pageNum++;
    }

    await browser.close();
    return allProperties;
}

async function getAllDomriaProperties() {
    const cities = ['kiev', 'lviv', 'odesa', 'kharkiv'];
    let results = [];
    for (const city of cities) {
        const props = await getDomriaPropertiesByCity(city);
        results = results.concat(props);
    }
    return results;
}

export { getAllDomriaProperties };