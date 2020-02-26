import React, { Component } from "react";
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { reportTypeEnum } from "../../common/enums";
import ReportFilter from "./report-filter";
import { TODAY_DATE } from "../../common/constants";
import IpdInvoice from "../ipd/ipd-invoice";

export default class MonthlyIpdReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportType: reportTypeEnum.MONTHLY.value,
      ipds: [],
      loading: true,
      filterString: "",
      dateSelection: TODAY_DATE,
      dateRangeSelection: [TODAY_DATE],
      monthSelection: TODAY_DATE,
      sortString: "dischargeDate asc",
      controller: "ipds",
      includeProperties: "Patient.Address,Charges.ChargeDetail"
    };
    this.repository = new repository();
    this.helper = new helper();
  }
  getIpds = () => {
    const {
      first,
      rows,
      filterString,
      sortString,
      includeProperties,
      controller
    } = this.state;
    this.repository
      .get(
        controller,
        `filter=${filterString}&sort=${sortString}&includeProperties=${includeProperties}`
      )
      .then(res => {
        res &&
          res.data.map(item => {
            item.formatedAddmissionDate = this.helper.formatDate(
              item.addmissionDate
            );
            item.formatedDischargeDate = this.helper.formatDate(
              item.dischargeDate
            );
            item.fullname = item.patient.fullname;
            item.address = item.patient.address && item.patient.address.name;
            return item;
          });
        this.setState({
          first: first,
          rows: rows,
          totalRecords: res && res.totalCount,
          ipds: res && res.data,
          loading: false
        });
      });
  };
  componentDidMount = e => {
    const month = this.helper.getMonthFromDate(TODAY_DATE);
    const year = this.helper.getYearFromDate(TODAY_DATE);
    const filter = `DischargeDate.Month-eq-{${month}} and DischargeDate.Year-eq-{${year}}`;
    this.setState({ filterString: filter }, () => {
      this.getIpds();
    });
  };
  onDateSelection = e => {
    const { reportType } = this.state;
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value
    });
    let filter = "";
    if (reportType === reportTypeEnum.DAILY.value) {
      let date = this.helper.formatDate(value, "en-US");
      filter = `DischargeDate-eq-{${date}}`;
    } else if (reportType === reportTypeEnum.DATERANGE.value) {
      let startDate = this.helper.formatDate(value[0], "en-US");
      let endDate = this.helper.formatDate(value[1], "en-US");
      filter = `DischargeDate-gte-{${startDate}} and DischargeDate-lte-{${endDate}}`;
    } else if (reportType === reportTypeEnum.MONTHLY.value) {
      let month = this.helper.getMonthFromDate(value);
      let year = this.helper.getYearFromDate(value);
      filter = `DischargeDate.Month-eq-{${month}} and DischargeDate.Year-eq-{${year}}`;
    }
    this.setState({ filterString: filter }, () => {
      this.getIpds();
    });
  };
  render() {
    const { ipds } = this.state;
    return (
      <>
        <div className="card">
          <div className="card-body">
            <ReportFilter
              {...this.state}
              onDateSelection={this.onDateSelection}
              onReportTypeChange={e => this.setState({ reportType: e.value })}
              data={ipds}
              showSummary={false}
              printRef={this.printRef}
            />
            <hr />
            <div id="print-div" ref={el => (this.printRef = el)}>
              <div className="row invoice">
                {ipds &&
                  ipds.map((items, i) => {
                    return (
                      <div
                        className={`col-md-6 ${
                          i % 2 === 0 ? "vertical-devider" : ""
                        }`}
                        key={i}
                      >
                        <IpdInvoice
                          InvoiceData={items}
                          index={i % 2 === 0 ? "odd" : "even"}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
