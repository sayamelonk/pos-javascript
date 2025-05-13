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
export default function ProductCreate({ fetchData }) {
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

  // hook
  useEffect(() => {
    // call function "fetchCategories"
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const storeProduct = async (e) => {
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
    await Api.post("/api/products", formData)
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

        // reset form
        fileInputRef.current.value = "";

        // set state
        setBarcode("");
        setTitle("");
        setImage("");
        setDescription("");
        setBuyPrice("");
        setSellPrice("");
        setStock("");
        setCategoryId("");
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
        className="btn btn-primary d-sm-inline-block"
        data-bs-toggle="modal"
        data-bs-target="#modal-create-product"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
          width={24}
          height={24}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <span className="ps-1">Add New</span>
      </a>
      <div
        className="modal modal-blur fade"
        id="modal-create-product"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
        ref={modalRef}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <form onSubmit={storeProduct}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Product</h5>
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
                  <span className="ps-1">Save</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
