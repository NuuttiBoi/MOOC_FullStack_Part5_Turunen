import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog.jsx'

test('renders blog title and author, but not url or likes by default', () => {
    const blog = {
        title: 'Testing blog..',
        author: 'Nuutti Turunen',
        url: 'this shouldnt be vbisible',
        likes: 8,
        user: {
            username: 'nuutti',
            name: 'Nuutti Turunen'
        }
    }
    render(<Blog blog={blog} currentUser={{ username: 'nuutti' }} />)
    expect(screen.getByText('Testing blog..', { exact: false })).toBeDefined()
    expect(screen.getByText('Nuutti Turunen',{ exact: false })).toBeDefined()
    const urlElement = screen.queryByText('this shouldnt be vbisible')
    expect(urlElement).toBeNull()
    const likesElement = screen.queryByText('likes 8')
    expect(likesElement).toBeNull()
})

test('the blogs URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {
    const blog = {
        title: 'Testing blog..',
        author: 'Nuutti Turunen',
        url: 'this should be visible!!',
        likes: 8,
        user: {
            username: 'nuutti',
            name: 'Nuutti Turunen'
        }
    }

    render(<Blog blog={blog} currentUser={{ username: 'nuutti' }} />)
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const urlElement = screen.queryByText('this should be visible!!')
    expect(urlElement).toBeDefined()
    const likesElement = screen.queryByText('likes 8')
    expect(likesElement).toBeDefined()
})
test('calls the like handler twice if like button is clicked twice', async () => {
    const blog = {
        title: 'Testing blog..',
        author: 'Nuutti Turunen',
        url: 'this should be visible!!',
        likes: 8,
        user: {
            username: 'nuutti',
            name: 'Nuutti Turunen'
        }
    }
    const mockHandler = vi.fn() // using Vitest
    const user = userEvent.setup()
    render(<Blog blog={blog} handleLike={mockHandler} currentUser={{username: 'nuutti'}} />)
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler).toHaveBeenCalledTimes(2)
})
