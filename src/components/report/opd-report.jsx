import React, { Component } from "react";
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { paymentModeEnum, reportTypeEnum } from "../../common/enums";
import { TabView, TabPanel } from "primereact/tabview";
import _ from "lodash";
import ReportFilter from "./report-filter";
import { TODAY_DATE } from "../../common/constants";

export default class OpdReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportType: reportTypeEnum.DAILY.value,
      opds: [],
      loading: true,
      filterString: "",
      dateSelection: TODAY_DATE,
      dateRangeSelection: [TODAY_DATE],
      monthSelection: TODAY_DATE,
      sortString: "date asc",
      controller: "opds",
      includeProperties: "Patient,Payments",
      config: { responseType: "blob" },
      activeIndex: 0,
    };
    this.repository = new repository();
    this.helper = new helper();
  }
  getOpds = () => {
    this.setState({ loading: true });
    const { filterString, sortString, includeProperties, controller } =
      this.state;
    this.repository
      .get(
        controller,
        `filter=${filterString}&sort=${sortString}&includeProperties=${includeProperties}`
      )
      .then((res) => {
        res &&
          res.data.map((item) => {
            item.formatedOpdDate = this.helper.formatDate(item.date);
            item.fullname = item.patient.fullname;
            item.cashPayment = _.sumBy(
              item.payments.filter(
                (m) => m.paymentMode === paymentModeEnum.CASH.value
              ),
              (x) => x.amount
            );
            item.nonCashPayment = _.sumBy(
              item.payments.filter(
                (m) => m.paymentMode === paymentModeEnum.NONCASH.value
              ),
              (x) => x.amount
            );
            return item;
          });
        this.setState({
          opds: res && res.data,
          loading: false,
        });
      });
  };
  exportReport = () => {
    const { controller, reportTitle, opds, config } = this.state;
    this.repository
      .post(`${controller}/ExportReport`, opds, config)
      .then((res) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute(
          "download",
          `Opd Report ${reportTitle.split("/").join("-")}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  };
  componentDidMount = (e) => {
    const date = this.helper.formatDate(TODAY_DATE, "en-US");
    const title = this.helper.formatDate(TODAY_DATE);
    const filter = `Date-eq-{${date}} and isDeleted-neq-{true}`;
    this.setState({ filterString: filter, reportTitle: title }, () => {
      this.getOpds();
    });
  };
  onDateSelection = (e) => {
    const { reportType } = this.state;
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value,
    });
    let filter = "";
    let title = "";
    if (reportType === reportTypeEnum.DAILY.value) {
      let date = this.helper.formatDate(value, "en-US");
      let dateTitle = this.helper.formatDate(value);
      filter = `Date-eq-{${date}} and isDeleted-neq-{true}`;
      title = dateTitle;
    } else if (reportType === reportTypeEnum.DATERANGE.value) {
      let startDate = this.helper.formatDate(value[0], "en-US");
      let endDate = this.helper.formatDate(value[1], "en-US");
      let startDateTitle = this.helper.formatDate(value[0]);
      let endDateTitle = this.helper.formatDate(value[1]);
      filter = `Date-gte-{${startDate}} and Date-lte-{${endDate}} and isDeleted-neq-{true}`;
      title = `${startDateTitle} - ${endDateTitle}`;
    } else if (reportType === reportTypeEnum.MONTHLY.value) {
      let month = this.helper.getMonthFromDate(value);
      let year = this.helper.getYearFromDate(value);
      filter = `Date.Month-eq-{${month}} and Date.Year-eq-{${year}} and isDeleted-neq-{true}`;
      title = `${month}/${year}`;
    }
    this.setState({ filterString: filter, reportTitle: title }, () => {
      this.getOpds();
    });
  };
  render() {
    const { opds, reportTitle, activeIndex, loading } = this.state;
    let opdGroupByDate = _.groupBy(opds, "formatedOpdDate");
    let opdData = _.map(opdGroupByDate, (items, key) => {
      let result = {};
      result.opdDate = key;
      result.data = items;
      result.count = items.length;
      result.consultCharge = items.reduce(
        (total, item) => total + Number(item.consultCharge),
        0
      );
      result.usgCharge = items.reduce(
        (total, item) => total + Number(item.usgCharge),
        0
      );
      result.uptCharge = items.reduce(
        (total, item) => total + Number(item.uptCharge),
        0
      );
      result.injectionCharge = items.reduce(
        (total, item) => total + Number(item.injectionCharge),
        0
      );
      result.otherCharge = items.reduce(
        (total, item) => total + Number(item.otherCharge),
        0
      );
      result.totalCharge = items.reduce(
        (total, item) => total + Number(item.totalCharge),
        0
      );
      result.cashPayment = items.reduce(
        (total, item) => total + Number(item.cashPayment),
        0
      );
      result.nonCashPayment = items.reduce(
        (total, item) => total + Number(item.nonCashPayment),
        0
      );
      return result;
    });
    const opdCount = opdData.reduce(
      (total, item) => total + Number(item.count),
      0
    );
    const consultChargeTotal = opdData.reduce(
      (total, item) => total + Number(item.consultCharge),
      0
    );
    const usgChargeTotal = opdData.reduce(
      (total, item) => total + Number(item.usgCharge),
      0
    );
    const uptChargeTotal = opdData.reduce(
      (total, item) => total + Number(item.uptCharge),
      0
    );
    const injectionChargeTotal = opdData.reduce(
      (total, item) => total + Number(item.injectionCharge),
      0
    );
    const otherChargeTotal = opdData.reduce(
      (total, item) => total + Number(item.otherCharge),
      0
    );
    const amountChargeTotal = opdData.reduce(
      (total, item) => total + Number(item.totalCharge),
      0
    );
    const cashPaymentTotal = opdData.reduce(
      (total, item) => total + Number(item.cashPayment),
      0
    );
    const nonCashPaymentTotal = opdData.reduce(
      (total, item) => total + Number(item.nonCashPayment),
      0
    );
    return (
      <>
        <div className="card">
          <div className="card-body">
            <ReportFilter
              {...this.state}
              onDateSelection={this.onDateSelection}
              onReportTypeChange={(e) =>
                this.setState({ reportType: e.value }, () => this.getOpds())
              }
              data={opdData}
              exportReport={this.exportReport}
              loading={loading}
              visibleReportFilterButton={true}
            />
            <hr />
            <TabView
              activeIndex={activeIndex}
              onTabChange={(e) => this.setState({ activeIndex: e.index })}
            >
              <TabPanel header="Report">
                <div id="print-div">
                  <h3 className="report-header">Opd Report {reportTitle}</h3>
                  <table className="table table-bordered report-table table-sm">
                    <thead>
                      <tr>
                        <th>Invoice No</th>
                        <th>Opd Id</th>
                        <th>Patient's Name</th>
                        <th>Type</th>
                        <th className="text-right">Cons</th>
                        <th className="text-right">USG</th>
                        <th className="text-right">UPT</th>
                        <th className="text-right">Inj</th>
                        <th className="text-right">Other</th>
                        <th className="text-right">Total</th>
                        <th className="text-right">Cash</th>
                        <th className="text-right">Non-cash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {opdData.map((items, key) => {
                        return (
                          <React.Fragment key={`fragement${key}`}>
                            <tr className="report-group-title">
                              <td colSpan="4" className="text-center">
                                Date: {items.opdDate}
                              </td>
                              <td colSpan="8" className="text-center">
                                {items.count} Patients
                              </td>
                            </tr>
                            {items.data.map((subitem) => {
                              return (
                                <tr key={`subitem${subitem.id}`}>
                                  <td>{subitem.id}</td>
                                  <td>{subitem.invoiceNo}</td>
                                  <td>{subitem.fullname}</td>
                                  <td>{subitem.caseTypeName}</td>
                                  <td className="text-right">
                                    {subitem.consultCharge}
                                  </td>
                                  <td className="text-right">
                                    {subitem.usgCharge}{" "}
                                  </td>
                                  <td className="text-right">
                                    {subitem.uptCharge}
                                  </td>
                                  <td className="text-right">
                                    {subitem.injectionCharge}
                                  </td>
                                  <td className="text-right">
                                    {subitem.otherCharge}
                                  </td>
                                  <td className="text-right">
                                    {subitem.totalCharge}
                                  </td>
                                  <td className="text-right">
                                    {subitem.cashPayment}
                                  </td>
                                  <td className="text-right">
                                    {subitem.nonCashPayment}
                                  </td>
                                </tr>
                              );
                            })}
                            <tr className="report-group-title">
                              <td colSpan="3"></td>
                              <td className="text-right">Total</td>
                              <td className="text-right">
                                {items.consultCharge}
                              </td>
                              <td className="text-right">{items.usgCharge}</td>
                              <td className="text-right">{items.uptCharge}</td>
                              <td className="text-right">
                                {items.injectionCharge}
                              </td>
                              <td className="text-right">
                                {items.otherCharge}
                              </td>
                              <td className="text-right">
                                {items.totalCharge}
                              </td>
                              <td className="text-right">
                                {items.cashPayment}
                              </td>
                              <td className="text-right">
                                {items.nonCashPayment}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      {opdData && opdData.length ? (
                        <tr className="report-footer">
                          <td colSpan="3">{opdCount} Patients</td>
                          <td className="text-right">Grand Total</td>
                          <td className="text-right">{consultChargeTotal}</td>
                          <td className="text-right">{usgChargeTotal}</td>
                          <td className="text-right">{uptChargeTotal}</td>
                          <td className="text-right">{injectionChargeTotal}</td>
                          <td className="text-right">{otherChargeTotal}</td>
                          <td className="text-right">{amountChargeTotal}</td>
                          <td className="text-right">{cashPaymentTotal}</td>
                          <td className="text-right">{nonCashPaymentTotal}</td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-left">
                            No Record Found
                          </td>
                        </tr>
                      )}
                    </tfoot>
                  </table>
                </div>
              </TabPanel>
              <TabPanel header="Summary">
                <div id="print-div" className="A5">
                  <h3 className="report-header">
                    Opd Report Summary {reportTitle}
                  </h3>
                  <table className="table table-bordered report-table table-sm">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>No of Patients</th>
                        <th>Total Collection</th>
                      </tr>
                    </thead>
                    <tbody>
                      {opdData.map((items, index) => {
                        return (
                          <tr key={`summaryRow${index}`}>
                            <td>{items.opdDate}</td>
                            <td className="text-right">{items.count}</td>
                            <td className="text-right">
                              {this.helper.formatCurrency(items.totalCharge)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      {opdData && opdData.length ? (
                        <tr className="report-footer">
                          <td>Grand Total</td>
                          <td className="text-right">{opdCount}</td>
                          <td className="text-right">
                            {this.helper.formatCurrency(amountChargeTotal)}
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-left">
                            No Record Found
                          </td>
                        </tr>
                      )}
                    </tfoot>
                  </table>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </>
    );
  }
}
