import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test("should allow the user to sign in", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Zaloguj się" }).click();
  await expect(
    page.getByRole("heading", { name: "Zaloguj się" })
  ).toBeVisible();

  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password123");

  await page.getByRole("button", { name: "Zaloguj się" }).click();
  await expect(page.getByText("Zalogowano się pomyślnie.")).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Moje rezerwacje" })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Moje hotele" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Wyloguj się" })).toBeVisible();
});

test("Should allow user to register", async ({ page }) => {
  const testEmail = `test_register_${
    Math.floor(Math.random() * 90000) + 10000
  }@test.com`;
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Zaloguj się" }).click();
  await page.getByRole("link", { name: "Stwórz je tutaj." }).click();

  await expect(
    page.getByRole("heading", { name: "Stwórz konto" })
  ).toBeVisible();

  await page.locator("[name=firstName]").fill("test_firstName");
  await page.locator("[name=lastName]").fill("test_lastName");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("password123");
  await page.locator("[name=confirmPassword]").fill("password123");

  await page.getByRole("button", { name: "Stwórz konto" }).click();

  await expect(
    page.getByText("Rejestracja zakończona sukcesem.")
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Moje rezerwacje" })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Moje hotele" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Wyloguj się" })).toBeVisible();
});
