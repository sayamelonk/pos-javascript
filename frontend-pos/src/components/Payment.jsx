// import useState and useEffect
import { useState, useEffect } from "react";

// import moneyFormat
import moneyFormat from "../utils/moneyFormat";

// import js cookie
import Cookies from "js-cookie";

// import service api
import Api from "../services/api";

// import toast
import toast from "react-hot-toast";

// import react select
import Select from "react-select";

// eslint-disable-next-line react/prop-types
export default function Payment({ totalCarts, fetchCarts }) {
  // set state
  const [grandTotal, setGrandTotal] = useState(totalCarts);
  const [cash, setCash] = useState("");
  const [change, setChange] = useState(0);
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState("percentage"); // "rupiah" or "percentage"

  // state customers
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  // function setDiscount
  const setDiscountHandler = (e) => {
    const value = e.target.value;

    // Validate percentage discount
    if (discountType === "percentage" && parseInt(value) > 100) {
      toast.error("Discount sudah 100%");
      return;
    }

    setDiscount(value);

    if (discountType === "percentage") {
      const percentageAmount = (totalCarts * value) / 100;
      setGrandTotal(totalCarts - percentageAmount);
    } else {
      setGrandTotal(totalCarts - parseInt(value));
    }

    setCash(0);
    setChange(0);
  };

  // function setCash
  const setChangeHandler = (e) => {
    // set state
    setCash(e.target.value);
    setChange(e.target.value - grandTotal);
  };

  // function setGrandTotal
  const setGrandTotalHandler = () => {
    // set state
    setGrandTotal(totalCarts);
  };

  // hook useEffect
  useEffect(() => {
    setGrandTotalHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCarts]);

  // function "fetchCustomers"
  const fetchCustomers = async () => {
    const token = Cookies.get("token");

    if (token) {
      // set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;
      await Api.get("/api/customers-all").then((response) => {
        // set data reseponse to state "customers"
        setCustomers(response.data.data);
      });
    }
  };

  // hook useEffect
  useEffect(() => {
    fetchCustomers();
  }, []);

  // function storeTransaction
  const storeTransaction = async () => {
    //get token from cookies inside the function to ensure it's up-to-date
    const token = Cookies.get("token");

    if (token) {
      //set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      await Api.post("/api/transactions", {
        customer_id: selectedCustomer.value || null,
        discount: parseInt(discount) || 0,
        cash: parseInt(cash),
        change: parseInt(change),
        grand_total: parseInt(grandTotal),
      })
        .then((response) => {
          //show toast
          toast.success(response.data.meta.message, {
            duration: 4000,
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });

          //fetchCarts
          fetchCarts();

          const receiptWindow = window.open(
            `/transactions/print?invoice=${response.data.data.invoice}`,
            "_blank"
          );
          receiptWindow.onload = function () {
            setTimeout(() => {
              receiptWindow.print();
            }, 10);
            receiptWindow.onafterprint = function () {
              receiptWindow.close(); // This will work since the script opened the window
            };
          };
        })
        .finally(() => {
          //reset form
          setSelectedCustomer("");
          setDiscount(0);
          setCash(0);
          setChange(0);
          setGrandTotal(totalCarts);
        });
    }
  };

  return (
    <>
      <button
        className="btn btn-success w-100 rounded"
        data-bs-toggle="modal"
        data-bs-target="#modal-pay"
        disabled={totalCarts === 0}
      >
        Payment
      </button>
      <div
        className="modal modal-blur fade"
        id="modal-pay"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Payment Cash</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="card rounded bg-muted-lt">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 col-4">
                      <h4 className="fw-bold">GRAND TOTAL</h4>
                    </div>
                    <div className="col-md-8 col-8 text-end">
                      <h2 className="fw-bold">{moneyFormat(grandTotal)}</h2>
                      <div>
                        <hr />
                        <h3 className="text-success">
                          Change : <strong>{moneyFormat(change)}</strong>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb2 mt-2">
                <div className="col-md-6 mt-2">
                  <label className="mb-1">Customer</label>
                  <Select
                    options={customers}
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e)}
                    styles={{
                      // Styling untuk container select (kotak utama)
                      control: (base) => ({
                        ...base,
                        backgroundColor: "var(--tblr-bg-surface)", // Warna background mengikuti tema
                        borderColor: "var(--tblr-border-color)", // Warna border mengikuti tema
                      }),
                      // Styling untuk dropdown menu
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "var(--tblr-bg-surface)", // Warna background dropdown
                        borderColor: "var(--tblr-border-color)", // Warna border dropdown
                      }),
                      // Styling untuk setiap opsi dalam dropdown
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused
                          ? "var(--tblr-bg-surface-hover)" // Warna saat hover
                          : "var(--tblr-bg-surface)", // Warna normal
                        color: "var(--tblr-body-color)", // Warna teks
                        ":active": {
                          backgroundColor: "var(--tblr-bg-surface-hover)", // Warna saat diklik
                        },
                      }),
                      // Styling untuk nilai yang dipilih
                      singleValue: (base) => ({
                        ...base,
                        color: "var(--tblr-body-color)", // Warna teks nilai yang dipilih
                      }),
                      // Styling untuk input text
                      input: (base) => ({
                        ...base,
                        color: "var(--tblr-body-color)", // Warna teks input
                      }),
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label>Discount</label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={discountType === "percentage"}
                        onChange={(e) => {
                          setDiscountType(
                            e.target.checked ? "percentage" : "rupiah"
                          );
                          setDiscount("");
                          setGrandTotal(totalCarts);
                        }}
                      />
                      <label className="form-check-label">
                        {discountType === "percentage"
                          ? "Percentage (%)"
                          : "Rupiah (Rp)"}
                      </label>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    value={
                      discountType === "percentage"
                        ? discount
                        : discount
                        ? moneyFormat(parseInt(discount))
                        : ""
                    }
                    onChange={(e) => {
                      if (discountType === "percentage") {
                        setDiscountHandler(e);
                      } else {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setDiscountHandler({ target: { value } });
                      }
                    }}
                    placeholder={
                      discountType === "percentage"
                        ? "Discount (%)"
                        : "Discount (Rp.)"
                    }
                  />
                </div>
                <div className="row mb-2 mt-3">
                  <div className="col-md-12">
                    <label className="mb-1">Cash (Rp.)</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={cash ? moneyFormat(parseInt(cash)) : ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        if (value === "" || !isNaN(parseInt(value))) {
                          setChangeHandler({ target: { value } });
                        }
                      }}
                      placeholder="Cash (Rp.)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn me-auto rounded"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                className="btn btn-primary rounded"
                data-bs-dismiss="modal"
                onClick={() => storeTransaction()}
                disabled={cash < grandTotal || grandTotal === 0}
              >
                Pay Order + Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
