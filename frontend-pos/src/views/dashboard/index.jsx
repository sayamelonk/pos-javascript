// import useState and useEffect
import { useState, useEffect } from "react";

// import layout admin
import LayoutAdmin from "../../layouts/admin";

// import service api
import Api from "../../services/api";

// import js cookie
import Cookies from "js-cookie";

// import moneyFormat
import moneyFormat from "../../utils/moneyFormat";

// import chart apex
import ApexCharts from "apexcharts";

// import generateRandomColors
import generateRandomColors from "../../utils/generateRandomColors";

export default function Dashboard() {
  // state sales
  const [countSalesToday, setCountSalesToday] = useState(0);
  const [sumSalesToday, setSumSalesToday] = useState(0);
  const [sumSalesWeek, setSumSalesWeek] = useState(0);
  const [salesDate, setSalesDate] = useState([]);
  const [salesTotal, setSalesTotal] = useState([]);

  // state profits
  const [sumProfitsToday, setSumProfitsToday] = useState(0);
  const [sumProfitsWeek, setSumProfitsWeek] = useState(0);
  const [profitsDate, setProfitsDate] = useState([]);
  const [profitsTotal, setProfitsTotal] = useState([]);

  // state productsBestSelling
  const [productsBestSelling, setProductsBestSelling] = useState([]);

  // state productsLimitStock
  const [productsLimitStock, setProductsLimitStock] = useState([]);

  // function fetch data dashboard
  const fetchData = async () => {
    // get token from cookies
    const token = Cookies.get("token");

    if (token) {
      // set authorization header with token
      Api.defaults.headers.common["Authorization"] = token;

      try {
        // fetch data from API with Axios
        const response = await Api.get("/api/dashboard");

        // assign response data to state "countSalesToday", "sumSalesToday", "sumSalesWeek", "salesDate", "salesTotal"
        setCountSalesToday(response.data.data.count_sales_today);
        setSumSalesToday(response.data.data.sum_sales_today);
        setSumSalesWeek(response.data.data.sum_sales_week);
        setSalesDate(response.data.data.sales.sales_date);
        setSalesTotal(response.data.data.sales.sales_total);

        //assign response data to state "sumProfitsToday", "sumProfitsWeek", "profitsDate", "profitsTotal"
        setSumProfitsToday(response.data.data.sum_profits_today);
        setSumProfitsWeek(response.data.data.sum_profits_week);
        setProfitsDate(response.data.data.profits.profits_date);
        setProfitsTotal(response.data.data.profits.profits_total);

        // assign response data to state "productsBestSelling"
        setProductsBestSelling(response.data.data.best_selling_products);

        // assign response data to state "productsLimitStock"
        setProductsLimitStock(response.data.data.products_limit_stock);
      } catch (error) {
        console.error("there was an error fetching the data!", error);
      }
    } else {
      console.error("Token is not available");
    }
  };

  // hook useEffect
  useEffect(() => {
    // call function "fetchData"
    fetchData();
  }, []);

  // function to initialize a chart
  const initializeChart = (elementId, chartOptions) => {
    const chart = new ApexCharts(
      document.getElementById(elementId),
      chartOptions
    );
    chart.render();

    return chart;
  };

  // common chart options
  const commonChartOptions = {
    fontFamily: "inherit",
    animations: { enabled: false },
    dataLabels: { enabled: false },
    grid: { strokeDashArray: 4 },
    tooltip: { theme: "dark" },
    xaxis: {
      labels: { padding: 0 },
      tooltip: { enabled: false },
      axisBorder: { show: false },
      type: "datetime",
    },
    yaxis: { labels: { padding: 4 } },
    colors: ["#206bc4"], // set the color according to your theme
    legend: { show: false },
  };

  // effect to initialize charts when data changes
  useEffect(() => {
    const salesChart = initializeChart("chart-sales", {
      ...commonChartOptions,
      chart: { type: "area", height: 40, sparkline: { enabled: true } },
      fill: { opacity: 0.16, type: "solid" },
      stroke: { width: 2, lineCap: "round", curve: "smooth" },
      series: [
        {
          name: "Sales",
          data: salesTotal,
        },
      ],
      labels: salesDate,
    });

    const profitsChart = initializeChart("chart-profits", {
      ...commonChartOptions,
      chart: { type: "bar", height: 40, sparkline: { enabled: true } },
      plotOptions: { bar: { columnWidth: "50%" } },
      series: [
        {
          name: "Profits",
          data: profitsTotal,
        },
      ],
      labels: profitsDate,
    });

    // transform data
    const series = productsBestSelling.map((product) => product.total);
    const labels = productsBestSelling.map((product) => product.title);

    const bestProductsChart = initializeChart("chart-best-products", {
      chart: {
        type: "donut",
        height: 350, // adjust the height as needed
      },
      series: series,
      labels: labels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      colors: generateRandomColors(productsBestSelling.length), // customize colors as needed
      legend: {
        position: "bottom",
      },
      tooltip: {
        y: {
          formatter: (val) => `${val}`,
        },
      },
    });

    // cleaanup charts on component unmount
    return () => {
      salesChart.destroy();
      profitsChart.destroy();
      bestProductsChart.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesDate, salesTotal, profitsDate, profitsTotal, productsBestSelling]);

  return (
    <LayoutAdmin>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">HALAMAN</div>
              <h2 className="page-title">DASHBOARD</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="row row-deck row-cards">
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded card-link card-link-pop">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Sales Today</div>
                  </div>
                  <div className="h1 mb-2">{countSalesToday}</div>
                  <hr className="mb-2 mt-1" />
                  <div className="h1 mb-0 me-2">
                    {moneyFormat(sumSalesToday)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded card-link card-link-pop">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Profits Today</div>
                  </div>
                  <div className="h1 mb-0 m-2 mt-4">
                    {moneyFormat(sumProfitsToday)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded card-link card-link-pop">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">SALES</div>
                    <div className="ms-auto lh-1">
                      <span className="text-end active" href="#">
                        Last 7 days
                      </span>
                    </div>
                  </div>
                  <div className="d-flex align-items-baseline">
                    <div className="h1 mb-0 me-2">
                      {moneyFormat(sumSalesWeek)}
                    </div>
                  </div>
                </div>
                <div id="chart-sales" className="chart-sm"></div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card rounded card-link card-link-pop">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">PROFITS</div>
                    <div className="ms-auto lh-1">
                      <span className="text-end active" href="#">
                        Last 7 days
                      </span>
                    </div>
                  </div>
                  <div className="d-flex align-items-baseline">
                    <div className="h1 mb-3 me-2">
                      {moneyFormat(sumProfitsWeek)}
                    </div>
                  </div>
                  <div id="chart-profits" className="chart-sm"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-8">
              <div className="card rounded">
                <div className="card-header p-3">
                  <h3 className="mb-0 text-uppercase">Best Selling Product</h3>
                </div>
                <div className="card-body">
                  <div id="chart-best-products"></div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card rounded">
                <div className="card-header p-3">
                  <h3 className="mb-0 text-uppercase">Products Limit Stock</h3>
                </div>
                <div className="card-body scrollable-card-body">
                  <div className="row">
                    {productsLimitStock.map((product) => (
                      <div className="col-12 mb-2" key={product.id}>
                        <div className="card rounded">
                          <div className="card-body d-flex align-items-center">
                            <img
                              src={`${import.meta.env.VITE_APP_BASEURL}/${
                                product.image
                              }`}
                              alt={product.title}
                              width={50}
                              height={50}
                              className="me-3"
                            />
                            <div className="flex-fill">
                              <h4 className="mb-0">{product.title}</h4>
                              <hr className="mb-1 mt-1" />
                              <p className="text-danger mb-0">
                                Stock: {product.stock}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
