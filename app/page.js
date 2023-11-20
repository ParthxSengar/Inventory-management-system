"use client";

import Header from "./components/Header";
import { useState, useEffect } from "react";

export default function Home() {
  const [productData, setProductData] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [dropdown, setDropdown] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      let rjson = await response.json();
      setProducts(rjson.products);
    };
    fetchProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        // Product added successfully, you can handle the success case here
        console.log("Product added successfully");
        setAlert("Product added successfully");
        setProductData({});
      } else {
        // Handle error cases, e.g., display an error message
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }

    const response = await fetch("/api/product");
    let rjson = await response.json();
    setProducts(rjson.products);
  };

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const onDropdownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length > 3) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch("/api/search?query=" + query);
      let rjson = await response.json();
      setDropdown(rjson.products);
      setLoading(false);
    } else {
      setDropdown([]);
    }
  };

  const buttonAction = async (action, slug, initialQuantity) => {
    let index = products.findIndex((item) => item.slug == slug);
    let newProducts = JSON.parse(JSON.stringify(products));
    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }
    setProducts(newProducts);

    let indexDrop = dropdown.findIndex((item) => item.slug == slug);
    let newDropdown = JSON.parse(JSON.stringify(dropdown));
    if (action == "plus") {
      newDropdown[indexDrop].quantity = parseInt(initialQuantity) + 1;
    } else {
      newDropdown[indexDrop].quantity = parseInt(initialQuantity) - 1;
    }
    setDropdown(newDropdown);
    console.log(action, slug);
    setLoadingAction(true);
    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({action, slug, initialQuantity}),
    });
    let r = await response.json();
    console.log(r);
    setLoadingAction(false);
  }

  return (
    <>
      <Header />

      <div className="container mx-auto p-5">
        <div className="text-green-600 text-center">{alert}</div>
        {/* Find a product */}
        <section className="my-5">
          <h1 className="mb-4 text-center text-3xl font-semibold text-gray-800">
            Find a Product
          </h1>
          <div className="flex items-center justify-center space-x-4">
            <input
              // onBlur={() => {setDropdown([])}}
              onChange={onDropdownEdit}
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-red-300"
              placeholder="Search for a product..."
            />
            {/* Add your dropdown/select element here */}
            {/* <select className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300">
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
              
            </select>
            <button
              type="button"
              className="bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600 transition duration-300"
            >
              Search
            </button> */}
          </div>
          <div className="">
            {loading && (
              <div className="flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                width="40"
                height="40"
                fill="none"
                stroke="#e74c3c"
                strokeWidth="4"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  strokeDasharray="256.58892822265625"
                  strokeDashoffset="0"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    dur="2s"
                    keyTimes="0;1"
                    repeatCount="indefinite"
                    values="0;256.58892822265625"
                  ></animate>
                </circle>
              </svg>
              </div>
            )}
            <div className="absolute w-[78vw] bg-red-100 rounded-md">
            {dropdown.map((item) => {
              return (
                <div
                  key={item.slug}
                  className="container flex justify-between p-3 my-1"
                >
                  <span className="slug">{item.slug} (₹{item.price})</span>
                  <div className="add-sub">
                  <span onClick={() => {buttonAction("plus", item.slug, item.quantity)}} disabled={loadingAction} className="add px-2 rounded-sm bg-red-500 text-white cursor-pointer disabled:bg-red-300">+</span>
                  <span className="quantity px-2 bg-white">{item.quantity}</span>
                  <span onClick={() => {buttonAction("minus", item.slug, item.quantity)}} disabled={loadingAction} className="sub px-2 rounded-sm bg-red-500 text-white cursor-pointer disabled:bg-red-300">-</span>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </section>

        <hr />

        {/* Section: Add a Product */}
        <section className="my-8">
          <h1 className="mb-4 text-center text-3xl font-semibold text-gray-800">
            Add a Product
          </h1>
          <form className="flex flex-col items-center space-y-4">
            <div className="w-full max-w-md">
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>
              <input
                value={productData?.slug || ""}
                name="slug"
                onChange={handleChange}
                type="text"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                id="productName"
                required
              />
            </div>
            <div className="w-full max-w-md">
              <label
                htmlFor="productPrice"
                className="block text-sm font-medium text-gray-700"
              >
                Product Price (₹)
              </label>
              <input
                value={productData?.price || ""}
                name="price"
                onChange={handleChange}
                type="number"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                id="productPrice"
                required
                min="0.01"
                step="0.01"
              />
            </div>
            <div className="w-full max-w-md">
              <label
                htmlFor="productQuantity"
                className="block text-sm font-medium text-gray-700"
              >
                Product Quantity
              </label>
              <input
                value={productData?.quantity || ""}
                name="quantity"
                onChange={handleChange}
                type="number"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                id="productQuantity"
                required
                min="1"
              />
            </div>
            <button
              onClick={addProduct}
              type="submit"
              className="button bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600 transition duration-300"
            >
              Add Product
            </button>
          </form>
        </section>

        <hr />

        {/* Section: Current Stock */}
        <section className="my-8">
          <h1 className="mb-4 text-center text-3xl font-semibold text-gray-800">
            Current Stock
          </h1>
          <table className="w-full table-auto border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border-b border-r">Product Name</th>
                <th className="py-2 px-4 border-b border-r">Price (₹)</th>
                <th className="py-2 px-4 border-b">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {/* Dummy data, replace with actual data */}
              {products.map((product) => {
                return (
                  <tr key={product.slug}>
                    <td className="py-2 px-4 border-b border-r">
                      {product.slug}
                    </td>
                    <td className="py-2 px-4 border-b border-r">
                      {product.price}
                    </td>
                    <td className="py-2 px-4 border-b">{product.quantity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
