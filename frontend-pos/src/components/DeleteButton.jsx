// import service api
import Api from "../services/api";

// import js cookie
import Cookies from "js-cookie";

// import toast
import toast from "react-hot-toast";

// import react-confirm-alert
import { confirmAlert } from "react-confirm-alert";

import "react-confirm-alert/src/react-confirm-alert.css";

// eslint-disable-next-line react/prop-types
export default function DeleteButton({ id, endpoint, fetchData }) {
  // get token from cookies
  const token = Cookies.get("token");

  // function to show confirmation dialog
  const confirmDelete = () => {
    confirmAlert({
      title: "Are you sure?",
      message: "Do you want to delete this data?",
      buttons: [
        {
          label: "Yes",
          onClick: deleteData,
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  // function to handle data deletion
  const deleteData = async () => {
    try {
      // set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      // call API to delete data
      await Api.delete(`${endpoint}/${id}`).then((response) => {
        // show success notification
        toast.success(`${response.data.meta.message}`, {
          duration: 4000,
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#4BB543",
            color: "#fff",
          },
        });
        // refresh data after deletion
        fetchData();
      });
    } catch (error) {
      toast.error("Failed to delete data!", {
        duration: 4000,
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };
  return (
    <button className="btn btn-outline-danger rounded" onClick={confirmDelete}>
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
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </svg>
      Delete
    </button>
  );
}
