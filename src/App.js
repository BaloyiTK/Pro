import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://localhost:7171/api/Products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7171/api/Products/${id}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (id) => {
    const productToEdit = products.find((product) => product.id === id);
    setEditedProduct(productToEdit);
    setShowAddForm(true);
  };

  const handleEditProduct = async () => {
    try {
   
      if (
        !editedProduct.name ||
        editedProduct.price === 0 ||
        !editedProduct.description
      ) {
        console.error("Please fill in all fields.");
        setError("Please fill in all fields.");
        return;
      }

      const response = await axios.put(
        `https://localhost:7171/api/Products/${editedProduct.id}`,
        editedProduct
      );
      const updatedProducts = products.map((product) =>
        product.id === editedProduct.id ? response.data : product
      );
      setProducts(updatedProducts);
      setShowAddForm(false);
      setEditedProduct(null);
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      
      if (
        !newProduct.name ||
        !newProduct.price ||
        !newProduct.description
      ) {
        console.error("Please fill in all fields.");
        setError("Please fill in all fields.");
        return;
      }

      const response = await axios.post(
        "https://localhost:7171/api/Products",
        newProduct
      );
      fetchProducts();
      setProducts([...products, response.data]);
      setShowAddForm(false);
      setNewProduct({ name: "", price: "", description: "" });
      setError("");
    } catch (error) {
      alert("error");
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Products</h1>
      <div className="mb-4">
        <label className="mr-2">Search:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          placeholder="Search products..."
        />
      </div>
      <button
        className="btn btn-success mb-4"
        onClick={() => {
          setShowAddForm(true);
          setEditedProduct(false);
        }}
      >
        Add Product
      </button>

      {showAddForm && (
        <div>
          <form>
            <div
              style={{
                width: "50%",
                height: "fit-content",
                position: "absolute",
                background: "#f4f4f4", // Light gray background
                padding: "20px", // Increased padding for more spacing
                borderRadius: "5px", // Slightly larger rounded corners
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Enhanced shadow for depth
                top: "25%",
                right: "25%"
              }}
              
            >
              <h2 className="mb-3">
                {editedProduct ? "Edit Product" : "Add New Product"}
              </h2>

              <div
                style={{
                  height: "25px",
                }}
              >
                {error && <p className="text-danger">Error: {error}</p>}
              </div>

              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedProduct ? editedProduct.name : newProduct.name}
                  onChange={(e) =>
                    editedProduct
                      ? setEditedProduct({
                          ...editedProduct,
                          name: e.target.value,
                        })
                      : setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                  placeholder="name"
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  className="form-control"
                  value={editedProduct ? editedProduct.price : newProduct.price}
                  onChange={(e) =>
                    editedProduct
                      ? setEditedProduct({
                          ...editedProduct,
                          price: e.target.value,
                        })
                      : setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  required
                  placeholder="price"
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  className="form-control"
                  value={
                    editedProduct
                      ? editedProduct.description
                      : newProduct.description
                  }
                  onChange={(e) =>
                    editedProduct
                      ? setEditedProduct({
                          ...editedProduct,
                          description: e.target.value,
                        })
                      : setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                  }
                  required
                  placeholder="Description"
                />
              </div>

              <button
                type="button"
                className="btn btn-primary my-2"
                onClick={editedProduct ? handleEditProduct : handleAddProduct}
              >
                {editedProduct ? "Update" : "Submit"}
              </button>

              <button
                type="button"
                className="btn btn-danger my-2 mx-1"
                onClick={() => {
                  setShowAddForm(false);
                  setError(""); // Set showAddForm to false
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
<table className="table">
  <thead>
    <tr>
      <th style={{ width: '20%' }}>Name</th>
      <th style={{ width: '15%' }}>Price</th>
      <th style={{ width: '50%' }}>Description</th>
      <th style={{ width: '15%' }}>Actions</th>
    </tr>
  </thead>
  <tbody>
    {products
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((product) => (
        <tr key={product.id}>
          <td style={{ width: '20%' }}>{product.name}</td>
          <td style={{ width: '15%' }}>R{product.price}</td>
          <td style={{ width: '50%' }}>{product.description}</td>
          <td style={{ width: '15%' }}>
            <button
              className="btn btn-warning mx-1"
              onClick={() => handleEdit(product.id)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger mx-1"
              onClick={() => handleDelete(product.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
  </tbody>
</table>

    </div>
  );
};

export default App;
