// import useState and useEffect
import { useState, useEffect } from "react";

// import css
import "./Styles.css";

// import js cookie
import Cookies from "js-cookie";

// import service api
import Api from "../../../services/api";

// import moneyFormat
import moneyFormat from "../../../utils/moneyFormat";

// format date function
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Print = () => {
  // get params
  const params = new URLSearchParams(window.location.search);
  const invoice = params.get("invoice");

  // set state
  const [transaction, setTransaction] = useState({});
  const [transactionDetails, setTransactionDetails] = useState([]);

  // token
  const token = Cookies.get("token");

  // fetch transaction
  const fetchTransaction = async () => {
    if (token) {
      Api.defaults.headers.common["Authorization"] = token;
      await Api.get(`/api/transactions?invoice=${invoice}`).then((response) => {
        setTransaction(response.data.data);
        setTransactionDetails(response.data.data.transaction_details);
      });
    }
  };

  useEffect(() => {
    fetchTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="content">
        <div className="title" style={{ paddingBottom: "15px" }}>
          <div
            style={{
              textAlign: "center",
              textTransform: "uppercase",
              fontSize: "15px",
              marginBottom: "8px",
            }}
          >
            IRA JAYA CODING
          </div>
          <div style={{ textAlign: "center", marginBottom: "5px" }}>
            Alamat: Kp. Ketangga RT. 06, Kec. Masbagik, Kab. Lombok Timur
          </div>
          <div style={{ textAlign: "center" }}>Telp: +62 859-4353-7210</div>
        </div>

        <div
          className="separate-line"
          style={{
            borderTop: "1px dashed #000",
            height: "1px",
            marginBottom: "10px",
          }}
        ></div>

        <table
          className="transaction-table"
          cellSpacing="0"
          cellPadding="0"
          style={{ marginBottom: "10px" }}
        >
          <tbody>
            <tr>
              <td>TANGGAL</td>
              <td>:</td>
              <td style={{ paddingLeft: "5px" }}>
                {formatDate(transaction?.created_at)}
              </td>
            </tr>
            <tr>
              <td>FAKTUR</td>
              <td>:</td>
              <td style={{ paddingLeft: "5px" }}>{transaction?.invoice}</td>
            </tr>
            <tr>
              <td>KASIR</td>
              <td>:</td>
              <td style={{ paddingLeft: "5px" }}>
                {transaction?.cashier?.name ?? ""}
              </td>
            </tr>
            <tr>
              <td>PEMBELI</td>
              <td>:</td>
              <td style={{ paddingLeft: "5px" }}>
                {transaction?.customer?.name ?? "Umum"}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="transaction" style={{ marginBottom: "15px" }}>
          <table className="transaction-table" cellSpacing="0" cellPadding="0">
            <tbody>
              <tr className="price-tr">
                <td colSpan="3">
                  <div
                    className="separate-line"
                    style={{ borderTop: "1px dashed #000" }}
                  ></div>
                </td>
              </tr>
              <tr>
                <td style={{ textAlign: "left" }}>PRODUK</td>
                <td style={{ textAlign: "center" }}>QTY</td>
                <td style={{ textAlign: "right" }} colSpan="5">
                  HARGA
                </td>
              </tr>
              <tr className="price-tr">
                <td colSpan="3">
                  <div
                    className="separate-line"
                    style={{ borderTop: "1px dashed #000" }}
                  ></div>
                </td>
              </tr>
              {transactionDetails?.map((item, index) => (
                <tr key={index}>
                  <td className="name">{item.product.title}</td>
                  <td className="qty" style={{ textAlign: "center" }}>
                    {item.qty}
                  </td>
                  <td
                    className="final-price"
                    style={{ textAlign: "right" }}
                    colSpan="5"
                  >
                    {moneyFormat(item.price)}
                  </td>
                </tr>
              ))}
              <tr className="price-tr">
                <td colSpan="3">
                  <div className="separate-line"></div>
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="final-price">
                  SUB TOTAL
                </td>
                <td colSpan="3" className="final-price">
                  :
                </td>
                <td className="final-price">
                  {moneyFormat(transaction?.grand_total)}
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="final-price">
                  DISKON
                </td>
                <td colSpan="3" className="final-price">
                  :
                </td>
                <td className="final-price">
                  {moneyFormat(transaction?.discount)}
                </td>
              </tr>

              <tr className="discount-tr">
                <td colSpan="3">
                  <div className="separate-line"></div>
                </td>
              </tr>

              <tr>
                <td colSpan="3" className="final-price">
                  TUNAI
                </td>
                <td colSpan="3" className="final-price">
                  :
                </td>
                <td className="final-price">
                  {moneyFormat(transaction?.cash)}
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="final-price">
                  KEMBALI
                </td>
                <td colSpan="3" className="final-price">
                  :
                </td>
                <td className="final-price">
                  {moneyFormat(transaction?.change)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="thanks" style={{ marginBottom: "8px" }}>
          =====================================
        </div>
        <div className="azost" style={{ marginTop: "8px" }}>
          TERIMA KASIH
          <br />
          ATAS KUNJUNGAN ANDA
        </div>
      </div>
    </>
  );
};
export default Print;
