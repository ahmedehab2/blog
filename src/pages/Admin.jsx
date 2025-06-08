import React from "react";
import { useNavigate } from "react-router";

export default function Admin({ products, categories }) {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto w-[80%] mt-2 p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold mb-2">products</h2>
        <button className="btn" onClick={() => navigate("/admin/new")}>
          Add Product
        </button>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            {Object.keys(products[0] || {})
              .filter((key) => key !== "isInCart" && key !== "count")
              .map((key) => (
                <th key={key} className="border border-gray-300 px-4 py-2">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-4 py-2">{item.id}</td>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                ${item.price}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {categories.find((cat) => cat.id === item.categoryId)?.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
