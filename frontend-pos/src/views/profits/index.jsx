// import layout admin
import LayoutAdmin from "../../layouts/admin";

// import js cookie
import Cookies from "js-cookie";

// import service api
import Api from "../../services/api";

// import useState
import { useState } from "react";

// import moneyFormat
import moneyFormat from "../../utils/moneyFormat";

// import formatDate
import formatDate from "../../utils/formatDate";

// import export button
import ExportButton from "../../components/ExportButton";

export default function Profits() {
  // state date
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // state profits
  const [profits, setProfits] = useState([]);
  const [profitsTotal, setProfitsTotal] = useState(0);

  // token
  const token = Cookies.get("token");

  // function filter data profits
  const filterprofits = async (e) => {
    e.preventDefault();
    if (token) {
      // set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;
      try {
        // fetch data from API with Axios
        const response = await Api.get(
          `/api/profits?start_date=${startDate}&end_date=${endDate}`
        );
        console.log(response.data.data);
        // assign response data to state "profits"
        setProfits(response.data.data.profits);
        setProfitsTotal(response.data.data.total);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    } else {
      console.error("Token is not available!");
    }
  };

  return (
    <LayoutAdmin>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">HALAMAN</div>
              <h2 className="page-title">REPORT PROFITS</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={filterprofits}>
                    <div className="row">
                      <div className="col-md-5">
                        <div className="mb-3">
                          <label className="form-label fw-bold fw-bold">
                            START DATE
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="mb-3">
                          <label className="form-label fw-bold fw-bold">
                            END DATE
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="mb-3">
                          <label>&nbsp;</label>
                          <button
                            type="submit"
                            className="btn btn-primary btn-md border-0 shadow w-100 rounded"
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
                                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                              />
                            </svg>
                            <span className="ps-1">FILTER</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  {profits.length > 0 ? (
                    <>
                      <table className="table table-bordered table-hover">
                        <thead>
                          <tr style={{ backgroundClip: "#e6e6e7" }}>
                            <th scope="col">Date</th>
                            <th scope="col">Invoice</th>
                            <th scope="col">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {profits.map((profits, index) => (
                            <tr key={index}>
                              <td>{formatDate(profits.created_at)}</td>
                              <td>{profits.transaction.invoice}</td>
                              <td className="text-end">
                                {moneyFormat(profits.total)}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={2} className="text-end fw-bold">
                              Total
                            </td>
                            <td className="text-end fw-bold">
                              {moneyFormat(profitsTotal)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="export text-end mb-3 mt-3">
                        <ExportButton
                          startDate={startDate}
                          endDate={endDate}
                          type={"profits"}
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
