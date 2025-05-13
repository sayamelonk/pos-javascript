import { useState, useRef } from "react";

// import Cookies from js-cookie
import Cookies from "js-cookie";

// import toaster
import toast from "react-hot-toast";

// import service api
import Api from "../../services/api";

// import handler error
import { handleErrors } from "../../utils/handleErrors";

// eslint-disable-next-line react/prop-types
export default function CategoryCreate({ fetchData }) {
  // state
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  // ref
  const fileInputRef = useRef(null); // create a reference to the file input
  const modalRef = useRef(null); // create a reference to the modal

  // token
  const token = Cookies.get("token");

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

  // function "storeCategory"
  const storeCategory = async (e) => {
    e.preventDefault();

    // define formData
    const formData = new FormData();

    // append data to "formData"
    formData.append("image", image);
    formData.append("name", name);
    formData.append("description", description);

    // set authorization header with token
    Api.defaults.headers.common["Authorization"] = token;
    await Api.post("/api/categories", formData)
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
        setName("");
        setImage("");
        setDescription("");
      })
      .catch((error) => {
        // assign error to function "handleErrrors"
        handleErrors(error.response.data, setErrors);
      });
  };

  return (
    <>
      <a
        href="#"
        className="btn btn-primary d-sm-inline-block"
        data-bs-toggle="modal"
        data-bs-target="#modal-create-category"
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
        id="modal-create-category"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
        ref={modalRef}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <form onSubmit={storeCategory}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Category</h5>
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
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Category Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter category name"
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
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                      />
                      {errors.description && (
                        <div className="alert alert-danger mt-2">
                          {errors.description}
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
