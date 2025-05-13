import { useState, useRef, useEffect } from "react";

// import js cookie
import Cookies from "js-cookie";

// import toats
import toast from "react-hot-toast";

// import service api
import Api from "../../services/api";

// import handler errors
import { handleErrors } from "../../utils/handleErrors";

// eslint-disable-next-line react/prop-types
export default function CustomerEdit({ fetchData, customerId }) {
  // state
  const [name, setName] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});

  const modalRef = useRef(null); // create a reference for the modal

  // token
  const token = Cookies.get("token");

  // function "fetchCustomer"
  const fetchCustomer = async () => {
    if (customerId) {
      try {
        // set authorization header with token
        Api.defaults.headers.common["Authorization"] = token;
        const response = await Api.get(`/api/customers/${customerId}`);

        const customer = response.data.data;
        setName(customer.name);
        setNoTelp(customer.no_telp);
        setAddress(customer.address);
      } catch (error) {
        console.error("There was an error fetching the category data!", error);
      }
    }
  };

  // fetch Existing Data
  useEffect(() => {
    // call funtion "fetchCustomer"
    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, token]);

  // function "updateCustomer"
  const updateCustomer = async (e) => {
    e.preventDefault();

    // set authorization header with token
    Api.defaults.headers.common["Authorization"] = token;
    await Api.put(`/api/customers/${customerId}`, {
      // data
      name: name,
      no_telp: noTelp,
      address: address,
    })
      .then((response) => {
        // show toast
        toast.success(`${response.data.meta.message}`, {
          duration: 4000,
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        // hide the modal
        const modalElement = modalRef.current;
        // eslint-disable-next-line no-undef
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        // fetch data
        fetchData();
      })
      .catch((error) => {
        // assign error to state "errors"
        handleErrors(error.response.data, setErrors);
      });
  };

  return (
    <>
      <a
        href="#"
        className="btn rounded btn-outline-cyan"
        data-bs-toggle="modal"
        data-bs-target={`#modal-edit-customer-${customerId}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
          width={16}
          height={16}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
        Edit
      </a>
      <div
        className="modal modal-blur fade"
        id={`modal-edit-customer-${customerId}`}
        tabIndex={-1}
        ref={modalRef}
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <form onSubmit={updateCustomer}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Customer</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Customer Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Customer Name"
                      />
                      {errors.name && (
                        <div className="alert alert-danger mt-2">
                          {errors.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">No. Telp</label>
                      <input
                        type="text"
                        className="form-control"
                        value={noTelp}
                        onChange={(e) => setNoTelp(e.target.value)}
                        placeholder="Enter No. Telp"
                      />
                      {errors.no_telp && (
                        <div className="alert alert-danger mt-2">
                          {errors.no_telp}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <textarea
                        rows={3}
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter Address"
                      />
                      {errors.address && (
                        <div className="alert alert-danger mt-2">
                          {errors.address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <a
                  href="#"
                  className="btn me-auto rounded"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </a>
                <button
                  type="submit"
                  className="btn btn-primary ms-auto rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                    height={18}
                    width={18}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <span className="ps-1">Update</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
