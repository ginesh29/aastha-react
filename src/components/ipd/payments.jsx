import React, { Component } from "react";
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import jquery from "jquery";
import PaymentForm from "./payment-form";
import { departmentEnum } from "../../common/enums";
import InvoiceHeader from "../shared/invoice-header";
import numberToWords from "number-to-words";

window.$ = window.jQuery = jquery;
require("jQuery.print/jQuery.print");
const controller = "payments";
export default class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: [],
    };
    this.repository = new repository();
    this.helper = new helper();
  }
  getPayments = (id, type) => {
    let filter =
      type === departmentEnum.OPD
        ? `opdId-eq-{${id}} and isdeleted-neq-{true}`
        : `ipdId-eq-{${id}} and isdeleted-neq-{true}`;
    this.repository.get(controller, `filter=${filter}`).then((res) => {
      res &&
        res.data &&
        res.data.map((item) => {
          item.formatedPaymentDate = this.helper.formatDate(item.paymentDate);
          return item;
        });
      this.setState({ payments: res.data });
    });
  };
  onRowDelete = (row) => {
    this.setState({
      deleteDialog: true,
      selectedPayment: Object.assign({}, row),
    });
  };
  onRowEdit = (row) => {
    this.setState({
      editDialog: true,
      selectedPayment: Object.assign({}, row),
    });
  };
  deleteRow = () => {
    const { payments, selectedPayment } = this.state;
    this.repository
      .delete(
        controller,
        `${selectedPayment.id}?isDeleted=${true}&removePhysical=true`
      )
      .then((res) => {
        this.setState({
          payments: payments.filter(
            (payment) => payment.id !== selectedPayment.id
          ),
          selectedPayment: null,
          deleteDialog: false,
        });
      });
  };
  onShowInvoice = (row) => {
    this.setState({
      receiptDialog: true,
      selectedPayment: Object.assign({}, row),
    });
  };
  componentDidMount = (e) => {
    const { id, type, uniqueId } = this.props;
    this.getPayments(id, type, uniqueId);
  };
  render() {
    const {
      payments,
      selectedPayment,
      editDialog,
      deleteDialog,
      receiptDialog,
    } = this.state;
    const { id, type } = this.props;
    const deleteDialogFooter = (
      <div>
        <Button label="Yes" icon="pi pi-check" onClick={this.deleteRow} />
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => this.setState({ deleteDialog: false })}
          className="p-button-secondary"
        />
      </div>
    );
    return (
      <>
        <div>
          <button
            type="button"
            className="btn btn-labeled btn-secondary btn-sm mb-2"
            onClick={() => this.onRowEdit()}
          >
            <span className="btn-label">
              <i className="fa fa-plus"></i>
            </span>
            Add
          </button>
        </div>
        <label>Payment History</label>
        <table className="table table-sm mt-2" style={{ width: "350px" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Mode</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {payments &&
              payments.map((item, i) => {
                return (
                  <tr key={item.id}>
                    <td>{item.formatedPaymentDate}</td>
                    <td>{item.paymentModeName}</td>
                    <td>{item.amount}</td>
                    <td>
                      <div>
                        <button
                          type="button"
                          className="btn btn-secondary btn-grid mr-2"
                          onClick={() => this.onRowEdit(item)}
                        >
                          <i className="fa fa-pencil"></i>
                        </button>
                        {type === departmentEnum.IPD && (
                          <button
                            type="button"
                            className="btn btn-info btn-grid mr-2"
                            onClick={() => this.onShowInvoice(item)}
                          >
                            <i className="fa fa-file-text-o"></i>
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-danger btn-grid"
                          onClick={() => this.onRowDelete(item)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
          {!payments.length && (
            <tfoot>
              <tr>
                <td colSpan={4}>No records found</td>
              </tr>
            </tfoot>
          )}
        </table>
        <Dialog
          header="Edit Payment"
          visible={editDialog}
          onHide={() => this.setState({ editDialog: false })}
          dismissableMask={true}
        >
          <PaymentForm
            selectedPayment={selectedPayment}
            id={id}
            type={type}
            hideEditDialog={() => this.setState({ editDialog: false })}
            getPayments={() => this.getPayments(id, type)}
          />
        </Dialog>
        <Dialog
          header="Receipt"
          visible={receiptDialog}
          onHide={() => this.setState({ receiptDialog: false })}
          className="p-scroll-dialog"
          style={{ width: "550px" }}
          dismissableMask={true}
        >
          {receiptDialog && (
            <>
              <div id="print-div" className="A5 invoice-container">
                <InvoiceHeader removeLogoButton={true} />
                <h3 className="invoice-title">Payment Receipt</h3>
                <div className="invoice-detail">
                  <p>
                    Received with thanks from
                    <span className="blank_space" style={{ width: "350px" }}>
                      {this.props.patientName}
                    </span>
                  </p>
                  <p>
                    the sum of Rupees
                    <span className="blank_space" style={{ width: "60px" }}>
                      {selectedPayment.amount}
                    </span>
                    in figures
                    <span className="blank_space" style={{ width: "200px" }}>
                      {numberToWords
                        .toWords(selectedPayment.amount)
                        .replace(/,/g, "")}{" "}
                      Only
                    </span>
                    in words
                  </p>
                  <p>
                    against Invoice No.
                    <span className="blank_space" style={{ width: "50px" }}>
                      {this.props.uniqueId}
                    </span>{" "}
                    dated
                    <span className="blank_space" style={{ width: "100px" }}>
                      {this.helper.formatDate(this.props.dischargeDate)}
                    </span>
                  </p>
                  <p>
                    Mode of Payment
                    <span
                      className="blank_space"
                      style={{ width: "80px", textAlign: "center" }}
                    >
                      {selectedPayment.paymentModeName}
                    </span>
                    <span className="mr-3">UPI/ NEFT/ Cheque</span>
                  </p>
                  <p>
                    Date of payment
                    <span className="blank_space" style={{ width: "100px" }}>
                      {this.helper.formatDate(selectedPayment.paymentDate)}
                    </span>
                  </p>
                  <div className="d-flex justify-content-between  mt-5">
                    <div
                      className="border border-dark"
                      style={{ width: "100px", height: "100px" }}
                    ></div>
                    <div className="mt-3 font-weight-bold">
                      Authorized signature with seal
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn bt-sm btn-secondary"
                  onClick={() => jquery("#print-div").print()}
                >
                  <i className="fa fa-print"></i> Print Invoice
                </button>
              </div>
            </>
          )}
        </Dialog>
        <Dialog
          header="Confirmation"
          visible={deleteDialog}
          footer={deleteDialogFooter}
          onHide={() => this.setState({ deleteDialog: false })}
          dismissableMask={true}
        >
          Are you sure you want to delete this item?
        </Dialog>
      </>
    );
  }
}
