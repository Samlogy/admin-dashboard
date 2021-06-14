import React, { useState, useEffect } from "react";

import "./style.css";
const proxy = "http://localhost:5000"

const Products = () => {
  const [product, setProduct] = useState({ 
        name: "", description: "", price: "", amount: "", features: []  
        });
  const [action, setAction] = useState({ value: "products", data: null })
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({ queryString: "", filterType: "name" });
  const [loading, setLoading] = useState(false);
  
  // API calls
  const getProducts = async () => {
    setLoading(true);
    try {
      const url = `${proxy}/admin/products/getProducts`;
      const res = await fetch(url);

      if (res.ok) {
        const result = await res.json();
        setLoading(false);
        setProducts(result.data);
        console.log(result.message);
        return;
      }
      console.log("an Error occured while loading products !");
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };
  const onCreate = async (e) => {
    e.preventDefault();
    try {
      // data validation (yup)
      const url = `${proxy}/admin/products/createProduct`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(product)
      });
      // reset form
      setProduct({ name: "", description: "", price: "", amount: "", features: [] });

      if (res.ok) {
        const result = await res.json();
        console.log(result.message);
        // update state
        // setProducts((prevState) => {
        //   return [result.data, ...prevState]
        // })

        setAction({value: "products"})
        return;
      }
      console.log("an Error occured while adding a product !");
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };
  const onEdit = async (e, data) => {
    e.preventDefault()

    try {
      // data validation
      const url = `${proxy}/admin/products/editProduct/${data.productId}`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify(product)
      });

      if (res.ok) {
        const result = await res.json();
        console.log("edited product data: ", result.data);
        // update products state
        console.log(result.message);
        setAction({ value: "products" })
        return;
      }
      console.log("an Error occured while editing product !");
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };
  const onDelete = async (data) => {
    try {
      const url = `${proxy}/admin/products/deleteProduct/${data.productId}`;
      const res = await fetch(url, {
        method: "DELETE"
      });

      if (res.ok) {
        const result = await res.json();

        // remove product data from products
        // const new_products_list = products.filter((el) => el._id !== product);
        // setProducts(new_products_list);

        console.log(result.message);
        setAction({ value: "products" })
        return;
      }
      console.log("an Error occured while deleting product !");
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };
  const onFilter = async (value) => {
    setFilter({ ...filter, queryString: value });
    setLoading(true);

    try {
      const url = `${proxy}/admin/products/filterProducts?queryString=${value}&filterType=${filter.filterType}`;
      const res = await fetch(url);

      if (res.ok) {
        const result = await res.json();
        setProducts(result.data);
        setLoading(false);
        console.log(result.message);
        return;
      }
      console.log("an Error occured while filtering users !");
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };

  // functions
  const convertDate = (date) => {
    const new_date = new Date(date).toLocaleDateString("en-US").split(/:| /)[0];
    return new_date;
  };
  const backToProduct = () => {
    setAction({value: "products"})
    setProduct({ name: "", description: "", price: "", amount: "", features: [] })
  };

  /* Components */
  const displayProductsList = (products) => {
    return (
      <table>
        <thead>
          <th> Name </th>
          <th> Price </th>
          <th> Amount </th>
          <th> Features </th>
          <th>actions</th>
          <th>created</th>
          <th>last edit</th>
        </thead>

        <tbody>
          {products.map((el, idx) => (
            <tr key={el._id}>
              <td>  {el.name} </td>
              <td>  {el.price} </td>
              <td>  {el.amount} </td>
              <td>  {el.features} </td>
              <td>
                <button type="submit" className="btn btn-outline-accent" 
                        onClick={() => {setAction({ value: "edit", data: {productId: el._id, productIndex: idx}}); setProduct(el)}}>
                  Edit
                </button>

                <button type="submit" className="btn btn-outline-accent" 
                        onClick={() => setAction({value: "delete", data: {productId: el._id}})}>
                  Delete
                </button>
              </td>
              <td className="display-date"> { el.createdAt && convertDate(el.createdAt)} </td>
              <td className="display-date"> {el.editedAt ? convertDate(el.editedAt) : "not updated "} </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  const displayProductsFilter = () => {
    return (
      <>
        <input
          type="text"
          placeholder={`Filter by ${filter.filterType}`}
          value={filter.queryString}
          onChange={(e) => onFilter(e.target.value)}
        />

        <select
          defaultValue={filter.filterType}
          onChange={(e) => setFilter({ ...filter, filterType: e.target.value })}
        >
          <option> Filter By </option>
          <option value="name"> Name </option>
        </select>
      </>
    );
  };
  const displayAddProduct = () => {
    return (
      <form action="POST" className="add-user-form" onSubmit={onCreate}>
        <div className="form-input">
          <label htmlFor="name"> Name </label>
          <input
            type="text"
            placeholder="Name"
            value={product.name}
            name="name"
            id="name"
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </div>

        <div className="form-input">
          <label htmlFor="description"> Description </label>
          <textarea name="description" id="description" placeholder="description" value={product.description} 
                    onChange={e => setProduct({ ...product, description: e.target.value })}>
          </textarea>
        </div>

        <div className="form-input">
          <label htmlFor="price"> Price </label>
          <input
            type="number"
            placeholder="Price"
            value={product.price}
            name="price"
            id="price"
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
        </div>

        <div className="form-input">
          <label htmlFor="features"> Features </label>
          <div className="features-list">
            {/* { feature.length > 0 && displayFeaturesList() } */}
          </div>

          <input
            type="text"
            placeholder="Add feature"
            value={product.features}
            name="features"
            id="features"
            onChange={(e) => setProduct({ ...product, features: e.target.value })}
          />

          <div className='btn-box'>
              {/* <button className="btn btn-accent" onClick={() => displayAddFeature()}> + </button> */}
          </div>
        </div>

        <div className="groupe-btn">
          <button type="submit" className="btn btn-accent">
            Add New Product
          </button>
          <button type="submit" className="btn btn-outline-accent" onClick={() => backToProduct()}>
            Back to Products
          </button>
        </div>
      </form>
    );
  };
  const displayEditProduct = (data) => {
    const { name, description, price, features } = data;

    return (
      <form action="POST" className="add-user-form">
        <div className="form-input">
          <label htmlFor="name"> Name </label>
          <input
            type="text"
            placeholder="Name"
            value={name ? name : product.name}
            name="name"
            id="name"
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </div>

        <div className="form-input">
          <label htmlFor="description"> Description </label>
          <textarea name="description" id="description" placeholder="description" 
                    value={description ? description : product.description} 
                    onChange={e => setProduct({ ...product, description: e.target.value })}>
          </textarea>
        </div>

        <div className="form-input">
          <label htmlFor="price"> Price </label>
          <input
            type="number"
            placeholder="Price"
            value={price ? price : product.price}
            name="price"
            id="price"
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
        </div>

        <div className="form-input">
          <label htmlFor="features"> Features </label>
          <input
            type="text"
            placeholder="Add feature"
            value={features && features.length > 0 ? features : product.features}
            name="features"
            id="features"
            onChange={(e) => setProduct({ ...product, features: e.target.value })}
          />
        </div>

        <div className="group-btn">
          <button type="submit" className="btn btn-accent" onClick={e => onEdit(e, action.data && action.data)}>
            Edit Product
          </button>
          <button type="submit" className="btn btn-outline-accent" onClick={() => backToProduct()}>
            Back to Products
        </button>
        </div>
      </form>
    );

  };
  const displayRemoveProduct = () => {
    return  <div className="remove-product">
              <p> Are you sure you want to delete this Product ? </p>

              <div className="group-btn">
                <button className="btn btn-accent" onClick={() => onDelete(action.data && action.data)}> Delete </button>
                <button className="btn btn-outline-accent" onClick={() => setAction({value: "products"})}> Cancel </button>
              </div>
            </div> 
  };

  useEffect(() => {
    getProducts();
  }, []);
    
    return (
        <div className="products-container">
            <h2 style={{"textAlign": "center"}}> Product Managment </h2>

            {
              action.value === "create" ? 
                  <div className="add-new-user">
                    <h3> Create a New Product </h3>
                    {displayAddProduct()}
                  </div>  :

              action.value === "edit" ? 
                  <div className="add-new-user">
                    <h3> Edit a Product </h3>
                    { Object.keys(product).length > 0 && displayEditProduct(product) }
                  </div>  :
              action.value === "delete" ?  displayRemoveProduct() :

              action.value === "products" ? 
                  <div className="display-users">
                    <h3> List of Products </h3>
                    <button className="btn btn-accent" onClick={() => setAction({value: "create"})}> Create </button>

                    <div className="filter-users">
                      {displayProductsFilter()}
                    </div>
                    

                    {   loading ? "Loading... " : 
                        products.length > 0 ?
                        displayProductsList(products) : 
                        <h4> There is not any Product </h4>
                    }
                  </div> : ""
            }       
        </div>
    )
};

export default Products;
