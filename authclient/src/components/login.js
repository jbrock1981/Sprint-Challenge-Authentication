import React from 'react';
import axios from 'axios';

class Login extends React.Component {
    state = {
        username: '',
        password: '',
        error: false
    }
    inputHandler = (e) => {
        this.setState({ [e.target.name] : e.target.value })
    }
    login = (e) => {
        e.preventDefault();
        const endPoint = 'http://localhost:3300/api/login';
        const loginUser = {
            username: this.state.username,
            password: this.state.password
        };

        axios.post(endPoint, loginUser)
            .then(res => {
                localStorage.setItem('jwt', res.data.token);
                this.props.history.push('/jokes')
            })
            .catch(err => {
                this.setState({
                    error: true
                })
            })
    }
    render(){
        return(
            <div>
                <h1>Login</h1>
                <form onSubmit={this.login}>
                    <div>
                        <input
                            onChange={this.inputHandler}
                            type="text"
                            placeholder="Username"
                            value={this.state.username}
                            name="username"
                        >
                        </input>
                    </div>
                    <div>
                        <input
                            onChange={this.inputHandler}
                            type="password"
                            placeholder="Password"
                            value={this.state.password}
                            name="password"
                        >
                        </input>
                    </div>
                    <div>
                        <p>Login</p>
                    </div>
                </form>
            </div>
        )
    }
}

export default Login;