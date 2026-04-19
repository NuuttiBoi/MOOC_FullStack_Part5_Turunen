const loginWith = async (page, username, password) => {
    //await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').waitFor({ timeout: 5000 })
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, content) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByRole('textbox').fill(content)
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText(content).waitFor()
}

export { loginWith, createBlog }