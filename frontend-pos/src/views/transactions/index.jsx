// import useState, useEffect and useRef
import { useEffect, useState, useRef } from "react";

// import product list
import ProductList from "../../components/ProductList";

//import layout admin
import LayoutAdmin from "../../layouts/admin";

// import js cookie
import Cookies from "js-cookie";

// import service api
import Api from "../../services/api";

// import component pagination
import PaginationComponent from "../../components/Pagination";

// import category list
import CategoryList from "../../components/CategoryList";

// import moneyFormat
import moneyFormat from "../../utils/moneyFormat";

// import OrderItemList
import OrderItemList from "../../components/OrderItemList";

// import payment
import Payment from "../../components/Payment";

export default function TransactionsIndex() {
  // state products
  const [products, setProducts] = useState([]);

  // define state "pagination"
  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 0,
    currentPage: 1,
  });

  // state barcode
  const [barcode, setBarcode] = useState("");

  // ref search
  const searchInputRef = useRef(null);

  // state categories
  const [categories, setCategories] = useState([]);

  // state current category id
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  // state carts
  const [carts, setCarts] = useState([]);
  const [totalCarts, setTotalCarts] = useState(0);

  // token
  const token = Cookies.get("token");

  // function "fetchProducts"
  const fetchProducts = async (pageNumber) => {
    if (token) {
      // define variable "page"
      const page = pageNumber ? pageNumber : pagination.currentPage;

      // set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      await Api.get(`/api/products?page=${page}&limit=9`).then((response) => {
        // set data reseponse to state "products"
        setProducts(response.data.data);

        // set data response to state "pagination"
        setPagination({
          total: response.data.pagination.total,
          perPage: response.data.pagination.perPage,
          currentPage: response.data.pagination.currentPage,
        });
      });
    }
  };

  // function "fetchProductByBarcode"
  const fetchProductByBarcode = async (barcode) => {
    if (token) {
      // set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;
      await Api.post("/api/products-by-barcode", { barcode: barcode }).then(
        (response) => {
          // set data response to state "product"
          setProducts(response.data.data);
        }
      );
    }
  };

  // function searchHandler
  const searchHandler = (e) => {
    // set state "barcode"
    setBarcode(e.target.value);

    // call function "fetchProductByBarcode"
    fetchProductByBarcode(e.target.value);
  };

  // function "fetchCategories"
  const fetchCategories = async () => {
    if (token) {
      // set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;
      await Api.get("/api/categories-all").then((response) => {
        // set data reseponse to state "categories"
        setCategories(response.data.data);
      });
    }
  };

  // function fetchProductByCategoryId
  const fetchProductByCategoryId = async (categoryId, pageNumber) => {
    if (token) {
      // define variable "page"
      const page = pageNumber ? pageNumber : pagination.currentPage;

      // set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;
      await Api.get(
        `/api/products-by-category/${categoryId}?page=${page}&limit=9`
      ).then((response) => {
        // set data reseponse to state "products"
        setProducts(response.data.data);

        // set data response to state "pagination"
        setPagination({
          total: response.data.pagination.total,
          perPage: response.data.pagination.perPage,
          currentPage: response.data.pagination.currentPage,
        });
      });
    }
  };

  // function "fetchCarts"
  const fetchCarts = async () => {
    if (token) {
      // set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;
      await Api.get("/api/carts").then((response) => {
        // set data reseponse to state "carts"
        setCarts(response.data.data);
        // set total carts
        setTotalCarts(response.data.totalPrice);
      });
    }
  };

  // hook
  useEffect(() => {
    // call function "fetchProducts"
    fetchProducts();

    // check if searchInputRef is define
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    // call function "fetchCategories"
    fetchCategories();

    // call function "fetchCarts"
    fetchCarts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LayoutAdmin>
      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            <div className="col-md-8 mb-3">
              {/* Search and Scan Barcode */}
              <form onSubmit={searchHandler} autoComplete="off" noValidate>
                <div className="input-icon">
                  <span className="input-icon-addon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                      width={20}
                      height={20}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Scan Barcode"
                    value={barcode}
                    onChange={(e) => searchHandler(e)}
                    ref={searchInputRef}
                  />
                </div>
              </form>

              {/* Category List */}
              <CategoryList
                categories={categories}
                fetchProducts={fetchProducts}
                setCurrentCategoryId={setCurrentCategoryId}
                fetchProductByCategoryId={fetchProductByCategoryId}
              />

              {/* Product List */}
              <ProductList products={products} fetchCarts={fetchCarts} carts={carts} />

              {/* Pagination */}
              <div className="row mt-3">
                <PaginationComponent
                  total={pagination.total}
                  perPage={pagination.perPage}
                  currentPage={pagination.currentPage}
                  onChange={(pageNumber) => {
                    if (currentCategoryId) {
                      fetchProductByCategoryId(currentCategoryId, pageNumber);
                    } else {
                      fetchProducts(pageNumber);
                    }
                  }}
                  position="center"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="card rounded">
                <div className="card-header p-3">
                  <h3 className="mb-0">ORDER ITEMS</h3>
                </div>
                <div className="card-body scrollable-card-body p-0">
                  {/* Order Items List */}
                  <OrderItemList carts={carts} fetchCarts={fetchCarts} />
                </div>
                <div className="card-body">
                  <div className="mt-3">
                    <h3 className="float-end">{moneyFormat(totalCarts)}</h3>
                    <h3 className="mb-0">Total ({carts.length} Items)</h3>
                  </div>
                  <hr />
                  <Payment totalCarts={totalCarts} fetchCarts={fetchCarts} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
