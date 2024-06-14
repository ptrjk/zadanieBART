

function ProductItem({ image, title, func, quantity, blocked }) {
    return (
        <div className='product-item'>
            <img src={image}></img>
            <h1>{title}</h1>
            <p>{`Pocet kusov: ${quantity}`}</p>
            {blocked ?
                <button className="disabled">Objednaj</button> :
                <button onClick={func}>Objednaj</button>}
        </div>
    );
}

export default ProductItem;