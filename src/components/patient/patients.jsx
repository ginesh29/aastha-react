import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { ROWS } from "../../common/constants";
import { Dialog } from "primereact/dialog";
import PatientForm from "./patient-form";
import { lookupTypeEnum, patientHistoryOptionsEnum } from "../../common/enums";
import { Dropdown } from "primereact/dropdown";
import numberToWords from "number-to-words";
import IpdInvoice from "./../ipd/ipd-invoice";
import jquery from "jquery";
import InvoiceHeader from "../shared/invoice-header";
window.$ = window.jQuery = jquery;

export default class Patients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patients: [],
      first: 0,
      rows: ROWS,
      loading: true,
      includeProperties: "City,Dist,Taluka",
      selectedPatient: null,
      controller: "patients",
      cityOptions: [],
      selectedCity: null,
      patientId: null,
      dialogLoading: false,
    };
    this.repository = new repository();
    this.helper = new helper();
  }
  getPatients = () => {
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
        `take=${rows}&skip=${first}&filter=${filterString}&sort=${sortString}&includeProperties=${includeProperties}`
      )
      .then((res) => {
        res &&
          res.data.map((item) => {
            item.formatedBirthDate =
              item.birthDate && this.helper.formatDate(item.birthDate);
            return item;
          });
        this.setState({
          first: first,
          rows: rows,
          totalRecords: res && res.totalCount,
          patients: res && res.data,
          startNo: res && res.startPage,
          endNo: res && res.endPage,
          loading: false,
        });
      });
  };
  getCities = () => {
    this.repository
      .get(
        "lookups",
        `&filter=type-eq-{${
          lookupTypeEnum.CITY.code
        }} and isDeleted-neq-{${false}}&sort=name asc`
      )
      .then((res) => {
        let cities =
          res &&
          res.data.map(function (item) {
            return { value: item.id, label: item.name };
          });
        this.setState({
          cityOptions: res && [{ value: null, label: "[All]" }, ...cities],
        });
      });
  };
  componentDidMount = (e) => {
    const { isArchive } = this.state;
    let multiSortMeta = [];
    multiSortMeta.push({ field: "id", order: -1 });
    let sortString = this.helper.generateSortString(multiSortMeta);
    const filter = !isArchive
      ? `isDeleted-neq-{${!isArchive}}`
      : `isDeleted-eq-{${isArchive}}`;
    this.getCities();
    this.setState(
      {
        multiSortMeta: multiSortMeta,
        sortString: sortString,
        filterString: filter,
      },
      () => {
        this.getPatients();
      }
    );
  };
  onPageChange = (e) => {
    this.setState(
      {
        rows: e.rows,
        first: e.first,
        loading: true,
      },
      () => {
        this.getPatients();
      }
    );
  };
  onSort = (e) => {
    const { multiSortMeta } = this.state;
    let SortMetaOld = multiSortMeta
      ? multiSortMeta.filter((item) => item.field !== e.multiSortMeta[0].field)
      : [];
    this.setState(
      {
        first: 0,
        multiSortMeta: [...e.multiSortMeta, ...SortMetaOld],
        loading: true,
      },
      () => {
        const { multiSortMeta } = this.state;
        let sortString = this.helper.generateSortString(multiSortMeta);
        this.setState({ sortString: sortString }, () => {
          setTimeout(() => {
            this.getPatients();
          }, 10);
        });
      }
    );
  };

  onFilter = (e) => {
    this.setState({ filters: e.filters, loading: true });
    const { isArchive } = this.state;
    const deleteFilter = !isArchive
      ? `isDeleted-neq-{${!isArchive}}`
      : `isDeleted-eq-{${isArchive}}`;
    const filter = this.helper.generateFilterString(e.filters);
    const operator = filter ? "and" : "";
    let filterString = `${deleteFilter} ${operator} ${filter}`;
    this.setState({ first: 0, filterString: filterString }, () => {
      this.getPatients();
    });
  };

  onRowDelete = (row) => {
    this.setState({
      deleteDialog: true,
      selectedPatient: Object.assign({}, row),
    });
  };

  onRowEdit = (row) => {
    if (row && row.city)
      row.city = {
        value: row.cityId,
        label: row.city.name,
        name: row.city.name,
      };
    if (row && row.dist)
      row.dist = row.dist && {
        value: row.distId,
        label: row.dist.name,
        name: row.dist.name,
      };
    if (row && row.taluka)
      row.taluka = row.taluka && {
        value: row.talukaId,
        label: row.taluka.name,
        name: row.taluka.name,
      };
    this.setState({
      editDialog: true,
      selectedPatient: Object.assign({}, row),
    });
  };
  getPatientsHistories = () => {
    this.setState({ dialogLoading: true });
    const { controller, selectedPatient } = this.state;
    this.repository
      .get(
        `${controller}/GetPatientsHistories`,
        `patientId=${selectedPatient.id}`
      )
      .then((res) => {
        res &&
          res.map((item) => {
            item.formatedDate = this.helper.formatDate(item.date);
            return item;
          });
        this.setState({
          patientsHistories: res,
          dialogLoading: false,
        });
      });
  };
  onHistoryShow = (row) => {
    this.setState({
      historyDialog: true,
      selectedPatient: Object.assign({}, row),
    });
    setTimeout(() => {
      this.getPatientsHistories();
    }, 0);
  };
  savePatient = (updatedPatient, id) => {
    const { patients, totalRecords } = this.state;
    let patientData = [...patients];
    updatedPatient.city = {
      label: updatedPatient.city.name,
      value: updatedPatient.cityId,
      name: updatedPatient.city.name,
    };
    if (!id) {
      patientData.splice(0, 0, updatedPatient);
    } else {
      let index = patientData.findIndex((m) => m.id === updatedPatient.id);
      patientData[index] = updatedPatient;
    }
    updatedPatient.formatedBirthDate = updatedPatient.birthDate
      ? this.helper.formatDate(updatedPatient.birthDate)
      : null;
    this.setState({
      patients: patientData,
      editDialog: false,
      totalRecords: !id ? totalRecords + 1 : totalRecords,
    });
  };

  deleteRow = () => {
    const { patients, selectedPatient, isArchive, controller, totalRecords } =
      this.state;
    this.repository
      .delete(controller, `${selectedPatient.id}?isDeleted=${!isArchive}`)
      .then((res) => {
        this.setState({
          patients: patients.filter(
            (patient) => patient.id !== selectedPatient.id
          ),
          selectedPatient: null,
          deleteDialog: false,
          totalRecords: totalRecords - 1,
        });
      });
  };

  actionTemplate(rowData, column) {
    return (
      <div>
        <button
          type="button"
          className="btn btn-labeled btn-warning icon-btn-grid mr-2"
          onClick={() => this.onHistoryShow(rowData)}
        >
          <span className="btn-label">
            <i className="fa fa-history"></i>
          </span>
          History
        </button>
        <button
          type="button"
          className="btn btn-labeled btn-secondary icon-btn-grid mr-2"
          onClick={() => this.onRowEdit(rowData)}
        >
          <span className="btn-label">
            <i className="fa fa-pencil"></i>
          </span>
          Edit
        </button>
        <button
          type="button"
          className="btn btn-labeled btn-danger icon-btn-grid"
          onClick={() => this.onRowDelete(rowData)}
        >
          <span className="btn-label">
            <i className="fa fa-trash"></i>
          </span>
          Delete
        </button>
      </div>
    );
  }
  onFilterChange = (event) => {
    this.dt.filter(event.value, event.target.name, "eq");
    this.setState({ [event.target.id]: event.value });
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
    let {
      patients,
      totalRecords,
      rows,
      first,
      loading,
      multiSortMeta,
      filters,
      deleteDialog,
      editDialog,
      historyDialog,
      isArchive,
      selectedPatient,
      includeProperties,
      selectedCity,
      cityOptions,
      startNo,
      endNo,
      patientsHistories,
      dialogLoading,
      opdDetail,
      ipdDetail,
      prescriptionDetail,
      detailDialog,
    } = this.state;

    let cityFilter = (
      <Dropdown
        id="selectedCity"
        name="city.id"
        value={selectedCity}
        options={cityOptions}
        onChange={this.onFilterChange}
        filter={true}
        showClear={true}
      />
    );
    let panelTitle = isArchive ? "Archived Patients" : "Patients";
    let action = isArchive ? "restore" : "delete";
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
    let paginatorRight = totalRecords && (
      <div className="m-1">{`Showing ${this.helper.formatAmount(
        startNo
      )} to ${this.helper.formatAmount(endNo)} of ${this.helper.formatAmount(
        totalRecords
      )} records`}</div>
    );
    const patient = prescriptionDetail && prescriptionDetail.patient;
    return (
      <>
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div className="report-header">{panelTitle}</div>
              <div>
                {!isArchive && (
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
                )}
              </div>
            </div>
            <DataTable
              value={patients}
              loading={loading}
              responsive={true}
              emptyMessage="No records found"
              ref={(el) => (this.dt = el)}
              onSort={this.onSort}
              sortMode="multiple"
              multiSortMeta={multiSortMeta}
              filters={filters}
              onFilter={this.onFilter}
              paginator={totalRecords ? true : false}
              rowsPerPageOptions={[10, 30, 45]}
              rows={rows}
              lazy={true}
              totalRecords={totalRecords}
              first={first}
              onPage={this.onPageChange}
              paginatorRight={paginatorRight}
              selectionMode="single"
              selection={selectedPatient}
              onSelectionChange={(e) =>
                this.setState({ selectedPatient: e.value })
              }
            >
              <Column
                field="id"
                header="Id"
                style={{ width: "100px" }}
                sortable={true}
                filter={true}
                filterMatchMode="eq"
              />
              <Column
                field="fullname"
                header="Patient's Name"
                sortable={true}
                filter={true}
                filterMatchMode="contains"
              />
              <Column
                field="age"
                style={{ width: "50px" }}
                className="text-center"
                header="Age"
              />
              <Column
                style={{ width: "100px" }}
                field="formatedBirthDate"
                header="Birth Date"
              />
              <Column
                field="mobile"
                style={{ width: "100px" }}
                header="Mobile"
                filter={true}
                filterMatchMode="contains"
              />
              <Column
                field="city.name"
                style={{ width: "100px" }}
                header="City"
                sortable={true}
                filter={true}
                filterElement={cityFilter}
              />
              <Column
                field="dist.name"
                style={{ width: "100px" }}
                header="District"
              />
              <Column
                field="taluka.name"
                style={{ width: "100px" }}
                header="Taluka"
              />
              <Column
                body={this.actionTemplate.bind(this)}
                style={{ textAlign: "center", width: "280px" }}
              />
            </DataTable>
          </div>
        </div>
        <Dialog
          header="Confirmation"
          visible={deleteDialog}
          footer={deleteDialogFooter}
          onHide={() => this.setState({ deleteDialog: false })}
          dismissableMask={true}
        >
          Are you sure you want to {action} this item ?
        </Dialog>
        <Dialog
          header="Edit Patient"
          visible={editDialog}
          onHide={() => this.setState({ editDialog: false })}
          style={{ width: "800px" }}
          dismissableMask={true}
        >
          {editDialog && (
            <PatientForm
              selectedPatient={selectedPatient}
              hideEditDialog={() => this.setState({ editDialog: false })}
              savePatient={this.savePatient}
              includeProperties={includeProperties}
            />
          )}
        </Dialog>
        {selectedPatient && (
          <Dialog
            header={
              <>
                Patient's History
                {dialogLoading && (
                  <i className="fa fa-spinner fa-spin ml-2"></i>
                )}
              </>
            }
            visible={historyDialog}
            onHide={() =>
              this.setState({ historyDialog: false, patientsHistories: null })
            }
            style={{ width: "550px" }}
            dismissableMask={true}
          >
            <div className="d-flex justify-content-between">
              <div>
                <label className="mr-1 mt-0">Patient Name: </label>
                {selectedPatient.fullname}
              </div>
              <div>
                <label className="mr-1 mt-0">Age: </label>
                {selectedPatient.age}
              </div>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <div>
                <label className="mr-1 mt-0">Mobile: </label>
                {selectedPatient.mobile}
              </div>
              <div>
                <label className="mr-1 mt-0">City/Village: </label>
                {selectedPatient.city && selectedPatient.city.name}
              </div>
            </div>
            <table className="table table-bordered report-table table-sm">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {patientsHistories &&
                  patientsHistories.map((item, key) => {
                    return (
                      <React.Fragment key={`fragement${key}`}>
                        <tr>
                          <td>
                            <a
                              href="{#}"
                              onClick={(e) =>
                                this.onOpenDetail(e, item.type, item.id)
                              }
                            >
                              {item.type === patientHistoryOptionsEnum.OPD.value
                                ? patientHistoryOptionsEnum.OPD.label
                                : item.type ===
                                  patientHistoryOptionsEnum.IPD.value
                                ? patientHistoryOptionsEnum.IPD.label
                                : patientHistoryOptionsEnum.PRESCRIPTION.label}
                              -{item.id}
                            </a>
                          </td>
                          <td>
                            {item.type === patientHistoryOptionsEnum.OPD.value
                              ? patientHistoryOptionsEnum.OPD.label
                              : item.type ===
                                patientHistoryOptionsEnum.IPD.value
                              ? patientHistoryOptionsEnum.IPD.label
                              : patientHistoryOptionsEnum.PRESCRIPTION.label}
                          </td>
                          <td>{item.formatedDate}</td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
              </tbody>
              <tfoot>
                {patientsHistories && patientsHistories.length ? (
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
          </Dialog>
        )}
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
