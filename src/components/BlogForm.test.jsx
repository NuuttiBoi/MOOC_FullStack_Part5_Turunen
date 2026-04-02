import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> the form calls the event handler ' +
    'it received as props with the right details when a new blog is created', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()
    render(<BlogForm createBlog={createBlog} />)
    const input = screen.getByPlaceholderText('write blog title here')
    const sendButton = screen.getByText('create')
    await user.type(input, 'testing a form...')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
})