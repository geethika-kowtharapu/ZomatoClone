import React from 'react';
import queryString from 'query-string';
import axios from 'axios';
import '../Styles/details.css';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'antiquewhite',
        border: 'solid 1px brown'
    },
};

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},
            restaurantId: undefined,
            OrderModalIsOpen: false,
            menuItems: []
        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { restaurant } = qs;

        axios({
            method: 'GET',
            url: `http://localhost:8989/restaurant/${restaurant}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ restaurant: response.data.restaurant, restaurantId: restaurant })
            })
            .catch(err => console.log(err));
    }

    handleModal = (state, value) => {
        this.setState({ [state]: value });
    }

    GetMenuItems = () => {
        const { restaurantId } = this.state;
        axios({
            method: 'GET',
            url: `http://localhost:8989/menuitems/${restaurantId}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ menuItems: response.data.menuItems })
            })
            .catch(err => console.log(err));
    }

    render() {
        const { restaurant, OrderModalIsOpen, menuItems } = this.state;
        return (
            <div>
                <div>
                    <img src={`./${restaurant.image}`} alt="No Image, Sorry for the Inconvinience" width="100%" height="350px" />

                    <button className="button">Click to see Image Gallery</button>
                </div>
                <div className="heading">{restaurant.name}</div>
                <button className="btn-order" onClick={() => {
                    this.handleModal('OrderModalIsOpen', true)
                    this.GetMenuItems()
                }}>Place Online Order</button>

                <div className="tabs">
                    <div className="tab">
                        <input type="radio" id="tab-1" name="tab-group-1" checked />
                        <label for="tab-1">Overview</label>

                        <div className="content">
                            <div className="about">About this place</div>
                            <div className="head">Cuisine</div>
                            <div className="value">{restaurant && restaurant.cuisine && restaurant.cuisine.map(cuisine => `${cuisine.name}, `)}</div>
                            <div className="head">Average Cost</div>
                            <div className="value">&#8377; {restaurant.min_price} for two people(approx)</div>
                        </div>
                    </div>

                    <div className="tab">
                        <input type="radio" id="tab-2" name="tab-group-1" />
                        <label for="tab-2">Contact</label>

                        <div className="content">
                            <div className="head">Phone Number</div>
                            <div className="value">{restaurant.contact_number}</div>
                            <div className="head">Address</div>
                            <div className="value">{restaurant.name}</div>
                            <div className="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={OrderModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        {menuItems.map(item => {
                            return <div>
                                {item.name}
                            </div>
                        })}
                    </div>
                </Modal>
            </div >
        )
    }
}

export default Details;