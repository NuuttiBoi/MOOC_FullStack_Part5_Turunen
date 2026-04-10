import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import { Routes, Route, Link, useMatch, useNavigate, Navigate } from 'react-router-dom'
import BlogList from './components/BlogList.jsx'
import LoginForm from './components/LoginForm.jsx'
import {Page} from './components/styles.js'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [notification, setNotification] = useState(null)

    const navigate = useNavigate()

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
            blogService.setToken(user.token)
            notify(`${user.name} logged in`)
            navigate('/')
        } catch {
            notify('wrong credentials')
        }
    }

    const handleLogout = () => {
        setUser(null)
        window.localStorage.removeItem('loggedBlogappUser')
        blogService.setToken(null)
        notify('logged out')
        navigate('/')
    }

    const createBlog = async (blogObject) => {
        try {
            const returnedBlog = await blogService.create(blogObject)
            setBlogs(blogs.concat(returnedBlog))
            notify(`a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
            navigate('/')
        } catch {
            notify('failed to create blog')
        }
    }

    const handleDelete = async (blog) => {
        const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
        if (!ok) return

        try {
            await blogService.remove(blog.id)
            setBlogs(blogs.filter(blg => blg.id !== blog.id))
            navigate('/')
        } catch {
            notify('Failed to delete blog')
        }
    }

    const handleLike = async (blog) => {
        const updatedBlog = {
            ...blog,
            likes: blog.likes + 1,
            user: blog.user?.id || blog.user
        }

        try {
            const returnedBlog = await blogService.update(blog.id, updatedBlog)
            setBlogs(blogs.map(blg => blg.id === blog.id ? returnedBlog : blg))
        } catch (error) {
            console.error(error)
        }
    }

    const sortedBlogs = [...blogs].sort((first, second) => second.likes - first.likes)

    const padding = {
        padding: 5
    }

    const match = useMatch('/blogs/:id')

    const blog = match
        ? blogs.find(blog => blog.id === match.params.id)
        : null

    return (
        <div>
            <Page>
                <Notification message={notification} />

                <div>
                    <Link style={padding} to="/">blogs</Link>
                    {!user && <Link style={padding} to="/login">login</Link>}
                    {user && <Link style={padding} to="/create">new blog</Link>}
                    {user && (
                        <>
                            <span>{user.name} logged in </span>
                            <button onClick={handleLogout}>logout</button>
                        </>
                    )}
                </div>
            </Page>


            <Routes>
                <Route
                    path="/"
                    element={<BlogList blogs={sortedBlogs} />}
                />

                <Route
                    path="/blogs/:id"
                    element={
                        <Blog
                            blog={blog}
                            currentUser={user}
                            handleLike={handleLike}
                            handleDelete={handleDelete}
                        />
                    }
                />

                <Route
                    path="/login"
                    element={
                        user
                            ? <Navigate to="/" replace />
                            : (
                                <LoginForm
                                    handleSubmit={handleLogin}
                                    handleUsernameChange={({ target }) => setUsername(target.value)}
                                    handlePasswordChange={({ target }) => setPassword(target.value)}
                                    username={username}
                                    password={password}
                                />
                            )
                    }
                />

                <Route
                    path="/create"
                    element={
                        user
                            ? <BlogForm createBlog={createBlog} />
                            : <Navigate to="/login" replace />
                    }
                />
            </Routes>
        </div>
    )
}

export default App