/* eslint-disable react/prop-types */
// import moneyFormat
import moneyFormat from "../utils/moneyFormat";

// import service api
import Api from "../services/api";

// import js cookie
import Cookies from "js-cookie";

// import toast
import toast from "react-hot-toast";

// eslint-disable-next-line react/prop-types
export default function OrderItemList({ carts, fetchCarts }) {
  const token = Cookies.get("token");

  const updateCartQuantity = ({ cart, qty }) => {
    if (token) {
      // set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;
      Api.post("/api/carts", {
        product_id: cart.product_id,
        qty: parseInt(qty === "plus" ? (cart.qty = +1) : (cart.qty = -1)),
        price: cart.product.sell_price,
      }).then((response) => {
        // show toast
        toast.success(`${response.data.meta.message}`, {
          duration: 1000,
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        // call fetchCarts
        fetchCarts();
      });
    }
  };

  //function deleteCart
  const deleteCart = (cartID) => {
    if (token) {
      //set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      Api.delete(`/api/carts/${cartID}`).then((response) => {
        //show toast
        toast.success(`${response.data.meta.message}`, {
          duration: 2000,
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        //fetchCarts
        fetchCarts();
      });
    }
  };

  return (
    <div className="card-body scrollable-card-body">
      <div className="row">
        {carts.length > 0 ? (
          carts.map((cart) => (
            <div className="col-12 mb-2" key={cart.id}>
              <div className="card rounded">
                <div className="card-body d-flex align-items-center">
                  <img
                    src={`${import.meta.env.VITE_APP_BASEURL}/${
                      cart.product.image
                    }`}
                    alt={cart.product.title}
                    width={50}
                    height={50}
                    className="me-3 rounded"
                  />
                  <div className="flex-fill">
                    <h4 className="mb-0">{cart.product.title}</h4>
                    <p className="text-success mb-0 mt-1">
                      {moneyFormat(cart.price)}
                    </p>
                    <hr className="mb-1 mt-1" />
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "30px", height: "30px", padding: "0" }}
                        onClick={() =>
                          updateCartQuantity({ cart, qty: "minus" })
                        }
                        disabled={cart.qty <= 1}
                      >
                        -
                      </button>
                      <p className="text-muted mb-0 ms-2 me-2">
                        Qty: {cart.qty}
                      </p>
                      <button
                        className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "30px", height: "30px", padding: "0" }}
                        onClick={() =>
                          updateCartQuantity({ cart, qty: "plus" })
                        }
                        disabled={cart.qty >= cart.product.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="btn btn-danger ms-3 rounded p-2 pt-1 pb-1"
                    onClick={() => deleteCart(cart.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">Belum Ada Orders Items</div>
        )}
      </div>
    </div>
  );
}
