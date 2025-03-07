import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactLoading from "react-loading";
import { z } from "zod";
import { API_PATH, BASE_URL } from "../constants";

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

const CartPage = () => {
  const [cart, setCart] = useState({});
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

  /* ----------------------------- Cart ---------------------------- */
  useEffect(() => {
    getCart();
  }, []);

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
      getCart();
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
    <div className="container my-5">
      {/* 購物車 */}
      <div>
        <h1>購物車</h1>
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

      {/* 表單 */}
      <div className="my-5 row justify-content-center">
        <h1>購物表單</h1>
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
};

export default CartPage;
