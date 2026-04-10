import {Button} from './styles.js'
const LoginForm = ({
                       handleSubmit,
                       handleUsernameChange,
                       handlePasswordChange,
                       username,
                       password
                   }) => {
    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        username
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        password
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </label>
                </div>
                <Button id="login-button" type="submit">
                    login
                </Button>
            </form>
        </div>
    )
}

export default LoginForm