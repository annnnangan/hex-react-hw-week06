import { useState, useEffect, useRef } from "react";
import { API_PATH, BASE_URL } from "./constants";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "bootstrap";
import ReactLoading from "react-loading";

const schema = z.object({
  email: z
    .string()
    .min(4, { message: "請填寫電郵。" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "電郵格式不正確" }),
  name: z.string().min(2, { message: "請填寫名字。" }),
  tel: z.string().regex(/^(0[2-8]\d{7}|09\d{8})$/, { message: "電話格式不正確" }),
  address: z.string().min(5, { message: "請填寫收件人地址" }),
  message: z.string().optional(),
});

function App() {
  /* ----------------------------- React Hook Form Config ---------------------------- */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      name: "",
      tel: "",
      address: "",
      message: "",
    },
  });

  /* ----------------------------- Loading ---------------------------- */
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(null);

  /* ----------------------------- Product List ---------------------------- */
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);

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
    getCart();
  }, []);

  /* ----------------------------- Modal ---------------------------- */
  const productModalRef = useRef(null);
  useEffect(() => {
    new Modal(productModalRef.current, { backdrop: false });
  }, []);

  const openModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };

  const closeModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  const handleSeeMore = (product) => {
    setSelectedProduct(product);
    openModal();
  };

  /* ----------------------------- Cart ---------------------------- */
  const [qtySelect, setQtySelect] = useState(1);
  const [cart, setCart] = useState({});

  const addCartItem = async (product_id, qty, product_title) => {
    try {
      setLoadingProductId(product_id);
      await axios.post(`${BASE_URL}/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      getCart();
      alert(`已成功將${product_title}加入購物車`);
    } catch (error) {
      console.dir(error);
      alert("無法加入購物車。");
    } finally {
      setLoadingProductId(null);
    }
  };

  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
      setCart(res.data.data);
    } catch (error) {
      console.dir(error);
      alert("無法取得購物車列表。");
    }
  };

  const removeCart = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/${API_PATH}/carts`);
      alert(`已成功清空購物車`);
    } catch (error) {
      console.dir(error);
      alert("無法清空購物車。");
    }
  };

  const removeCartItem = async (cartItemId, productTitle) => {
    try {
      await axios.delete(`${BASE_URL}/api/${API_PATH}/cart/${cartItemId}`);
      getCart();
      alert(`已成功從購物車刪除${productTitle}`);
    } catch (error) {
      console.dir(error);
      alert(`從購物車刪除${productTitle}失敗`);
    }
  };

  const updateCartItemQty = async (cartItemId, productId, qty, productTitle) => {
    try {
      if (qty === 0) {
        await removeCartItem(cartItemId, productTitle);
      } else {
        await axios.put(`${BASE_URL}/api/${API_PATH}/cart/${cartItemId}`, {
          data: {
            product_id: productId,
            qty: Number(qty),
          },
        });

        getCart();
        alert(`已成功更新${productTitle}的數量`);
      }
    } catch (error) {
      console.dir(error);
      alert(`無法更新${productTitle}的數量`);
    }
  };

  /* ----------------------------- Checkout ---------------------------- */
  const onSubmit = async (data) => {
    const { message, ...user } = data;

    const checkoutInfo = {
      data: { user: user, message },
    };

    try {
      await axios.post(`${BASE_URL}/api/${API_PATH}/order`, checkoutInfo);
      getCart();
      reset();
      alert(`結帳成功`);
    } catch (error) {
      console.dir(error);
      alert(`結帳失敗`);
    }
  };

  return (
    <div className="container">
      <div className="mt-4">
        {/* 產品Modal */}
        <div ref={productModalRef} style={{ backgroundColor: "rgba(0,0,0,0.5)" }} className="modal fade" id="productModal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5">產品名稱：{selectedProduct.title}</h2>
                <button onClick={closeModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="img-fluid" />
                <p>內容：{selectedProduct.content}</p>
                <p>描述：{selectedProduct.description}</p>
                <p>
                  價錢：{selectedProduct.price} <del>{selectedProduct.origin_price}</del> 元
                </p>
                <div className="input-group align-items-center">
                  <label htmlFor="qtySelect">數量：</label>
                  <select value={qtySelect} onChange={(e) => setQtySelect(e.target.value)} id="qtySelect" className="form-select">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => addCartItem(selectedProduct.id, qtySelect, selectedProduct.title)}>
                  加入購物車
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 產品列表 */}
        <div>
          <h2>產品列表</h2>
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
                        <button onClick={() => handleSeeMore(product)} type="button" className="btn btn-outline-secondary">
                          查看更多
                        </button>
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
        </div>

        {isLoadingProducts && (
          <div className="py-4 d-flex align-items-center justify-content-center">
            <ReactLoading type={"spin"} color={"#000000"} />
          </div>
        )}

        {/* 購物車 */}

        <div className="mt-5">
          <h2>購物車</h2>
          {cart.carts?.length > 0 && (
            <div className="text-end">
              <button className="btn btn-outline-danger" type="button" onClick={() => removeCart()}>
                清空購物車
              </button>
            </div>
          )}

          <table className="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style={{ width: "150px" }}>數量/單位</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>
              {cart.carts?.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-primary py-4">
                    購物車空空的～趕快買起來～
                  </td>
                </tr>
              )}
              {cart.carts?.length > 0 &&
                cart.carts?.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeCartItem(item.id, item.product.title)}>
                        刪除
                      </button>
                    </td>
                    <td>{item.product.title}</td>
                    <td style={{ width: "150px" }}>
                      <div className="d-flex align-items-center">
                        <div className="btn-group me-2" role="group">
                          <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => updateCartItemQty(item.id, item.product_id, item.qty - 1, item.product.title)}>
                            -
                          </button>
                          <span className="btn border border-dark" style={{ width: "50px", cursor: "auto" }}>
                            {item.qty}
                          </span>
                          <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => updateCartItemQty(item.id, item.product_id, item.qty + 1, item.product.title)}>
                            +
                          </button>
                        </div>
                        <span className="input-group-text bg-transparent border-0">{item.product.unit}</span>
                      </div>
                    </td>
                    <td>${item.total}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end">
                  總計
                </td>
                <td className="text-end">${cart.total}</td>
              </tr>
              <tr>
                <td colSpan="3" className="text-end text-success">
                  折扣價
                </td>
                <td className="text-end text-success"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 表單 */}
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input id="email" name="email" type="email" className={`form-control ${errors?.email && "is-invalid"}`} placeholder="請輸入 Email" {...register("email")} />
            {errors?.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input id="name" name="姓名" type="text" className={`form-control ${errors?.name && "is-invalid"}`} placeholder="請輸入姓名" {...register("name")} />
            {errors?.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input id="tel" name="電話" type="text" className={`form-control ${errors?.tel && "is-invalid"}`} placeholder="請輸入電話" {...register("tel")} />
            {errors?.tel && <div className="invalid-feedback">{errors.tel.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input id="address" name="地址" type="text" className={`form-control ${errors?.address && "is-invalid"}`} placeholder="請輸入地址" {...register("address")} />
            {errors?.address && <div className="invalid-feedback">{errors.address.message}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea id="message" className={`form-control ${errors?.message && "is-invalid"}`} cols="30" rows="10" {...register("message")}></textarea>
            {errors?.message && <div className="invalid-feedback">{errors.message.message}</div>}
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-danger d-flex gap-2" disabled={cart?.carts?.length === 0 || isSubmitting}>
              送出訂單
              {isSubmitting && <ReactLoading type={"spin"} height={"1.5rem"} width={"1.5rem"} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
