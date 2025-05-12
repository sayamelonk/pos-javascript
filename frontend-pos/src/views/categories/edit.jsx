import { useState, useRef, useEffect } from "react";

// import js cookies
import Cookies from "js-cookie";

// import toast
import toast from "react-hot-toast";

// import service api
import Api from "../../services/api";

// import handler errors
import { handlerErrors } from "../../utils/handlerErrors";

// eslint-disable-next-line react/prop-types
export default function CategoryEdit({ fetchData, categoryId }) {
  // state
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  // ref
  const fileInputRef = useRef(null); // create a reference for the file input
  const modalRef = useRef(null); // create a reference for the modal

  // token
  const token = Cookies.get("token");

  // function "fetchCategory"
  const fetchCategory = async () => {
    if (categoryId) {
      try {
        // set authorization header with token
        Api.defaults.headers.common["Authorization"] = token;
        const response = await Api.get(`/api/categories/${categoryId}`);

        const category = response.data.data;
        setName(category.name);
        setDescription(category.description);
        // image is optional, handled separately if needed
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    }
  };

  // fetch existing category data
  useEffect(() => {
    // call function "fetchCategory"
    fetchCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, token]);

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

  // function "updateCategory"
  const updateCategory = async (e) => {
    e.preventDefault();
    // define formData
    const formData = new FormData();

    // append data to "formData"
    formData.append("image", image);
    formData.append("name", name);
    formData.append("description", description);

    // set authorization header with token
    Api.defaults.headers.common["Authorization"] = token;
    await Api.put(`/api/categories/${categoryId}`, formData)
      .then((response) => {
        //show toast
        toast.success(`${response.data.meta.message}`, {
          duration: 4000,
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        // Hide the modal
        const modalElement = modalRef.current;
        // eslint-disable-next-line no-undef
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        //call function "fetchData"
        fetchData();
      })
      .catch((error) => {
        //assign error to function "handleErrors"
        handlerErrors(error.response.data, setErrors);
      });
  };

  return (
    <>
      <a
        href="#"
        className="btn rounded btn-outline-cyan"
        data-bs-toggle="modal"
        data-bs-target={`#modal-edit-category-${categoryId}`}
      >
        Edit
      </a>
      <div
        className="modal modal-blur fade"
        id={`modal-edit-category-${categoryId}`}
        ref={modalRef}
        tabIndex="-1"
        aria-hidden="true"
        role="dialog"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <form onSubmit={updateCategory}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Category</h5>
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
                        ref={fileInputRef}
                        onChange={handleFileChange}
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
                        rows="3"
                        className="form-control"
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
