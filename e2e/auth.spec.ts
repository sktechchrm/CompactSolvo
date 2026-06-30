import { test, expect, type Page } from '@playwright/test';

const ADMIN = { email: process.env.E2E_ADMIN_EMAIL ?? 'admin@mgshirtex.com', password: process.env.E2E_ADMIN_PASSWORD ?? 'password' };

async function login(page: Page, email: string, password: string) {
  await page.goto('/');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
}

test.describe('Authentication', () => {
  test('renders login form', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await login(page, 'bad@example.com', 'wrong');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('can toggle password visibility', async ({ page }) => {
    await page.goto('/');
    const input = page.getByLabel(/password/i);
    await input.fill('mypassword');
    expect(await input.getAttribute('type')).toBe('password');
    await page.getByRole('button', { name: /show/i }).click();
    expect(await input.getAttribute('type')).toBe('text');
  });

  test('unauthenticated user redirected from protected route', async ({ page }) => {
    await page.goto('/settlement');
    await expect(page).toHaveURL('/');
  });

  test('logout clears session', async ({ page }) => {
    await login(page, ADMIN.email, ADMIN.password);
    await expect(page).toHaveURL(/dashboard/);
    await page.getByRole('button', { name: /profile|user/i }).first().click();
    await page.getByRole('button', { name: /sign out|logout/i }).click();
    await expect(page).toHaveURL('/');
    const session = await page.evaluate(() => sessionStorage.getItem('rms_session_v4'));
    expect(session).toBeNull();
  });

  test('browser back works after navigation', async ({ page }) => {
    await login(page, ADMIN.email, ADMIN.password);
    await page.goto('/settlement');
    await expect(page).toHaveURL(/settlement/);
    await page.goBack();
    await expect(page).toHaveURL(/dashboard/);
  });
});
