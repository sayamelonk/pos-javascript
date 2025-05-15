// import service api
import Api from "../services/api";

// import js cookie
import Cookies from "js-cookie";

// eslint-disable-next-line react/prop-types
const ExportButton = ({ startDate, endDate, type }) => {
  const exportToExcel = async () => {
    const token = Cookies.get("token");

    if (token) {
      // set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;
      try {
        // fetch data from API with Axios
        const response = await Api.get(
          `/api/${type}/export?start_date=${startDate}&end_date=${endDate}`,
          {
            responseType: "blob",
          }
        );

        // create a URL for the blob data
        const url = URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute(
          "download",
          `report-${type}-${startDate}-${endDate}.xlsx`
        );

        document.body.appendChild(link);
        link.click();

        // clean up and remove the link
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    } else {
      console.error("Token is not available!");
    }
  };

  return (
    <button
      className="btn btn-success btn-md border shadow me-3"
      onClick={exportToExcel}
      disabled={!startDate || !endDate}
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
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        />
      </svg>
      EXCEL
    </button>
  );
};

export default ExportButton;
