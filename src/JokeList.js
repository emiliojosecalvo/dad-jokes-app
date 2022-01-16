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
            jokes: JSON.parse(window.localStorage.getItem("jokes") || '[]'),
            loading: false
        };
        this.seenJokes = new Set(this.state.jokes.map(j => j.text));
        console.log(this.seenJokes)
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        //if the state jokes is empty is going to run getJokes to give new jokes
        if (this.state.jokes.length === 0) this.getJokes();
    }
    handleClick() {
        this.setState({ loading: true }, this.getJokes);
    }
    async getJokes() {
        try {
            let jokes = [];
            while (jokes.length < this.props.numJokesGet) {
                //https://icanhazdadjoke.com/ to fetch random dad joke
                let response = await axios.get('https://icanhazdadjoke.com/', { headers: { accept: 'application/json' } });
                let newJoke = response.data.joke;
                //Check is the joke that is fetching is not already in the array
                if (!this.seenJokes.has(newJoke)) {
                    jokes.push({ id: uuidv4(), text: newJoke, votes: 0 });
                } else {
                    console.log('Duplicate Found');
                    console.log(newJoke);
                }
            }
            this.setState(
                st => ({
                    loading: false,
                    jokes: [...st.jokes, ...jokes]
                }),
                () =>
                    //this function runs after the setState so the state jokes could be save on localstorage
                    window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
            );
        } catch (e) {
            alert(e);
            this.setState({ loading: false })
        }
    }
    // add or remove votes from a joke
    handleVote(id, delta) {
        this.setState(st => ({
            jokes: st.jokes.map(j =>
                j.id === id ? { ...j, votes: j.votes + delta } : j
            )
        }),
            () =>
                //this function runs after the setState so the state jokes could be save on localstorage
                window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
        );
    }

    render() {
        if (this.state.loading) {
            return (
                <div className='JokeList-spinner'>
                    <i className='far fa-8x fa-laugh fa-spin'></i>
                    <h1 className='JokeList-title'>Loading...</h1>
                </div>
            )
        }
        //sort jokes by votes
        let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes);
        return (
            <div className='JokeList'>
                <div className='JokeList-sidebar'>
                    <h1 className='JokeList-title'><span>Dad</span> Jokes</h1>
                    <div className='JokeList-img'>
                        <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
                    </div>
                    <button className='JokeList-btn btn' onClick={this.handleClick}>New Jokes</button>
                </div>
                <div className='JokeList-jokes'>
                    {jokes.map(j =>
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