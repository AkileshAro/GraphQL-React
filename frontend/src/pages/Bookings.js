import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';

class BookingsPage extends Component {
    static contextType = AuthContext;

    state = {
        isLoading: false,
        bookings: []
    };

    componentDidMount() {
        this.fetchBookings();
    };


    deleteBookingHandler = bookingId => {
        this.setState({ isLoading: true })
        const requestBody = {
            query: `
                mutation {
                    cancelBooking(bookingId : "${bookingId}"){
                        _id
                        title
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
            this.setState(prevState => {
                const updatedBookings = prevState.bookings.filter(booking => {
                    return booking._id !== bookingId;
                });
                return { bookings: updatedBookings, isLoading: false };
            })
        }).catch(err => {
            this.setState({ isLoading: false })
            console.log(err);
        });
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
                            <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler} />
                        )
                }

            </React.Fragment>
        )
    }
}

export default BookingsPage;