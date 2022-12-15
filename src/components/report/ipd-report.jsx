import React, { Component } from "react";
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { lookupTypeEnum, reportTypeEnum } from "../../common/enums";
import _ from "lodash";
import ReportFilter from "./report-filter";
import { TODAY_DATE } from "../../common/constants";
import { TabView, TabPanel } from "primereact/tabview";
import { roleEnum } from "../../common/enums";
import jwt_decode from "jwt-decode";

let chargeTotal = 0;
export default class IpdReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportType: reportTypeEnum.DAILY.value,
      ipds: [],
      loading: true,
      filterString: "",
      dateSelection: TODAY_DATE,
      dateRangeSelection: [TODAY_DATE],
      monthSelection: TODAY_DATE,
      sortString: "dischargeDate asc",
      controller: "ipds",
      includeProperties: "Patient,Charges.ChargeDetail",
      config: { responseType: "blob" },
    };
    this.repository = new repository();
    this.helper = new helper();
  }
  getIpds = () => {
    this.setState({ loading: true });
    const {
      first,
      rows,
      filterString,
      sortString,
      includeProperties,
      controller,
    } = this.state;
    this.repository
      .get(
        controller,
        `filter=${filterString}&sort=${sortString}&includeProperties=${includeProperties}`
      )
      .then((res) => {
        this.getCharges();
        res &&
          res.data.map((item) => {
            item.formatedAddmissionDate = this.helper.formatDate(
              item.addmissionDate
            );
            item.formatedDischargeDate = this.helper.formatDate(
              item.dischargeDate
            );
            item.fullname = item.patient.fullname;
            return item;
          });
        this.setState({
          first: first,
          rows: rows,
          totalRecords: res && res.totalCount,
          ipds: res && res.data,
          loading: false,
        });
      });
  };
  getCharges = () => {
    this.repository
      .get(
        "lookups",
        `filter=type-eq-{${lookupTypeEnum.CHARGENAME.code}} and isDeleted-neq-{true}`
      )
      .then((res) => {
        let charges = res && res.data;
        charges &&
          this.setState({
            chargeNames: charges,
            chargesLength: charges.length,
          });
      });
  };
  componentDidMount = (e) => {
    const date = this.helper.formatDate(TODAY_DATE, "en-US");
    const title = this.helper.formatDate(TODAY_DATE);
    const filter = `DischargeDate-eq-{${date}} and isDeleted-neq-{true}`;
    this.setState({ filterString: filter, reportTitle: title }, () => {
      this.getIpds();
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
      filter = `DischargeDate-eq-{${date}} and isDeleted-neq-{true}`;
      title = dateTitle;
    } else if (reportType === reportTypeEnum.DATERANGE.value) {
      let startDate = this.helper.formatDate(value[0], "en-US");
      let endDate = this.helper.formatDate(value[1], "en-US");
      let startDateTitle = this.helper.formatDate(value[0]);
      let endDateTitle = this.helper.formatDate(value[1]);
      filter = `DischargeDate-gte-{${startDate}} and DischargeDate-lte-{${endDate}} and isDeleted-neq-{true}`;
      title = `${startDateTitle} - ${endDateTitle}`;
    } else if (reportType === reportTypeEnum.MONTHLY.value) {
      let month = this.helper.getMonthFromDate(value);
      let year = this.helper.getYearFromDate(value);
      filter = `DischargeDate.Month-eq-{${month}} and DischargeDate.Year-eq-{${year}} and isDeleted-neq-{true}`;
      title = `${month}/${year}`;
    }
    this.setState({ filterString: filter, reportTitle: title }, () => {
      this.getIpds();
    });
  };
  exportReport = () => {
    const { controller, reportTitle, ipds, config } = this.state;
    this.repository
      .post(`${controller}/ExportReport`, ipds, config)
      .then((res) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute(
          "download",
          `Ipd Report ${reportTitle.split("/").join("-")}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  };
  render() {
    const token = localStorage.getItem("aastha-auth-token");
    if (token != null && token.length > 0) {
      var decoded_token = jwt_decode(token);
      var role = Number(decoded_token.Role);
    }
    const {
      ipds,
      chargesLength,
      chargeNames,
      reportTitle,
      activeIndex,
      loading,
    } = this.state;
    let ipdData;
    let chargesColumns;
    let amount = 0;
    if (chargeNames) {
      let mapWithCharge = ipds.map((item) => {
        let chargeName;
        _.reduce(
          chargeNames,
          function (hash, key) {
            chargeName = `${key.name.substring(0, 4)}Charge`;
            let obj =
              item.charges &&
              item.charges.filter((item) => item.lookupId === key.id)[0];
            amount = obj && obj.amount;
            hash[chargeName] = amount ? Number(amount) : 0;
            hash.amount = _.sumBy(item.charges, (x) => x.amount);
            return hash;
          },
          item
        );
        return item;
      });
      let ipdGroupByDate = _.groupBy(mapWithCharge, "formatedDischargeDate");
      ipdData = _.map(ipdGroupByDate, (items, key) => {
        let result = {};
        let chargeName;
        result.dischargeDate = key;
        result.data = items;
        result.count = items.length;
        _.reduce(
          chargeNames,
          function (hash, key) {
            chargeName = `${key.name.substring(0, 4)}Charge`;
            result[`${chargeName}`] = items.reduce(
              (total, item) => total + Number(item[chargeName]),
              0
            );
            result.total = items.reduce(
              (total, item) => total + Number(item.amount),
              0
            );
            return hash;
          },
          items
        );
        return result;
      });
      chargesColumns =
        ipdData[0] &&
        Object.keys(ipdData[0].data[0]).filter((m) => m.includes("Charge"));
    }
    let ipdCount =
      ipdData && ipdData.reduce((total, item) => total + Number(item.count), 0);
    let amountTotal =
      ipdData && ipdData.reduce((total, item) => total + Number(item.total), 0);
    return (
      <>
        <div className="card">
          <div className="card-body">
            {role === roleEnum["ADMIN"].value && (
              <>
                <ReportFilter
                  {...this.state}
                  onDateSelection={this.onDateSelection}
                  onReportTypeChange={(e) =>
                    this.setState({ reportType: e.value })
                  }
                  onShowSummary={(e) => this.op.toggle(e)}
                  data={ipdData}
                  exportReport={this.exportReport}
                  activeIndex={activeIndex}
                  loading={loading}
                />
                <hr />
              </>
            )}
            <TabView
              activeIndex={this.state.activeIndex}
              onTabChange={(e) => this.setState({ activeIndex: e.index })}
            >
              <TabPanel header="Report">
                <div id="print-div">
                  <h3 className="report-header">Ipd Report {reportTitle}</h3>
                  <table className="table table-bordered report-table table-sm">
                    <thead>
                      <tr>
                        <th style={{ width: "10px" }}>Id</th>
                        <th>Patient's Name</th>
                        <th>Ipd Type</th>
                        <th>Adm. Date</th>
                        {chargesColumns &&
                          chargesColumns.map((key, i) => {
                            return (
                              <th key={i} className="text-right">
                                {key.substring(0, 3)}.
                              </th>
                            );
                          })}
                        <th className="text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ipdData &&
                        ipdData.map((items, key) => {
                          return (
                            <React.Fragment key={`fragement${key}`}>
                              <tr className="report-group-title">
                                <td colSpan="5" className="text-center">
                                  Discharge & Billing Date:{" "}
                                  {items.dischargeDate}
                                </td>
                                <td
                                  colSpan={chargesLength}
                                  className="text-center"
                                >
                                  {items.count} Patients
                                </td>
                              </tr>
                              {items.data.map((subitem) => {
                                return (
                                  <tr key={`subitem${subitem.id}`}>
                                    <td>{subitem.uniqueId}</td>
                                    <td>{subitem.fullname}</td>
                                    <td>{subitem.ipdType}</td>
                                    <td>{subitem.formatedAddmissionDate}</td>
                                    {chargesColumns.map((key, i) => {
                                      return (
                                        <td key={i} className="text-right">
                                          {subitem[key]}
                                        </td>
                                      );
                                    })}
                                    <td className="text-right">
                                      {subitem.amount}
                                    </td>
                                  </tr>
                                );
                              })}
                              <tr className="report-group-title">
                                <td colSpan="3"></td>
                                <td className="text-right">Total</td>
                                {chargesColumns.map((key, i) => {
                                  return (
                                    <td key={i} className="text-right">
                                      {items[`${key}`]}
                                    </td>
                                  );
                                })}
                                <td className="text-right">{items.total}</td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                    </tbody>
                    <tfoot>
                      {ipdData && ipdData.length ? (
                        <tr className="report-footer">
                          <td colSpan="2">{ipdCount} Patients</td>
                          <td colSpan="2" className="text-right">
                            Grand Total
                          </td>
                          {chargesColumns.map((key, i) => {
                            chargeTotal =
                              ipdData &&
                              ipdData.reduce(
                                (total, item) => total + Number(item[key]),
                                0
                              );
                            return (
                              <td key={i} className="text-right">
                                {chargeTotal}
                              </td>
                            );
                          })}
                          <td className="text-right">{amountTotal}</td>
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
                <div ref={(el) => (this.printSummaryRef = el)} id="print-div">
                  <h3 className="report-header">
                    Ipd Report Summary{reportTitle}
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
                      {ipdData &&
                        ipdData.map((items, index) => {
                          return (
                            <tr key={`summaryRow${index}`}>
                              <td>{items.dischargeDate}</td>
                              <td className="text-right">{items.count}</td>
                              <td className="text-right">
                                {this.helper.formatCurrency(items.total)}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                    <tfoot className="report-footer">
                      {ipdData && ipdData.length ? (
                        <tr className="report-group-title">
                          <td>Grand Total</td>
                          <td className="text-right">{ipdCount}</td>
                          <td className="text-right">
                            {this.helper.formatCurrency(amountTotal)}
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
