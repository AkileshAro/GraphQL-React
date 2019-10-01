import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';

class BookingsPage extends Component {
    static contextType = AuthContext;

    state = {
        isLoading: false,
        bookings: []
    };

    componentDidMount() {
        this.fetchBookings();
    };

    fetchBookings = () => {
        this.setState({ isLoading: true })
        const requestBody = {
            query: `
                query {
                    bookings{
                        _id
                        createdAt
                        event{
                            _id
                            title
                            date    
                        }
                    }
                }
            `,

        };

        const token = this.context.token;
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed');
            }
            return res.json();
        }).then(resData => {
            const bookings = resData.data.bookings;
            this.setState({ bookings: bookings, isLoading: false })
        }).catch(err => {
            this.setState({ isLoading: false })
            console.log(err);
        });
    }
    render() {
        return (
            <React.Fragment>
                {
                    this.state.isLoading ?
                        (<Spinner />) : (
                            <div>
                                <ul>
                                    {this.state.bookings.map(booking => {
                                        return <li key={booking._id}>{booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}</li>
                                    })}
                                </ul>
                            </div>
                        )
                }

            </React.Fragment>
        )
    }
}

export default BookingsPage;