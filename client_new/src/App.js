import React, { useState } from 'react';
import Product from "./components/Product"
import Input from "./components/Input"
export default function App() {
  const [product, setProduct] = useState({ title: '', imgURL: '', priceTxt: '', ratingTxt: '' });

  const handleProductData = (data) => {
    setProduct(data);
  };

  return (
    <div>
      <Input onFetchProduct={handleProductData} />
      <Product product={product} />
    </div>
  );
}
