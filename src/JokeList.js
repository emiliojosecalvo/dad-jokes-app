import React, { Component } from 'react';
import Joke from './Joke';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './JokeList.css';


export default class JokeList extends Component {
    static defaultProps = {
        numJokesGet: 10
    }
    constructor(props) {
        super(props);
        this.state = {
            jokes: JSON.parse(window.localStorage.getItem("jokes") || '[]')
        };
    }
    componentDidMount() {
        if (this.state.jokes.length === 0) this.getJokes();
    }
    async getJokes() {
        let jokes = [];
        while (jokes.length < this.props.numJokesGet) {
            //https://icanhazdadjoke.com/ to fetch random dad joke
            let response = await axios.get('https://icanhazdadjoke.com/', { headers: { accept: 'application/json' } });
            jokes.push({ id: uuidv4(), text: response.data.joke, votes: 0 })
        }
        this.setState({ jokes: jokes });
        window.localStorage.setItem('jokes', JSON.stringify(jokes));
    }
    // add or remove votes from a joke
    handleVote(id, delta) {
        this.setState(st => ({
            jokes: st.jokes.map(j =>
                j.id === id ? { ...j, votes: j.votes + delta } : j
            )
        }))
    }
    render() {
        return (
            <div className='JokeList'>
                <div className='JokeList-sidebar'>
                    <h1 className='JokeList-title'><span>Dad</span> Jokes</h1>
                    <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
                    <button className='JokeList-btn'>Get New Jokes</button>
                </div>
                <div className='JokeList-jokes'>
                    {this.state.jokes.map(j =>
                        <Joke
                            upvote={() => this.handleVote(j.id, 1)}
                            downvote={() => this.handleVote(j.id, -1)}
                            key={j.id}
                            id={j.id}
                            votes={j.votes}
                            text={j.text}
                        />
                    )}
                </div>
            </div>
        )
    }
}