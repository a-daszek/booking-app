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

test("should show hotel detail", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Gdzie się wybierzesz?").fill("Dublin");
  await page.getByRole("button", { name: "Szukaj" }).click();

  await page.getByText("Dublin Getaways").click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", { name: "Zarezerwuj" })).toBeVisible();
});

test("should book hotel", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Gdzie się wybierzesz?").fill("Dublin");

  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];

  await page.getByPlaceholder("Check-out Date").fill(formattedDate);

  await page.getByRole("button", { name: "Szukaj" }).click();

  await page.getByText("Dublin Getaways").click();
  await page.getByRole("button", { name: "Zarezerwuj" }).click();

  await expect(page.getByText("Kwota całkowita: 357.00 zł")).toBeVisible();

  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame
    .locator("[placeholder='Card number']")
    .fill("4242424242424242");

  await stripeFrame.locator("[placeholder='MM / YY']").fill("04/30");
  await stripeFrame.locator("[placeholder='CVC']").fill("242");
  await stripeFrame.locator("[placeholder='ZIP']").fill("24225");

  await page.getByRole("button", { name: "Zatwierdź rezerwację" }).click();
  await expect(page.getByText("Zapisano rezerwację!")).toBeVisible();
});
