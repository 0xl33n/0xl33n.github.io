import { expect, test } from '@playwright/test';

const ARTICLE = 'writeups/flutter-reverse-engineering/';

/**
 * Fails a test on any console error (CSP violations, hydration errors, missing
 * files…). Tests that expect errors opt out with the `allows-console-errors` tag.
 */
let consoleErrors = [];
test.beforeEach(({ page }) => {
  consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
});
test.afterEach(({}, testInfo) => {
  if (testInfo.tags.includes('@allows-console-errors')) return;
  expect(consoleErrors, 'console errors').toEqual([]);
});

test('homepage renders real content with working links', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle('Neel Patel — Security Engineer');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('NEEL PATEL');
  await expect(page.locator('#experience')).toContainText('Bureau Veritas');
  await expect(page.locator('#contact').getByRole('link', { name: /github/ })).toHaveAttribute(
    'href',
    'https://github.com/0xl33n',
  );
  // LinkedIn is the contact method; no email address is published.
  await expect(page.locator('#contact').getByRole('link', { name: /connect --linkedin/ })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/neel929/',
  );
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  expect(await page.content()).not.toContain('@gmail.com');

  const resume = await page.request.get(await page.locator('a[href$="resume.pdf"]').first().getAttribute('href'));
  expect(resume.status()).toBe(200);
  expect(resume.headers()['content-type']).toContain('application/pdf');
});

test('projects show their details inline; only projects with a writeup link out', async ({ page }) => {
  await page.goto('./');
  const work = page.locator('#work');
  await expect(work).toContainText('ELF binary modification');
  await expect(work).toContainText('IPv6 tunneling');
  await expect(work.getByRole('link')).toHaveCount(1);
  await expect(page.locator('a[href*="binary-analysis"], a[href*="security-tooling"]')).toHaveCount(0);
});

test('minimizing shows a restore button in the middle of the screen', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Minimize terminal' }).click();

  const restore = page.getByRole('button', { name: 'restore window' });
  await expect(restore).toBeVisible();
  await expect(restore).toBeFocused();
  await expect(page.locator('#main')).toBeHidden();

  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeVisible();
  await expect(restore).toHaveCount(0);
});

test('project card opens its writeup; Escape returns to the writeups list, then home', async ({ page }) => {
  await page.goto('./');
  await page
    .locator('#work')
    .getByRole('link', { name: /flutter-reverse-engineering/ })
    .click();

  await expect(page).toHaveURL(new RegExp(`${ARTICLE}$`));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Practical Guide to Reverse Engineering Flutter Applications',
  );

  // The key handler attaches just after each page renders, so retry the key press until the page reacts
  // (a person can't press Escape within milliseconds of a page change).
  const pressEscapeUntil = (url) =>
    expect(async () => {
      await page.keyboard.press('Escape');
      await expect(page).toHaveURL(url, { timeout: 1000 });
    }).toPass({ timeout: 10000 });

  await pressEscapeUntil(/\/writeups\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Writeups');
  await pressEscapeUntil(/#writeups$/);
});

test('writeups list page shows every published writeup', async ({ page }) => {
  await page.goto('writeups/');
  await expect(page).toHaveTitle('Writeups · Neel Patel');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Writeups');
  const firstWriteup = page.getByRole('link', { name: /Practical Guide to Reverse Engineering Flutter/ });
  await expect(firstWriteup).toBeVisible();
  await firstWriteup.click();
  await expect(page).toHaveURL(new RegExp(`${ARTICLE}$`));
});

test('writeups are grouped by topic, and the article links back to its topic', async ({ page }) => {
  await page.goto(ARTICLE);
  await page.getByRole('link', { name: 'Mobile App Pentesting' }).click();
  await expect(page).toHaveURL(/\/writeups\/#mobile-app-pentesting$/);
  await expect(page.getByRole('heading', { level: 2, name: /Mobile App Pentesting/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Practical Guide to Reverse Engineering Flutter/ })).toBeVisible();
});

test('the first call to action on the homepage opens the writeups', async ({ page }) => {
  await page.goto('./');
  await page
    .locator('#home')
    .getByRole('link', { name: /cd ~\/writeups/ })
    .click();
  await expect(page).toHaveURL(/\/writeups\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Writeups');
});

test('homepage introduces the writeups and links to them', async ({ page }) => {
  await page.goto('./');
  const section = page.locator('#writeups');
  // An introduction and topics, not a list of individual writeups.
  await expect(section.getByRole('link', { name: /Practical Guide/ })).toHaveCount(0);
  await expect(section.getByRole('link', { name: 'Mobile App Pentesting' })).toHaveAttribute(
    'href',
    /\/writeups\/#mobile-app-pentesting$/,
  );
  await expect(section.getByRole('link', { name: /all writeups/ })).toHaveAttribute('href', /\/writeups\/$/);
});

test('writeup images load from the optimized files', async ({ page }) => {
  await page.goto(ARTICLE);
  const firstImage = page.locator('main img').first();
  await firstImage.scrollIntoViewIfNeeded();
  await expect(firstImage).toHaveAttribute('src', /\.webp$/);
  await expect.poll(() => firstImage.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
});

test('lightbox opens on click and closes with Escape without leaving the article', async ({ page }) => {
  await page.goto(ARTICLE);
  await page
    .getByRole('button', { name: /Enlarge image/ })
    .first()
    .click();
  const lightbox = page.getByRole('dialog');
  await expect(lightbox).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(lightbox).toBeHidden();
  await expect(page).toHaveURL(new RegExp(`${ARTICLE}$`));
});

test('terminal theme by default; light and dark are one click away and persist', async ({ page }) => {
  await page.goto(ARTICLE);
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-reader-theme', 'terminal');

  await page.getByRole('button', { name: /Reading settings/ }).click();
  const themes = page.getByRole('group', { name: 'Theme' });
  await expect(themes.getByRole('button', { name: 'Terminal' })).toHaveAttribute('aria-pressed', 'true');

  await themes.getByRole('button', { name: 'Dark' }).click();
  await expect(html).toHaveAttribute('data-reader-theme', 'dark');
  await themes.getByRole('button', { name: 'Light' }).click();
  await page.getByRole('group', { name: 'Font' }).getByRole('button', { name: 'Serif' }).click();

  await page.reload();
  await expect(html).toHaveAttribute('data-reader-theme', 'light');
  await expect(html).toHaveAttribute('data-reader-font', 'serif');
});

test('writeups use the homepage font by default and link back home', async ({ page }) => {
  await page.goto(ARTICLE);
  await expect(page.locator('html')).toHaveAttribute('data-reader-font', 'mono');
  const bodyFont = await page
    .locator('main article p')
    .first()
    .evaluate((el) => getComputedStyle(el).fontFamily);
  expect(bodyFont).toContain('JetBrains Mono');

  await page.getByRole('link', { name: 'Home' }).click();
  await expect(page).toHaveURL(/\/(portfolio\/)?$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('NEEL PATEL');
});

test('title-bar path links to the writeups list', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The path is hidden on narrow screens; Home covers navigation there.');
  await page.goto(ARTICLE);
  await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'writeups' }).click();
  await expect(page).toHaveURL(/\/writeups\/$/);
});

test('first-time readers see where to change the theme, once', async ({ page }) => {
  await page.goto(ARTICLE);
  const settingsButton = page.getByRole('button', { name: /Reading settings/ });
  await expect(settingsButton).toContainText('Theme');

  const tip = page.getByRole('note');
  await expect(tip).toContainText('Terminal');
  // The tip sits above the article header instead of covering it.
  const tipBox = await tip.boundingBox();
  const headerBox = await page.locator('article header').boundingBox();
  expect(tipBox.y + tipBox.height).toBeLessThanOrEqual(headerBox.y);
  await tip.getByRole('button', { name: 'Got it' }).click();
  await expect(tip).toBeHidden();

  await page.reload();
  await expect(page.getByRole('button', { name: /Reading settings/ })).toBeVisible();
  await expect(page.getByRole('note')).toHaveCount(0);
});

test('opening the settings also retires the tip', async ({ page }) => {
  await page.goto(ARTICLE);
  await expect(page.getByRole('note')).toBeVisible();
  await page.getByRole('button', { name: /Reading settings/ }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('note')).toHaveCount(0);
});

test('section links land on the heading', async ({ page }) => {
  await page.goto(`${ARTICLE}#dumping-the-flutter-heap`);
  const heading = page.locator('#dumping-the-flutter-heap');
  await expect(heading).toBeInViewport();
});

test('SEO files are generated', async ({ page }) => {
  for (const path of ['sitemap.xml', 'robots.txt', 'og/home.png', 'og/writeups.png', '.well-known/security.txt']) {
    const response = await page.request.get(path);
    expect(response.status(), path).toBe(200);
  }
});

test('unknown writeups return the 404 page', { tag: '@allows-console-errors' }, async ({ page }) => {
  const response = await page.goto('writeups/does-not-exist/');
  expect(response.status()).toBe(404);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('writeups are readable and the toolbar still navigates', async ({ page }, testInfo) => {
    await page.goto(ARTICLE);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Practical Guide to Reverse Engineering Flutter Applications',
    );
    // Phones hide Close on writeups, since "Writeups" goes to the same place.
    const close = page.getByRole('link', { name: 'Close', exact: true });
    if (testInfo.project.name === 'mobile') await expect(close).toBeHidden();
    else await expect(close).toHaveAttribute('href', /\/writeups\/$/);

    await page.getByRole('link', { name: 'Writeups', exact: true }).click();
    await expect(page).toHaveURL(/\/writeups\/$/);
  });
});

test.describe('custom cursor', () => {
  const cursor = (page) => page.locator('div[aria-hidden="true"][data-state]');
  const cursorColor = (page) =>
    page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--cursor-color').trim());

  test('follows the mouse and reacts to links and images (desktop)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Touch devices keep the system cursor.');
    await page.goto(ARTICLE);
    await page.mouse.move(200, 300);
    await expect(cursor(page)).toHaveAttribute('data-visible', 'true');
    await expect(page.locator('html')).toHaveClass(/has-custom-cursor/);

    await page.getByRole('link', { name: 'Home' }).hover();
    await expect(cursor(page)).toHaveAttribute('data-state', 'interactive');

    const image = page.getByRole('button', { name: /Enlarge image/ }).first();
    await image.scrollIntoViewIfNeeded();
    await image.hover();
    await expect(cursor(page)).toHaveAttribute('data-state', 'zoom');
  });

  test('changes with the reader theme', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Touch devices keep the system cursor.');
    await page.goto(ARTICLE);
    expect(await cursorColor(page)).toBe('#5ee39a'); // terminal

    await page.getByRole('button', { name: /Reading settings/ }).click();
    await page.getByRole('group', { name: 'Theme' }).getByRole('button', { name: 'Light' }).click();
    expect(await cursorColor(page)).toBe('#13723c');
    await page.getByRole('group', { name: 'Theme' }).getByRole('button', { name: 'Dark' }).click();
    expect(await cursorColor(page)).toBe('#4cd38a');
  });

  test('is not used on touch devices', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile-only check.');
    await page.goto('./');
    await expect(cursor(page)).toHaveCount(0);
    await expect(page.locator('html')).not.toHaveClass(/has-custom-cursor/);
  });

  test('respects reduced motion by keeping the system cursor', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    await page.mouse.move(200, 300);
    await expect(cursor(page)).toHaveCount(0);
    await expect(page.locator('html')).not.toHaveClass(/has-custom-cursor/);
  });
});
