import React, { Component } from 'react';
import axios from 'axios';
import {NavLink, Route} from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';

class App extends Component {
  state = {
    jokes: [],
    loading: true,
    loggedIn: false
  };

  componentDidMount() {
    const token = localStorage.getItem('jwt');
    const options = {
      headers: {
        Authorization: token  
      }
    }
    axios.get('http://localhost:3300/api/jokes', options)
      .then(res => {
        this.setState({
          jokes: res.data,
          loggedIn: true,
          loading: false
        })
      })
      .catch(err => {
        this.setState({
          loggedIn: false,
          loading: false
        })
      })
  }

  jokeList = () => {
    if(this.state.loading) {
      return(
        <div> {/* app container*/}
          <h1>Dad Joke App</h1>
          <h2>loading...loading...loading...loading</h2>
        </div>
      )
    } else if(this.state.loggedIn) {
      return(
        <div> {/* app container*/}
          <h1>Dad Joke App</h1>
          <div>
            {this.state.jokes.map(joke => {
              return(
                <div key={joke.id}>
                  <p>{joke.joke}</p>
                </div>
              )
            })}
          </div>
        </div>
      )
    } else {
      return(
        <div> {/* app container*/}
          <h1>Dad Joke App</h1>
          <h2>you gotta log in first</h2>
          <div>
            <NavLink to='/register'>Register</NavLink>
            <NavLink to='/login'>Login</NavLink>
          </div>
          <Route exact path='/' component={App} />
          <Route path='/register' render={ props => <Register {...props} /> } />
          <Route path='/login' render={ props => <Login {...props} /> } />
        </div>
      )
    }

  }

  render() {
    return (
      <div>{this.jokeList}</div> 
    );
  }
}

export default App;
