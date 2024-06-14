import React from "react";
import tshirtImage from '../assets/Tricko.jpg';


function CartItem({ title, quantity, deleteFunc, imageSource }) {
    return <div className="cart-item">
        <img src={imageSource}></img>
        <div className="column">
            <h1>{title}</h1>
            <p>{`Pocet kusov: ${quantity}`}</p>
            <button onClick={deleteFunc}>Zmazat</button>
        </div>
    </div>
}


export default CartItem;