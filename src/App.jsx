import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [notification, setNotification] = useState(null)

    const blogFormRef = useRef()

    const notify = (message) => {
        setNotification(message)
        setTimeout(() => setNotification(null), 5000)
    }

    useEffect(() => {
        blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({ username, password })
            setUser(user)
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            setUsername('')
            setPassword('')
            notify(`${user.name} logged in`)
            blogService.setToken(user.token)
        } catch  {
            notify('wrong credentials')
        }
    }

    const handleLogout = () => {
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
        blogService.setToken(null)
        notify('logged out')
    }

    const createBlog = async (blogObject) => {
        try {
            const returnedBlog = await blogService.create(blogObject)
            setBlogs(blogs.concat(returnedBlog))
            notify(`a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
            blogFormRef.current.toggleVisibility()
        } catch  {
            notify('failed to create blog')
        }
    }
    const handleDelete = async (blog) => {
        const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
        if (!ok) return
        try {
            await blogService.remove(blog.id)
            setBlogs(blogs.filter(blg => blg.id !== blog.id))
        } catch {
            notify('Failed to delete blog')
        }
    }

    const handleLike = async (blog) => {
        const updatedBlog = {
            ...blog,
            likes: blog.likes + 1
        }

        try {
            const returnedBlog = await blogService.update(blog.id, updatedBlog)
            setBlogs(blogs.map(blg => blg.id === blog.id ? returnedBlog : blg))
        } catch (error) {
            console.error(error)
        }
    }
    const sortedBlogs = [...blogs].sort((first, second) => second.likes - first.likes)


    if (!user) {
        return (
            <div>
                <h1>Bloglist application</h1>
                <h2>Login</h2>
                <Notification message={notification} />
                <form onSubmit={handleLogin}>
                    <div>
                        username
                        <input
                            value={username}
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </div>
                    <div>
                        password
                        <input
                            type="password"
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </div>
                    <button type="submit">login</button>
                </form>
            </div>
        )
    }

    return (
        <div>
            <h2>blogs</h2>
            <Notification message={notification} />
            <p>
                {user.name} logged in <button onClick={handleLogout}>logout</button>
            </p>

            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={createBlog} />
            </Togglable>

            {sortedBlogs.map(blog =>
                <Blog
                    key={blog.id}
                    blog={blog}
                    handleLike={handleLike}
                    handleDelete={handleDelete}
                    currentUser={user}
                />
            )}
        </div>
    )
}

export default App