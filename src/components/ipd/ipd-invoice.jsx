import React, { Component } from "react";
import { helper } from "../../common/helpers";
import { repository } from "../../common/repository";
import numberToWords from "number-to-words";
import invoice_header from "../../assets/images/invoice_header.jpg";
import { lookupTypeEnum } from "../../common/enums";
import _ from "lodash";

export default class IpdInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.helper = new helper();
    this.repository = new repository();
  }
  getCharges = () => {
    this.repository.get("lookups", `filter=type-eq-{${lookupTypeEnum.CHARGENAME.value}} and isDeleted-neq-${true}`).then(res => {
      this.setState({ chargeNames: res && res.data });
    });
  };
  componentDidMount = () => {
    this.getCharges();
  };
  render() {
    const { InvoiceData, invoiceClass } = this.props;
    const { chargeNames } = this.state;
    const totalAmount = _.sumBy(InvoiceData.charges, x => x.amount);
    const payableAmount = totalAmount - InvoiceData.discount;
    const amountInWord = numberToWords.toWords(payableAmount);
    let chargeName;
    let amount = 0;
    let days = 0;
    let rate = 0;
    chargeNames &&
      // eslint-disable-next-line
      chargeNames.map(item => {
        chargeName = `dynamic-charge-${item.id}`;
        let obj = InvoiceData.charges.filter(c => c.lookupId === item.id)[0];
        days = obj && obj.days ? Number(obj.days) : 0;
        rate = obj && obj.rate ? Number(obj.rate) : 0;
        amount = obj && obj.amount ? Number(obj.amount) : 0;
        InvoiceData[chargeName] = {
          chargeName: item.name,
          rate: rate,
          days: days,
          amount: amount
        };
      });
    let chargesColumns = Object.keys(InvoiceData).filter(m => m.includes("dynamic-charge"));
    return (
      InvoiceData && (
        <div className={invoiceClass}>
          <img src={invoice_header} className="img-fluid" alt="Invoice Header" />
          <h3 className="invoice-title">Indoor Invoice</h3>
          <table className="table table-borderless invoice-detail">
            <tbody>
              <tr>
                <td>
                  <label>Name :</label> {InvoiceData.patient.fullname}
                </td>
                <td width="200px">
                  <label>Date :</label> {InvoiceData.formatedDischargeDate}
                </td>
              </tr>
              <tr>
                <td>
                  <label>Invoice No. :</label> {InvoiceData.uniqueId}
                </td>
                <td>
                  <label>Address :</label> {InvoiceData.address}
                </td>
              </tr>
              <tr>
                <td>
                  <label>Indoor No. :</label> {InvoiceData.invoiceNo}
                </td>
                <td>
                  <label>Room Type :</label> {InvoiceData.roomTypeName}
                </td>
              </tr>
            </tbody>
          </table>
          <table className="table table-bordered invoice-table table-sm">
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
              {chargesColumns.map((key, i) => {
                return (
                  <tr key={`charge-${i}`}>
                    <td>{i + 1}</td>
                    <td>{InvoiceData[key].chargeName}</td>
                    <td className="text-right"> {InvoiceData[key].rate}</td>
                    <td className="text-right"> {InvoiceData[key].days}</td>
                    <td className="text-right"> {this.helper.formatCurrency(InvoiceData[key].amount)}</td>
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
              <tr>
                <td colSpan="4">Discount</td>
                <td className="text-right">
                  <strong> {this.helper.formatCurrency(InvoiceData.discount)}</strong>
                </td>
              </tr>
              <tr>
                <td colSpan="4">
                  Net Payable Amount :<span className="text-capitalize"> {`${amountInWord} Only`}</span>
                </td>
                <td className="text-right">
                  <strong> {this.helper.formatCurrency(payableAmount)}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
          <div className="d-flex">
            <div className="flex-grow-1">Rececived By</div>
            <div className="font-weight-semi-bold">Dr. Bhaumik Tandel</div>
          </div>
        </div>
      )
    );
  }
}