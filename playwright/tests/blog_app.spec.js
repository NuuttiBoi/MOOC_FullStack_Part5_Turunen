const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Bloglist app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Nuutti Turunen',
                username: 'nuutti',
                password: 'salaisuus'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('front page can be opened', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Bloglist application' })).toBeVisible()
    })

    describe('Log in', async () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'nuutti', 'salaisuus')
            await expect(page.getByText('logged in')).toBeVisible()
        })
    })


    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'nuutti', 'vääräsalasana')
        const errorDiv = page.locator('.error')
        await expect(errorDiv).toContainText('wrong credentials')
        await expect(page.getByText('logged in')).not.toBeVisible()
    })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'nuutti', 'salaisuus')
        })

        test('a new blog post can be created', async ({ page }) => {
            await createBlog(page, 'a new test blog!! by playwright')
            await expect(page.getByText('a new test blog!! by playwright')).toBeVisible()
        })

        test('a blog post can be liked', async ({page}) => {
            await page.click('button:text("view")')
            await page.click('button:text("like")')
            await expect(page.getByText('likes 1')).toBeVisible()
        })

        test('a blog post can be deleted', async ({page}) => {
            await page.click('button:text("view")')
            page.on('dialog', dialog => dialog.accept())
            await page.click('button:text("remove")')
            await expect(page.getByText('Playwright Blog')).not.toBeVisible()
        })

        test('only the user who created the blog post can delete it', async ({page, request}) => {
            await request.post('http://localhost:3003/api/users', {
                data: {
                    name: 'Other',
                    username: 'other',
                    password: 'pass'
                }
            })
            await page.click('button:text("logout")')
            await loginWith(page, 'other', 'pass')
            await page.click('button:text("view")')
            await expect(page.getByText('remove')).not.toBeVisible()
        })

    })
})