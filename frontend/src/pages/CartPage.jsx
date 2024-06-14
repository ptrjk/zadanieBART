
import "./CartPage.css";

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';

import hoodieImage from '../assets/Mikina.jpg';
import tshirtImage from '../assets/Tricko.jpg';

import CartItem from "../components/CartItem";
import Modal from "../components/Modal";

function CartPage() {
    const location = useLocation();
    const previousCart = location.state || {};
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [modal, setModal] = useState(false);
    const [modalError, setModalError] = useState('');

    // Viem, ze toto nie je najlepsie riesenie vytvarat rovnaky state pre domovsku obrazovku a obrazovku s objednavkou, ale
    // nestiham casovo a nevedel som ako mozem preniest referencie na funkcie medzi obrazovkami 
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        if (previousCart.length > 0)
            setCart(previousCart);
    }, []);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Odosielanie objednavky na API
    const handleSubmit = async (event) => {
        event.preventDefault();
        let cartRequest = cart.map((product) => {
            return {
                name: product.name,
                quantity: product.quantity
            }
        });
        setError('');

        if (!validateEmail(email)) {
            setError('Prosim zadajte platnu emailovu adresu');
            return;
        }

        try {
            let request = {
                email,
                products: cartRequest
            }
            const response = await fetch('http://localhost:5000/order', {
                method: 'POST',
                body: JSON.stringify(request),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response);
            if (!response.ok) {
                setModalError("Pri objednavani nastala chyba");
            }
            setModal(true);
        } catch (error) {
            setError('Failed to submit email. Please try again.');
        }
    };

    function toggleModal() {
        setModal(!modal);
        setModalError('');
        navigate('/');
    };

    function removeItemFromCart(id) {
        setCart((previousCart) => previousCart.filter((item) => item.id !== id)
        );
    }

    return (
        <>
            <header>
                <Link to="/" className="logo" state={cart}>
                    <div class="logo">
                        <span>Trendy</span>Closet
                    </div>
                </Link>
            </header >
            <Modal active={modal} func={toggleModal} error={modalError}></Modal>
            <section className='content'>
                <div className="cart-layout">
                    <div className="left">
                        <h1>Kosik</h1>
                        {cart.length < 1 ?
                            <p>Vas nakupny kosik je prazdny</p> :
                            cart.map((item) => {
                                let imageSource = hoodieImage;
                                if (item.name === "Tricko") imageSource = tshirtImage;
                                return (
                                    <CartItem
                                        title={item.name}
                                        quantity={item.quantity}
                                        deleteFunc={() => { removeItemFromCart(item.id) }}
                                        imageSource={imageSource}
                                    ></CartItem>
                                );
                            })
                        }

                    </div>
                    <div className="right">
                        <h1>Formular</h1>

                        <form onSubmit={handleSubmit}>
                            <div className="formDiv">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            {cart.length > 0 ?
                                <button type="submit">Objednaj</button> :
                                <button type="button" className="disabled">Objednaj</button>
                            }
                        </form>
                    </div>
                </div>
            </section >
        </>
    );
}

export default CartPage;