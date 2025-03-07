import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import { API_PATH, BASE_URL } from "../constants";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [isAddingCart, setIsAddingCart] = useState(false);
  const [qtySelect, setQtySelect] = useState(1);

  /* ----------------------------- Load Product Information from API ---------------------------- */

  useEffect(() => {
    const getProduct = async () => {
      setIsLoadingProduct(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/${API_PATH}/product/${id}`);
        console.log(res.data.product);
        setProduct(res.data.product);
      } catch (error) {
        console.dir(error);
        alert("取得產品失敗");
      } finally {
        setIsLoadingProduct(false);
      }
    };
    getProduct();
  }, [id]);

  /* ----------------------------- Add to Cart ---------------------------- */
  const addCartItem = async (product_id, qty, product_title) => {
    try {
      setIsAddingCart(true);
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
      setIsAddingCart(false);
    }
  };

  return (
    <div className="container my-5">
      <h1>產品詳細頁面</h1>
      {isLoadingProduct && (
        <div className="py-4 d-flex align-items-center justify-content-center">
          <ReactLoading type={"spin"} color={"#000000"} />
        </div>
      )}
      {!isLoadingProduct && (
        <div className="row">
          <div className="col-6">
            <img className="img-fluid" src={product?.imageUrl} alt={product.title} />
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center gap-2">
              <h2>{product.title}</h2>
              <span className="badge text-bg-success">{product.category}</span>
            </div>
            <p className="mb-3">{product.description}</p>
            <p className="mb-3">{product.content}</p>
            <h5 className="mb-3">NT$ {product.price}</h5>
            <div className="input-group align-items-center w-75">
              <select value={qtySelect} onChange={(e) => setQtySelect(e.target.value)} id="qtySelect" className="form-select">
                {Array.from({ length: 10 }).map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <button type="button" className="btn btn-primary d-flex gap-2" onClick={() => addCartItem(product.id, qtySelect, product.title)} disabled={isAddingCart}>
                加入購物車
                {isAddingCart && <ReactLoading type={"spin"} height={"1.5rem"} width={"1.5rem"} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
