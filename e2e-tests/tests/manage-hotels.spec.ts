import { test, expect } from "@playwright/test";
import path from "path";

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

test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator('[name="name"]').fill("Test hotel");
  await page.locator('[name="city"]').fill("Test city");
  await page.locator('[name="country"]').fill("Test country");
  await page.locator('[name="description"]').fill("Test description");
  await page.locator('[name="pricePerNight"]').fill("120");
  await page.selectOption('select[name="starRating"]', "3");
  await page.getByText("All inclusive").click();
  await page.getByLabel("Spa").check();
  await page.getByLabel("Darmowe wifi").check();
  await page.locator('[name="adultCount"]').fill("2");
  await page.locator('[name="childCount"]').fill("3");

  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "testowy1.jpg"),
    path.join(__dirname, "files", "testowy2.jpg"),
  ]);

  await page.getByRole('button', {name: "Zapisz"}).click();
  await expect(page.getByText("Udało się dodać hotel!")).toBeVisible();
});
