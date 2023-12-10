import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    description: '' // Include the description field in the new product state
  });
  const [showAddForm, setShowAddForm] = useState(false);

  console.log(newProduct)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get('https://localhost:7171/api/Products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7171/api/Products/${id}`);
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (id) => {
    console.log(`Editing product with ID: ${id}`);
  };

  const handleAddProduct = async () => {
    try {
      const response = await axios.post('https://localhost:7171/api/Products', newProduct);
      setProducts([...products, response.data]);
      setShowAddForm(false);
      setNewProduct({ name: '', price: 0, description: '' }); // Reset the new product form fields
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="App">
      <h1>Products</h1>
      <button onClick={() => setShowAddForm(true)}>Add Product</button>

      {showAddForm && (
        <div>
          <h2>Add New Product</h2>
          <form onSubmit={handleAddProduct}>
            <label>
              Name:
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.description}</td>
              <td>
                <button onClick={() => handleEdit(product.id)}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
