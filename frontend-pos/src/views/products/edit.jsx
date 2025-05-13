import { useState, useRef, useEffect } from "react";

// import Cookies from js-cookie
import Cookies from "js-cookie";

// import toats
import toast from "react-hot-toast";

// import service api
import Api from "../../services/api";

// import handler errors
import { handleErrors } from "../../utils/handleErrors";

// import moneyFormat
import moneyFormat from "../../utils/moneyFormat";

// eslint-disable-next-line react/prop-types
export default function ProductEdit({ productId, fetchData }) {
  // state
  const [barcode, setBarcode] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [errors, setErrors] = useState({});

  // state categories
  const [categories, setCategories] = useState([]);

  // ref
  const fileInputRef = useRef(null); // create a reference for the file input
  const modalRef = useRef(null); // create a reference for the modal

  // token
  const token = Cookies.get("token");

  // function "fetchCategories"
  const fetchCategories = async () => {
    // set authorization header with token
    Api.defaults.headers.common["Authorization"] = token;
    await Api.get("/api/categories-all").then((response) => {
      // set data reseponse to state "categories"
      setCategories(response.data.data);
    });
  };

  // funtion "fetchProductById"
  const fetchProductById = async () => {
    if (productId) {
      try {
        // set authorization header with token
        Api.defaults.headers.common["Authorization"] = token;
        await Api.get(`/api/products/${productId}`).then((response) => {
          // assign response data to state
          setBarcode(response.data.data.barcode);
          setTitle(response.data.data.title);
          setImage(response.data.data.image);
          setDescription(response.data.data.description);
          setBuyPrice(response.data.data.buy_price);
          setSellPrice(response.data.data.sell_price);
          setStock(response.data.data.stock);
          setCategoryId(response.data.data.category_id);
        });
      } catch (error) {
        console.error("There was an error fetching the product data!", error);
      }
    }
  };

  // hook
  useEffect(() => {
    // call function "fetchCategories"
    fetchCategories();

    // call function "fetchProductById"
    fetchProductById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, token]);

  // function "handleFileChange"
  const handleFileChange = (e) => {
    // define variable for get value image data
    const imageData = e.target.files[0];

    // check validation file
    if (!imageData.type.match("image.*")) {
      // reset file input value
      fileInputRef.current.value = "";

      // set state "image" to null
      setImage("");

      // show toast
      toast.error("Format File not Supported!", {
        duration: 4000,
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    // assign file to state "image"
    setImage(imageData);
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    // define formData
    const formData = new FormData();

    // append data to "formData"
    formData.append("barcode", barcode);
    formData.append("title", title);
    formData.append("image", image);
    formData.append("description", description);
    formData.append("buy_price", buyPrice);
    formData.append("sell_price", sellPrice);
    formData.append("stock", stock);
    formData.append("category_id", categoryId);

    // set authorization header with token
    Api.defaults.headers.common["Authorization"] = token;
    await Api.put(`/api/products/${productId}`, formData)
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

        // call function "fetchData"
        fetchData();
      })
      .catch((error) => {
        // assign errors to state "handleErrors"
        handleErrors(error.response.data, setErrors);
      });
  };

  return (
    <>
      <a
        href="#"
        className="btn rounded btn-outline-cyan"
        data-bs-toggle="modal"
        data-bs-target={`#modal-edit-product-${productId}`}
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
        id={`modal-edit-product-${productId}`}
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div>
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <form onSubmit={updateProduct}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Product</h5>
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
                        <label className="form-label">Image</label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                        {errors.image && (
                          <div className="alert alert-danger mt-2">
                            {errors.image}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Barcode</label>
                        <input
                          type="text"
                          className="form-control"
                          value={barcode}
                          onChange={(e) => setBarcode(e.target.value)}
                          placeholder="Enter Barcode"
                        />
                        {errors.barcode && (
                          <div className="alert alert-danger mt-2">
                            {errors.barcode}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Product Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter Product Name"
                        />
                        {errors.title && (
                          <div className="alert alert-danger mt-2">
                            {errors.title}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Category</label>
                        <select
                          className="form-select"
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {errors.category_id && (
                          <div className="alert alert-danger mt-2">
                            {errors.category_id}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Stock</label>
                        <input
                          type="number"
                          className="form-control"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          placeholder="Enter Stock Product"
                        />
                        {errors.stock && (
                          <div className="alert alert-danger mt-2">
                            {errors.stock}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter Dscription"
                        />
                        {errors.description && (
                          <div className="alert alert-danger mt-2">
                            {errors.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Buy Price</label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            buyPrice ? moneyFormat(parseFloat(buyPrice)) : ""
                          }
                          onChange={(e) => {
                            // Remove currency formatting and non-numeric characters
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setBuyPrice(value);
                          }}
                          placeholder="Enter Buy Price"
                        />
                        {errors.buy_price && (
                          <div className="alert alert-danger mt-2">
                            {errors.buy_price}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Sell Price</label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            sellPrice ? moneyFormat(parseFloat(sellPrice)) : ""
                          }
                          onChange={(e) => {
                            // Remove currency formatting and non-numeric characters
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setSellPrice(value);
                          }}
                          placeholder="Enter Sell Price"
                        />
                        {errors.sell_price && (
                          <div className="alert alert-danger mt-2">
                            {errors.sell_price}
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
      </div>
    </>
  );
}
