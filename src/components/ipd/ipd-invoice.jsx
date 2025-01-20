import React, { Component } from "react";
import { helper } from "../../common/helpers";
import { repository } from "../../common/repository";
import numberToWords from "number-to-words";
import { lookupTypeEnum } from "../../common/enums";
import _ from "lodash";
import InvoiceHeader from "../shared/invoice-header";

export default class IpdInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = { showLogo: true };
    this.helper = new helper();
    this.repository = new repository();
  }
  bindLookups = (e) => {
    this.repository
      .get("lookups", `filter=type-neq-{0} and isDeleted-neq-${true}`)
      .then((res) => {
        let lookups =
          res &&
          res.data.map(function (item) {
            return { value: item.id, label: item.name, type: item.type };
          });
        if (res) {
          let chargeNames = lookups.filter(
            (l) => l.type === lookupTypeEnum.CHARGENAME.code
          );
          this.setState({
            chargeNames: chargeNames,
          });
        }
      });
  };
  componentDidMount() {
    const { removeLogoButton } = this.props;
    if (removeLogoButton === false) this.setState({ removeLogoButton: false });
    this.bindLookups();
  }
  render() {
    const { InvoiceData } = this.props;
    const { chargeNames } = this.state;
    const totalAmount = _.sumBy(InvoiceData.charges, (x) => x.amount);
    const payableAmount = totalAmount - InvoiceData.discount;
    const amountInWord = numberToWords.toWords(payableAmount).replace(/,/g, "");
    return (
      InvoiceData && (
        <div>
          <InvoiceHeader removeLogoButton={true} />
          <h3 className="invoice-title">Indoor Invoice</h3>
          <div className="invoice-detail">
            <div className="d-flex justify-content-between">
              <div>
                <label>Patient Name :</label> {InvoiceData.patient.fullname}
              </div>
              <div>
                <label>Date :</label> {InvoiceData.formatedDischargeDate}
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <label>Invoice No. :</label> {InvoiceData.uniqueId}
              </div>
              <div>
                <label>City/Village : </label> {InvoiceData && InvoiceData.city}
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <label>Indoor No. :</label> {InvoiceData.invoiceNo}
              </div>
              <div>
                <label>Room Type :</label> {InvoiceData.roomTypeName}
              </div>
            </div>
          </div>
          <table className="table table-bordered invoice-table table-sm mt-2">
            <thead className="thead-dark">
              <tr>
                <th width="10px">No.</th>
                <th>Description</th>
                <th width="50px">Rate</th>
                <th width="50px">Days</th>
                <th width="50px">Amount</th>
              </tr>
            </thead>
            <tbody>
              {chargeNames &&
                chargeNames.map((item, index) => {
                  let rate = "";
                  let days = "";
                  let amount = "";
                  if (InvoiceData.charges) {
                    const chargeObj = InvoiceData.charges.filter(
                      (c) => c.lookupId === item.value
                    )[0];
                    rate = chargeObj ? chargeObj.rate : 0;
                    days = chargeObj ? chargeObj.days : 0;
                    amount = chargeObj ? chargeObj.amount : 0;
                  }
                  return (
                    <tr key={`charge-${index}`}>
                      <th>{index + 1}</th>
                      <td>{item.label}</td>
                      <td className="text-right">{rate}</td>
                      <td className="text-right">{days}</td>
                      <td className="text-right">
                        {this.helper.formatCurrency(amount)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>

            <tfoot className="invoice-footer">
              <tr>
                <td colSpan="4">
                  Grand Total <span></span>
                </td>
                <td className="text-right">
                  <strong> {this.helper.formatCurrency(totalAmount)}</strong>
                </td>
              </tr>
              {InvoiceData.discount ? (
                <tr>
                  <td colSpan="4">Discount</td>
                  <td className="text-right">
                    <strong>
                      {this.helper.formatCurrency(InvoiceData.discount)}
                    </strong>
                  </td>
                </tr>
              ) : null}

              <tr>
                <td colSpan="4">
                  Net Payable Amount :{" "}
                  <span className="text-capitalize">{`${amountInWord} Only`}</span>
                </td>
                <td className="text-right">
                  <strong> {this.helper.formatCurrency(payableAmount)}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
          <div className="d-flex mt-5 invoice-foot">
            <div className="flex-grow-1">Rececived By</div>
            <div className="font-weight-semi-bold">Dr. Bhaumik Tandel</div>
          </div>
        </div>
      )
    );
  }
}
