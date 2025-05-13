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

// import moneyFormat
import moneyFormat from "../../utils/moneyFormat";

// import component barcode
import Barcode from "../../components/Barcode";

// import create product
import ProductCreate from "./create";

// import edit product
import ProductEdit from "./edit";

// import delete button
import DeleteButton from "../../components/DeleteButton";

export default function ProductsIndex() {
  // state products
  const [products, setProducts] = useState([]);

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
          `/api/products?page=${page}&search=${keywords}`
        );

        // assign response data to state "products"
        setProducts(response.data.data);

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
              <h2 className="page-title">PRODUCTS</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            <div className="col-12 mb-3">
              <div className="input-group">
                <ProductCreate fetchData={fetchData} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="search by product name"
                  value={keywords}
                  onChange={(e) => setkeywords(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={searchHandler}
                  className="btn btn-primary btn-md"
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
                        <th style={{ width: "5px" }}>Barcode</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Buy Price</th>
                        <th>Sell Price</th>
                        <th>Stock</th>
                        <th className="w-1">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length > 0 ? (
                        products.map((product, index) => (
                          <tr key={index}>
                            <td data-label="Barcode">
                              <Barcode
                                value={product.barcode}
                                // format={"CODE39"}
                                format={"CODE128"}
                                lineColor={"#000"}
                                width={1}
                                height={20}
                                fontSize={10}
                              />
                            </td>
                            <td data-label="Category Name">
                              <div className="d-flex py-1 align-items-center">
                                <span
                                  className="avatar me-2"
                                  style={{
                                    backgroundImage: `url(${
                                      import.meta.env.VITE_APP_BASEURL
                                    }/${product.image})`,
                                  }}
                                ></span>
                                <div className="flex-fill">
                                  <div className="font-weight-medium">
                                    {product.title}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="text-muted" data-label="Category">
                              {product.category.name}
                            </td>
                            <td data-label="Buy Price">
                              {moneyFormat(product.buy_price)}
                            </td>
                            <td data-label="Sell Price">
                              {moneyFormat(product.sell_price)}
                            </td>
                            <td data-label="Stock">{product.stock}</td>
                            <td>
                              <div className="btn-list flex-col justify-content-center">
                                <ProductEdit
                                  productId={product.id}
                                  fetchData={fetchData}
                                />
                                <DeleteButton
                                  id={product.id}
                                  endpoint="/api/products"
                                  fetchData={fetchData}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center">
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
