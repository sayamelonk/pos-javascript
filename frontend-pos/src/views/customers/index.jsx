// import useState dan useEffect
import { useState, useEffect } from "react";

// import layout admin
import LayoutAdmin from "../../layouts/admin";

// import js cookie
import Cookies from "js-cookie";

// import service api
import Api from "../../services/api";

// import component pagination
import PaginationComponent from "../../components/pagination";

// import create customer
import CustomerCreate from "./create";

// import edit customer
import CustomerEdit from "./edit";

// import delete button
import DeleteButton from "../../components/DeleteButton";

export default function CustomersIndex() {
  // state customers
  const [customers, setCustomers] = useState([]);

  // define state "pagination"
  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 0,
    currentPage: 1,
  });

  // state keywords
  const [keywords, setkeywords] = useState("");

  // define method "fetchData"
  const fetchData = async (pageNumber, keywords = "") => {
    // define variable "page"
    const page = pageNumber ? pageNumber : pagination.currentPage;

    // get token from cookies inside the function to ensure it's up-to-date
    const token = Cookies.get("token");

    if (token) {
      // set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      try {
        // fetch data from API with Axios
        const response = await Api.get(
          `/api/customers?page=${page}&search=${keywords}`
        );

        // assign response data to state "customers"
        setCustomers(response.data.data);

        // set pagination
        setPagination(() => ({
          total: response.data.pagination.total,
          perPage: response.data.pagination.perPage,
          currentPage: response.data.pagination.currentPage,
        }));
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    } else {
      console.error("Token is not available!");
    }
  };

  // call function "fetchData"
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // function "searchHandler"
  const searchHandler = () => {
    // call funtion "fetchDataPost" with params
    fetchData(1, keywords);
  };

  // function "handleKeyDown"
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchHandler();
    }
  };

  return (
    <LayoutAdmin>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">HALAMAN</div>
              <h2 className="page-title">CUSTOMERS</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            <div className="col-12 mb-3">
              <div className="input-group">
                <CustomerCreate fetchData={fetchData} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="search by customer name"
                  value={keywords}
                  onChange={(e) => setkeywords(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={searchHandler}
                  className="btn btn-md btn-primary"
                >
                  SEARCH
                </button>
              </div>
            </div>
            <div className="col-12">
              <div className="card">
                <div className="table-responsive">
                  <table className="table table-vcenter table-mobile-md card-table">
                    <thead>
                      <tr>
                        <th>Customer Name</th>
                        <th>No. Telp</th>
                        <th>Address</th>
                        <th className="w-1">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.length > 0 ? (
                        customers.map((customer, index) => (
                          <tr key={index}>
                            <td data-label="Customer Name">{customer.name}</td>
                            <td className="text-muted" data-label="No. Telp">
                              {customer.no_telp}
                            </td>
                            <td className="text-muted" data-label="Address">
                              {customer.address}
                            </td>
                            <td>
                              <div className="btn-list flex-nowrap">
                                <CustomerEdit
                                  customerId={customer.id}
                                  fetchData={fetchData}
                                />
                                <DeleteButton
                                  id={customer.id}
                                  endpoint={"/api/customers"}
                                  fetchData={fetchData}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center">
                            <div className="alert alert-danger mb-0">
                              Data Belum Tersedia
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <PaginationComponent
                    total={pagination.total}
                    perPage={pagination.perPage}
                    currentPage={pagination.currentPage}
                    onChange={(pageNumber) => fetchData(pageNumber, keywords)}
                    position="end"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
