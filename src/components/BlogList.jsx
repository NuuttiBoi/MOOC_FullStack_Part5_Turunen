import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Blog from './Blog'
import Notification from './Notification'
import LoginForm from './LoginForm'
import NoteForm from './NoteForm'
import Togglable from './Togglable'
import loginService from '../services/login'
import blogService from '../services/notes'

const BlogList = ({ blogs }) => {

    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])



    const handleLogin = async event => {
        event.preventDefault()
        try {
            const user = await loginService.login({ username, password })
            window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch {
            setErrorMessage('wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const blogsToShow = showAll ? blogs

    const loginForm = () => (
        <Togglable buttonLabel="login">
            <LoginForm
                username={username}
                password={password}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                handleSubmit={handleLogin}
            />
        </Togglable>
    )

    return (
        <div>
            <h1>Blogs</h1>
            <Notification message={errorMessage} />
            {!user && loginForm()}
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {blogsToShow.map(note => (
                    <li key={blog.id}>
                        <Link to={`/blogs/${blog.id}`}>{blog.content}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default NoteList