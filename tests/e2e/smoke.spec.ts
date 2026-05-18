import { test, expect } from "@playwright/test";

test.describe("@smoke Landing page", () => {
  test("renders hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Suffa.*IT Academy/i })).toBeVisible();
  });

  test("shows courses section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#courses")).toBeVisible();
  });

  test("shows at least one course card", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#courses")).toContainText(/Network|Windows|Hacker/i);
  });
});

test.describe("@smoke Auth redirects", () => {
  test("unauthenticated /dashboard redirects to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated /profile redirects to /login", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated /admin redirects to /login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("@smoke Webhook security", () => {
  test("UzumPay webhook returns 401 without signature", async ({ request }) => {
    const response = await request.post("/api/payments/uzumpay/webhook", {
      data: { event: "PAYMENT_SUCCESS" },
    });
    expect(response.status()).toBe(401);
  });

  test("PayMe webhook returns 401 without auth header", async ({ request }) => {
    const response = await request.post("/api/payments/payme/webhook", {
      data: { jsonrpc: "2.0", method: "CheckPerformTransaction", params: {} },
    });
    expect(response.status()).toBe(401);
  });
});

test.describe("@smoke SEO", () => {
  test("robots.txt disallows /admin", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("/admin");
  });

  test("sitemap.xml returns valid XML", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("<urlset");
  });
});
