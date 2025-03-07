import { useState, useEffect } from "react";
import { API_PATH, BASE_URL } from "../constants";
import axios from "axios";
import { Link } from "react-router-dom";

import ReactLoading from "react-loading";

const ProductsPage = () => {
  /* ----------------------------- Loading ---------------------------- */
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(null);

  /* ----------------------------- Product List ---------------------------- */
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/${API_PATH}/products`);
        setProducts(res.data.products);
      } catch (error) {
        console.dir(error);
        alert("取得產品失敗");
      } finally {
        setIsLoadingProducts(false);
      }
    };
    getProducts();
  }, []);

  /* ----------------------------- Add to Cart ---------------------------- */
  const addCartItem = async (product_id, qty, product_title) => {
    try {
      setLoadingProductId(product_id);
      await axios.post(`${BASE_URL}/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });

      alert(`已成功將${product_title}加入購物車`);
    } catch (error) {
      console.dir(error);
      alert("無法加入購物車。");
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <div className="container">
      <h1>產品列表</h1>
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {!isLoadingProducts &&
            products.map((product) => (
              <tr key={product.id}>
                <td style={{ width: "200px" }}>
                  <img className="img-fluid" src={product.imageUrl} alt={product.title} />
                </td>
                <td>{product.title}</td>
                <td>
                  <del className="h6">原價 {product.origin_price} 元</del>
                  <div className="h5">特價 {product.price}元</div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <Link className="btn btn-outline-secondary" to={`/products/${product.id}`}>
                      查看更多
                    </Link>
                    <button type="button" className="btn btn-outline-danger d-flex gap-2" onClick={() => addCartItem(product.id, 1, product.title)}>
                      加到購物車
                      {loadingProductId === product.id && <ReactLoading type={"spin"} color={"#000000"} height={"1.5rem"} width={"1.5rem"} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {isLoadingProducts && (
        <div className="py-4 d-flex align-items-center justify-content-center">
          <ReactLoading type={"spin"} color={"#000000"} />
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
