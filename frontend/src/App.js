import './App.css';

import headerLogo from './assets/header.jpg';
import cartLogo from './assets/cart.png';

import hoodieImage from './assets/Mikina.jpg';
import tshirtImage from './assets/Tricko.jpg';
import ProductItem from './components/ProductItem';

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function App() {
  const [products, setProducts] = useState(null);
  const [cart, setCart] = useState([]);

  const location = useLocation();
  const items = location.state || {};

  // Nacita produkty z API
  useEffect(() => {
    console.log("fetching");
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const resData = await response.json();
        setProducts(resData.data);

      } catch (error) {
        console.log(error);
      }
    };

    if (items.length > 0) {
      setCart(items);
    }
    fetchData();
  }, []);

  // Prida produkt do kosika
  function addToCart(productId) {
    setCart((previousCart) => {
      let updatedCart = [...previousCart];

      const existingCartItemIndex = updatedCart.findIndex(
        (cartItem) => cartItem.id === productId
      );
      const existingCartItem = updatedCart[existingCartItemIndex];

      if (existingCartItem) {
        existingCartItem.quantity = existingCartItem.quantity + 1;
      } else {
        const product = products.find((product) => product.id === productId);

        if (product) {
          let newItem = {
            id: productId,
            quantity: 1,
            name: product.name,
          };
          updatedCart.push(newItem);
        }
      }
      return updatedCart;
    })
  }

  // Vypocita pocet kusov v kosiku
  function getCartCount() {
    let count = 0;
    cart.forEach((item) => {
      count += item.quantity;
    })
    return count;
  }

  // Urcuje, ci treba zablokovat tlacidlo na pridanie do kosika
  function blockButton(id) {
    const existingProductIndex = products.findIndex(
      (productItem) => productItem.id === id
    );

    if (existingProductIndex === -1 || products[existingProductIndex].quantity <= 0)
      return true;

    if (cart.length <= 0) return false;

    const existingCartItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === id
    );
    const existingCartItem = cart[existingCartItemIndex];

    if (!existingCartItem) {
      return false;
    }

    if (existingCartItem.quantity >= products[existingProductIndex].quantity) {
      console.log("bug2");
      return true;
    }


    return false;
  }

  return (
    <div className="App">
      <header className='sticky'>
        <div class="logo">
          <span>Trendy</span>Closet
        </div>
        <div className='row'>
          <Link to="/cart" state={cart}> <img src={cartLogo} className='cartLogo'></img></Link>
          <div className='cartCount'>{getCartCount()}</div>
        </div>
      </header >
      <section class="landing">
        <div class="landing-image">

          <img src={headerLogo} alt="Landing Image" id='landingImg'></img>
          <div class="slogan">
            <h1>STYLE<br></br> IN<br></br> EVERY<br></br> STITCH</h1>
          </div>
        </div>
      </section>
      <section className='content'>
        <h1>Produkty</h1>
        <div className='content-products'>
          {products && products.length > 0 ?
            products.map((product) => {
              let imageSource = hoodieImage;
              if (product.name === "Tricko") imageSource = tshirtImage;
              return (
                < ProductItem
                  image={imageSource}
                  title={product.name}
                  func={() => addToCart(product.id)}
                  quantity={product.quantity}
                  blocked={blockButton(product.id)}
                >
                </ProductItem>
              )
            })
            : <p>Momentalne nie su dostupne ziadne produkty</p>
          }
        </div>

      </section >
    </div >
  );
}

export default App;
