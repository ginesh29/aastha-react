import React, { Component } from "react";
import { helper } from "../../common/helpers";
import { repository } from "../../common/repository";
import numberToWords from "number-to-words";
import invoice_header from "../../assets/images/invoice_header.jpg";
import _ from "lodash";

export default class IpdInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.helper = new helper();
    this.repository = new repository();
  }
  render() {
    const { InvoiceData, invoiceClass } = this.props;
    const totalAmount = _.sumBy(InvoiceData.charges, x => x.amount);
    const payableAmount = totalAmount - InvoiceData.discount;
    const amountInWord = numberToWords.toWords(payableAmount);
    return (
      InvoiceData && (
        <div className={invoiceClass}>
          <img
            src={invoice_header}
            className="img-fluid"
            alt="Invoice Header"
          />
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
                <label>Address :</label> {InvoiceData.address}
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
              {InvoiceData.charges
                .filter(m => m.amount > 0)
                .map((item, i) => {
                  return (
                    <tr key={`charge-${i}`}>
                      <td>{i + 1}</td>
                      <td>{item.chargeDetail.name}</td>
                      <td className="text-right">{item.rate}</td>
                      <td className="text-right">{item.days}</td>
                      <td className="text-right">
                        {this.helper.formatCurrency(item.amount)}
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
