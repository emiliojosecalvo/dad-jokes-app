import React, { Component } from 'react';
import './Joke.css'


export default class Joke extends Component {

    getColor() {
        if (this.props.votes >= 10) {
            return "#008000";
        } else if (this.props.votes >= 5) {
            return "#fbff05";
        } else if (this.props.votes >= 3) {
            return "#ffbc05";
        } else if (this.props.votes >= 0) {
            return "#ff7e05";
        } else {
            return "#ff0d05"
        }
    }

    getEmoji() {
        if (this.props.votes >= 10) {
            return "ec ec-joy";
        } else if (this.props.votes >= 5) {
            return "ec ec-laughing";
        } else if (this.props.votes >= 3) {
            return "ec ec-smile";
        } else if (this.props.votes >= 0) {
            return "ec ec-slightly-smiling-face";
        } else {
            return "ec-neutral-face"
        }
    }
    render() {
        return (
            <div className='Joke'>
                <div className='Joke-btns'>
                    <i onClick={this.props.upvote} className="fas fa-arrow-up"></i>
                    <span className='Joke-votes' style={{ borderColor: this.getColor() }}>{this.props.votes}</span>
                    <i onClick={this.props.downvote} className="fas fa-arrow-down"></i>
                </div>
                <div className='Joke-text'>
                    {this.props.text}
                </div>
                <div className='Joke-emoji'>
                    <span class={this.getEmoji()}></span>
                </div>
            </div>
        )
    }
}
