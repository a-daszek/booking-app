import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Zaloguj się" }).click();
  await expect(
    page.getByRole("heading", { name: "Zaloguj się" })
  ).toBeVisible();

  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password123");

  await page.getByRole("button", { name: "Zaloguj się" }).click();
  await expect(page.getByText("Zalogowano się pomyślnie.")).toBeVisible();
});

test("should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Gdzie się wybierzesz?").fill("Dublin");
  await page.getByRole("button", { name: "Szukaj" }).click();

  await expect(page.getByText(" w Dublin")).toBeVisible();
  await expect(page.getByText("Dublin Getaways")).toBeVisible();

});
