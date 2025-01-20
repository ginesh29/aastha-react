import React, { Component } from "react";
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { reportTypeEnum, patientHistoryOptionsEnum } from "../../common/enums";
import _ from "lodash";
import ReportFilter from "./report-filter";
import { TODAY_DATE } from "../../common/constants";
import { roleEnum } from "../../common/enums";
import { jwtDecode } from "jwt-decode";
import { Dialog } from "primereact/dialog";
import numberToWords from "number-to-words";
import IpdInvoice from "./../ipd/ipd-invoice";
import jquery from "jquery";
import InvoiceHeader from "../shared/invoice-header";
window.$ = window.jQuery = jquery;

export default class PatientsHistoryReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportType: reportTypeEnum.DAILY.value,
      patients: [],
      loading: true,
      filterString: "",
      dateSelection: TODAY_DATE,
      dateRangeSelection: [TODAY_DATE],
      monthSelection: TODAY_DATE,
      controller: "patients",
      detailDialog: false,
    };
    this.repository = new repository();
    this.helper = new helper();
  }
  getPatientsHistories = () => {
    this.setState({ loading: true });
    const { filterString, controller } = this.state;
    this.repository
      .get(`${controller}/GetPatientsHistories`, filterString)
      .then((res) => {
        res &&
          res.map((item) => {
            item.formatedDate = this.helper.formatDate(item.date);
            return item;
          });
        this.setState({
          patients: res,
          loading: false,
        });
      });
  };
  componentDidMount = (e) => {
    const date = this.helper.formatDate(TODAY_DATE, "en-US");
    const title = this.helper.formatDate(TODAY_DATE);
    const filter = `startDate=${date}&endDate=${date}`;
    this.setState({ filterString: filter, reportTitle: title }, () => {
      this.getPatientsHistories();
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
      filter = `startDate=${date}&endDate=${date}`;
      title = dateTitle;
    } else if (reportType === reportTypeEnum.DATERANGE.value) {
      let startDate = this.helper.formatDate(value[0], "en-US");
      let endDate = this.helper.formatDate(value[1], "en-US");
      let startDateTitle = this.helper.formatDate(value[0]);
      let endDateTitle = this.helper.formatDate(value[1]);
      filter = `startDate=${startDate}&endDate=${endDate}`;
      title = `${startDateTitle} - ${endDateTitle}`;
    } else if (reportType === reportTypeEnum.MONTHLY.value) {
      let month = this.helper.getMonthFromDate(value);
      let year = this.helper.getYearFromDate(value);
      filter = `month=${month}&year=${year}`;
      title = `${month}/${year}`;
    }
    this.setState({ filterString: filter, reportTitle: title }, () => {
      this.getPatientsHistories();
    });
  };
  onOpenDetail = (e, type, id) => {
    e.preventDefault();
    if (type === patientHistoryOptionsEnum.OPD.value) {
      this.repository
        .get(`opds/${id}`, `includeProperties=Patient.City`)
        .then((res) => {
          this.setState({
            ipdDetail: null,
            prescriptionDetail: null,
            opdDetail: res,
            detailDialog: true,
          });
        });
    } else if (type === patientHistoryOptionsEnum.IPD.value) {
      this.repository
        .get(
          `ipds/${id}`,
          `includeProperties=Patient.City,Charges.ChargeDetail,DeliveryDetail,OperationDetail,IpdLookups.Lookup`
        )
        .then((res) => {
          res.formatedDischargeDate = this.helper.formatDate(res.DischargeDate);
          res.city = res.patient.city.name;
          this.setState({
            opdDetail: null,
            prescriptionDetail: null,
            ipdDetail: res,
            detailDialog: true,
          });
        });
    } else if (type === patientHistoryOptionsEnum.PRESCRIPTION.value) {
      this.repository
        .get(
          `prescriptions/${id}`,
          `includeProperties=Patient,PrescriptionMedicines`
        )
        .then((res) => {
          this.setState({
            opdDetail: null,
            prescriptionDetail: res,
            ipdDetail: null,
            detailDialog: true,
          });
        });
    }
  };
  getFollowupInstruction(type, date) {
    if (type === 1) {
      return <span>ફરી {date} ના રોજ બતાવવા આવવું</span>;
    } else if (type <= 4 && type !== 0) {
      return <span>ફરી {date} ના રોજ સોનોગ્રાફી માટે આવવું</span>;
    } else if (type === 5) {
      return <span>માસિકના બીજા/ત્રીજા/પાંચમા દિવસે બતાવવા આવવું</span>;
    }
  }
  render() {
    const token = localStorage.getItem("aastha-auth-token");
    if (token != null && token.length > 0) {
      var decoded_token = jwtDecode(token);
      var role = Number(decoded_token.Role);
    }
    const {
      patients,
      reportTitle,
      loading,
      detailDialog,
      opdDetail,
      ipdDetail,
      prescriptionDetail,
    } = this.state;
    const patient = prescriptionDetail && prescriptionDetail.patient;
    let groupByDate = _.groupBy(patients, "patientName");
    let patientsData = _.map(groupByDate, (items, key) => {
      let result = {};
      result.patientName = key;
      result.data = items;
      result.count = items.length;
      return result;
    });

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
                    this.setState({ reportType: e.value }, () =>
                      this.getPatientsHistories()
                    )
                  }
                  data={patientsData}
                  loading={loading}
                  visibleReportFilterButton={false}
                />
                <hr />
              </>
            )}
            <div id="print-div" className="col-md-6">
              <h3 className="report-header">
                Patients History Report {reportTitle}
              </h3>
              <table className="table table-bordered report-table table-sm">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Type</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {patientsData.map((items, key) => {
                    return (
                      <React.Fragment key={`fragement${key}`}>
                        <tr className="report-group-title">
                          <td colSpan="2">
                            <div>
                              <span className="mr-1">Name:</span>
                              {items.patientName}
                            </div>
                          </td>
                          <td className="text-center"></td>
                        </tr>
                        {items.data.map((subitem) => {
                          return (
                            <tr key={`subitem${subitem.id}`}>
                              <td>
                                <a
                                  href="{#}"
                                  onClick={(e) =>
                                    this.onOpenDetail(
                                      e,
                                      subitem.type,
                                      subitem.id
                                    )
                                  }
                                >
                                  {subitem.type ===
                                  patientHistoryOptionsEnum.OPD.value
                                    ? patientHistoryOptionsEnum.OPD.label
                                    : subitem.type ===
                                      patientHistoryOptionsEnum.IPD.value
                                    ? patientHistoryOptionsEnum.IPD.label
                                    : patientHistoryOptionsEnum.PRESCRIPTION
                                        .label}
                                  -{subitem.id}
                                </a>
                              </td>
                              <td>
                                {subitem.type ===
                                patientHistoryOptionsEnum.OPD.value
                                  ? patientHistoryOptionsEnum.OPD.label
                                  : subitem.type ===
                                    patientHistoryOptionsEnum.IPD.value
                                  ? patientHistoryOptionsEnum.IPD.label
                                  : patientHistoryOptionsEnum.PRESCRIPTION
                                      .label}
                              </td>
                              <td>{subitem.formatedDate}</td>
                            </tr>
                          );
                        })}
                        <tr className="report-group-title">
                          <td colSpan="3"></td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
                <tfoot>
                  {patientsData && patientsData.length ? (
                    <tr className="report-footer"></tr>
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-left">
                        No Record Found
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        {opdDetail && (
          <Dialog
            header="Opd Detail"
            visible={detailDialog}
            onHide={() => this.setState({ detailDialog: false })}
            className="p-scroll-dialog"
            style={{ width: "550px" }}
            dismissableMask={true}
          >
            {detailDialog && (
              <>
                <div id="opd-invoice-div" className="A5 invoice-container">
                  <InvoiceHeader removeLogoButton={true} />
                  <h3 className="invoice-title">Outdoor Invoice</h3>
                  <div className="invoice-detail">
                    <div className="d-flex justify-content-between">
                      <div>
                        <label>Patient Name :</label>{" "}
                        {opdDetail.patient && opdDetail.patient.fullname}
                      </div>
                      <div>
                        <label>Date :</label>{" "}
                        {this.helper.formatDate(opdDetail.date)}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>
                        <label>Invoice No. :</label> {opdDetail.id}
                      </div>
                      <div>
                        <label>City/Village :</label>{" "}
                        {opdDetail.patient.city.name}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>
                        <label>Outdoor No. :</label>{" "}
                        {opdDetail && opdDetail.invoiceNo}
                      </div>
                    </div>
                  </div>
                  <table className="table table-bordered invoice-table mt-2">
                    <thead className="thead-dark">
                      <tr>
                        <th width="10px">No.</th>
                        <th>Description</th>
                        <th width="20%" className="text-right">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1.</td>
                        <td>Consulting Charge</td>
                        <td className="text-right">
                          {opdDetail.consultCharge}
                        </td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Ultrasonography Charge</td>
                        <td className="text-right">{opdDetail.usgCharge}</td>
                      </tr>
                      <tr>
                        <td>3.</td>
                        <td>Urine Test Charge</td>
                        <td className="text-right">{opdDetail.uptCharge}</td>
                      </tr>
                      <tr>
                        <td>4.</td>
                        <td>Injection Charge</td>
                        <td className="text-right">
                          {opdDetail.injectionCharge}
                        </td>
                      </tr>
                      <tr>
                        <td>5.</td>
                        <td>Other Charge</td>
                        <td className="text-right">{opdDetail.otherCharge}</td>
                      </tr>
                    </tbody>
                    <tfoot className="invoice-footer">
                      <tr>
                        <td colSpan="2" className="text-capitalize">
                          Grand Total &nbsp;|{" "}
                          {`${numberToWords
                            .toWords(opdDetail.totalCharge)
                            .replace(/,/g, "")} Only`}
                        </td>
                        <td className="text-right">
                          {this.helper.formatCurrency(opdDetail.totalCharge)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                  <div className="d-flex mt-5 invoice-foot">
                    <div className="flex-grow-1">Rececived By</div>
                    <div className="font-weight-semi-bold">
                      Dr. Bhaumik Tandel
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn bt-sm btn-secondary"
                    onClick={() => jquery("#opd-invoice-div").print()}
                  >
                    <i className="fa fa-print"></i> Print Invoice
                  </button>
                </div>
              </>
            )}
          </Dialog>
        )}
        {ipdDetail && (
          <Dialog
            header="Ipd Invoice"
            visible={detailDialog}
            onHide={() => this.setState({ detailDialog: false })}
            className="p-scroll-dialog"
            style={{ width: "650px" }}
            dismissableMask={true}
          >
            {detailDialog && (
              <>
                <div id="ipd-invoice-div" className="A5">
                  <IpdInvoice InvoiceData={ipdDetail} />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn bt-sm btn-secondary"
                    onClick={() => jquery("#ipd-invoice-div").print()}
                  >
                    <i className="fa fa-print"></i> Print Invoice
                  </button>
                </div>
              </>
            )}
          </Dialog>
        )}
        {prescriptionDetail && (
          <Dialog
            header="Prescription Detail"
            visible={detailDialog}
            onHide={() => this.setState({ detailDialog: false })}
            className="p-scroll-dialog"
            style={{ width: "550px" }}
            dismissableMask={true}
          >
            <div className="A5" id="prescription-div">
              <InvoiceHeader removeLogoButton={true} />
              <div className="invoice-detail">
                <div className="d-flex justify-content-between">
                  <div>
                    <label>Patient Name : </label> {patient.fullName}
                  </div>
                  <div>
                    <label>Date : </label>{" "}
                    {this.helper.formatDate(prescriptionDetail.date)}
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div>
                    <label>Patient Id : </label> {patient.id}
                  </div>
                  <div>
                    <label>Age : </label> {patient.age}
                  </div>
                </div>
              </div>
              <hr />
              <div className="d-flex prescription-detail mb-2">
                <div>
                  <label className="m-0">Clinic&nbsp;Detail&nbsp;:&nbsp;</label>
                </div>
                <div>
                  <span className="display-linebreak">
                    {" "}
                    {prescriptionDetail.clinicalDetail}
                  </span>
                </div>
              </div>
              <hr />
              <h4>Rx</h4>
              <div>
                <table className="table table-borderless table-sm medicine-table">
                  <thead>
                    <tr>
                      <th width="100px"></th>
                      <th></th>
                      <th width="50px" className="text-right">
                        Days
                      </th>
                      <th width="50px" className="text-right">
                        Qty
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptionDetail.prescriptionMedicines &&
                      prescriptionDetail.prescriptionMedicines.map(
                        (item, i) => {
                          return (
                            <tr key={i}>
                              <td className="align-top">{item.medicineType}</td>
                              <td className="text-left">
                                {item.medicineName}
                                <br />
                                <span className="gujarati-text">
                                  {item.medicineInstruction}
                                </span>
                              </td>
                              <td className="text-right">{item.days}</td>
                              <td className="text-right">{item.qty}</td>
                            </tr>
                          );
                        }
                      )}
                  </tbody>
                </table>
                <div className="d-flex prescription-detail">
                  <div>
                    <label className="m-0">Advice&nbsp;:</label>
                  </div>
                  <div>
                    <ul>
                      {prescriptionDetail.advices &&
                        prescriptionDetail.advices.split(",").map((item, i) => {
                          return <li key={i + 1}>{item}</li>;
                        })}
                    </ul>
                  </div>
                </div>
                {prescriptionDetail.followupType > 0 && (
                  <>
                    <hr />
                    <div className="d-flex">
                      <div className="prescription-detail">
                        <label className="m-0">
                          Follow&nbsp;up&nbsp;:&nbsp;
                        </label>
                      </div>
                      <div
                        className="gujarati-text"
                        style={{ paddingTop: "4px" }}
                      >
                        {this.getFollowupInstruction(
                          prescriptionDetail.followupType,
                          this.helper.formatDate(
                            prescriptionDetail.followupDate
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn bt-sm btn-secondary"
                onClick={() => jquery("#prescription-div").print()}
              >
                <i className="fa fa-print"></i> Print Invoice
              </button>
            </div>
          </Dialog>
        )}
      </>
    );
  }
}
