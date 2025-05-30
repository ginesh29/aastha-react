import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { ROWS } from "../../common/constants";
import { Dialog } from "primereact/dialog";
import OpdForm from "./opd-form";
import { caseTypeOptions, HUNDRED_YEAR_RANGE } from "../../common/constants";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import numberToWords from "number-to-words";
import { departmentEnum } from "../../common/enums";
import jquery from "jquery";
import InvoiceHeader from "../shared/invoice-header";
import Payments from "../ipd/payments";
window.$ = window.jQuery = jquery;
require("jQuery.print/jQuery.print");

export default class Opds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opds: [],
      first: 0,
      rows: ROWS,
      loading: true,
      controller: "opds",
      includeProperties: "Patient.City",
      selectedOpd: null,
      selectedCaseType: null,
      selectedDate: "",
    };
    this.repository = new repository();
    this.helper = new helper();
  }
  getOpds = () => {
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
            item.consultCharge = item.consultCharge ? item.consultCharge : 0;
            item.usgCharge = item.usgCharge ? item.usgCharge : 0;
            item.uptCharge = item.uptCharge ? item.uptCharge : 0;
            item.injectionCharge = item.injectionCharge
              ? item.injectionCharge
              : 0;
            item.otherCharge = item.otherCharge ? item.otherCharge : 0;
            item.formatedDate = this.helper.formatDate(item.date);
            item.city = item.patient.city && item.patient.city.name;
            item.patient = {
              value: item.patient.id,
              label: item.patient.fullname,
              fullname: item.patient.fullname,
            };
            let totalCharge =
              Number(item.consultCharge) +
              Number(item.usgCharge) +
              Number(item.uptCharge) +
              Number(item.injectionCharge) +
              Number(item.otherCharge);
            item.totalCharge = totalCharge;
            return item;
          });
        this.setState({
          first: first,
          rows: rows,
          totalRecords: res && res.totalCount,
          opds: res && res.data,
          startNo: res && res.startPage,
          endNo: res && res.endPage,
          loading: false,
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
    this.setState(
      {
        multiSortMeta: multiSortMeta,
        sortString: sortString,
        filterString: filter,
      },
      () => {
        this.getOpds();
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
        this.getOpds();
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
        multiSortMeta: [e.multiSortMeta[0], ...SortMetaOld],
        loading: true,
      },
      () => {
        const { multiSortMeta } = this.state;
        let sortString = this.helper.generateSortString(multiSortMeta);
        this.setState({ sortString: sortString }, () => {
          setTimeout(() => {
            this.getOpds();
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
    this.setState(
      { first: 0, filterString: filterString, loading: true },
      () => {
        this.getOpds();
      }
    );
  };

  actionTemplate(rowData, column) {
    return (
      <div>
        <button
          type="button"
          className="btn btn-secondary btn-grid mr-2"
          onClick={() => this.onRowEdit(rowData)}
        >
          <i className="fa fa-pencil"></i>
        </button>
        <button
          type="button"
          className="btn btn-info btn-grid mr-2"
          onClick={() => this.onShowInvoice(rowData)}
        >
          <i className="fa fa-print"></i>
        </button>
        <button
          type="button"
          className="btn btn-danger btn-grid"
          onClick={() => this.onRowDelete(rowData)}
        >
          <i className="fa fa-trash"></i>
        </button>
      </div>
    );
  }
  saveOpd = (updatedOpd, id) => {
    const { opds, totalRecords } = this.state;
    let opdData = [...opds];
    updatedOpd.city = updatedOpd.patient.city && updatedOpd.patient.city.name;
    updatedOpd.patient = updatedOpd.patient && {
      label: updatedOpd.patient.fullname,
      value: updatedOpd.patientId,
      fullname: updatedOpd.patient.fullname,
    };
    updatedOpd.formatedDate = this.helper.formatDate(updatedOpd.date);

    if (!id) {
      opdData.splice(0, 0, updatedOpd);
    } else {
      let index = opdData.findIndex((m) => m.id === updatedOpd.id);
      opdData[index] = updatedOpd;
    }
    this.setState({
      opds: opdData,
      editDialog: false,
      totalRecords: !id ? totalRecords + 1 : totalRecords,
    });
  };

  onRowDelete = (row) => {
    this.setState({
      deleteDialog: true,
      selectedOpd: Object.assign({}, row),
    });
  };
  onRowEdit = (row) => {
    this.setState({
      editDialog: true,
      selectedOpd: Object.assign({}, row),
    });
  };

  onShowInvoice = (row) => {
    this.setState({
      invoiceDialog: true,
      selectedOpd: Object.assign({}, row),
    });
  };
  deleteRow = () => {
    const { opds, selectedOpd, isArchive, controller, totalRecords } =
      this.state;
    let flag = isArchive ? false : true;
    this.repository
      .delete(controller, `${selectedOpd.id}?isDeleted=${flag}`)
      .then((res) => {
        this.setState({
          opds: opds.filter((patient) => patient.id !== selectedOpd.id),
          selectedOpd: null,
          deleteDialog: false,
          totalRecords: totalRecords - 1,
        });
      });
  };
  onFilterChange = (event) => {
    this.dt.filter(event.value, event.target.name, "eq");
    this.setState({ [event.target.id]: event.value });
  };
  render() {
    const {
      opds,
      totalRecords,
      rows,
      first,
      loading,
      multiSortMeta,
      filters,
      deleteDialog,
      isArchive,
      selectedOpd,
      editDialog,
      includeProperties,
      selectedCaseType,
      selectedDate,
      invoiceDialog,
      startNo,
      endNo,
    } = this.state;

    let panelTitle = isArchive ? "Archived Opds" : "Opds";
    let action = isArchive ? "restore" : "delete";
    const typeOptions = caseTypeOptions && [
      { value: null, label: "[All]" },
      ...caseTypeOptions,
    ];
    let dateFilter = (
      <Calendar
        id="selectedDate"
        name="date"
        value={selectedDate}
        onChange={this.onFilterChange}
        dateFormat="dd/mm/yy"
        readOnlyInput={true}
        monthNavigator={true}
        yearNavigator={true}
        yearRange={HUNDRED_YEAR_RANGE}
        showButtonBar={true}
      />
    );
    let typeFilter = (
      <Dropdown
        id="selectedCaseType"
        name="caseType"
        value={selectedCaseType}
        options={typeOptions}
        onChange={this.onFilterChange}
        showClear={true}
        autoWidth={true}
      />
    );

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
              value={opds}
              loading={loading}
              responsive={true}
              emptyMessage="No records found"
              onSort={this.onSort}
              sortMode="multiple"
              multiSortMeta={multiSortMeta}
              filters={filters}
              onFilter={this.onFilter}
              ref={(el) => (this.dt = el)}
              paginator={totalRecords ? true : false}
              rowsPerPageOptions={[10, 30, 45]}
              rows={rows}
              lazy={true}
              totalRecords={totalRecords}
              first={first}
              onPage={this.onPageChange}
              paginatorRight={paginatorRight}
              selectionMode="single"
              selection={selectedOpd}
              onSelectionChange={(e) => this.setState({ selectedOpd: e.value })}
            >
              <Column
                style={{ width: "90px" }}
                field="id"
                header="Invoice Id"
                sortable={true}
                filter={true}
                filterMatchMode="eq"
              />
              <Column
                style={{ width: "110px" }}
                field="invoiceNo"
                header="Outdoor No."
                sortable={true}
                filter={true}
                filterMatchMode="contains"
              />
              <Column
                field="patient.fullname"
                header="Patient's Name"
                sortable={true}
                filter={true}
                filterMatchMode="contains"
              />
              <Column
                style={{ width: "100px" }}
                field="formatedDate"
                header="Opd Date"
                sortable={true}
                filter={true}
                filterMatchMode="eq"
                filterElement={dateFilter}
              />
              <Column
                className="text-center"
                style={{ width: "90px" }}
                field="caseTypeName"
                header="Type"
                filter={true}
                filterMatchMode="eq"
                filterElement={typeFilter}
              />
              <Column
                className="text-right"
                style={{ width: "60px" }}
                field="consultCharge"
                header="Cons"
              />
              <Column
                className="text-right"
                style={{ width: "60px" }}
                field="usgCharge"
                header="USG"
              />
              <Column
                className="text-right"
                style={{ width: "60px" }}
                field="uptCharge"
                header="UPT"
              />
              <Column
                className="text-right"
                style={{ width: "60px" }}
                field="injectionCharge"
                header="Inj"
              />
              <Column
                className="text-right"
                style={{ width: "60px" }}
                field="otherCharge"
                header="Other"
              />
              <Column
                className="text-right"
                style={{ width: "60px" }}
                field="totalCharge"
                header="Total"
              />
              <Column
                body={this.actionTemplate.bind(this)}
                style={{ textAlign: "center", width: "100px" }}
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
          Are you sure you want to {action} this item?
        </Dialog>

        <Dialog
          header="Edit Opd"
          visible={editDialog}
          onHide={() => this.setState({ editDialog: false })}
          dismissableMask={true}
        >
          {editDialog && (
            <OpdForm
              selectedOpd={selectedOpd}
              hideEditDialog={() => this.setState({ editDialog: false })}
              saveOpd={this.saveOpd}
              includeProperties={includeProperties}
            />
          )}
          {selectedOpd && selectedOpd.id && (
            <Payments id={selectedOpd.id} type={departmentEnum.OPD} />
          )}
        </Dialog>
        <Dialog
          header="Opd Invoice"
          visible={invoiceDialog}
          onHide={() => this.setState({ invoiceDialog: false })}
          className="p-scroll-dialog"
          style={{ width: "550px" }}
          dismissableMask={true}
        >
          {invoiceDialog && (
            <>
              <div id="print-div" className="A5 invoice-container">
                <InvoiceHeader removeLogoButton={true} />
                <h3 className="invoice-title">Outdoor Invoice</h3>
                <div className="invoice-detail">
                  <div className="d-flex justify-content-between">
                    <div>
                      <label>Patient Name :</label>{" "}
                      {selectedOpd.patient && selectedOpd.patient.fullname}
                    </div>
                    <div>
                      <label>Date :</label>{" "}
                      {this.helper.formatDate(selectedOpd.date)}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <label>Invoice No. :</label> {selectedOpd.id}
                    </div>
                    <div>
                      <label>City/Village :</label> {selectedOpd.city}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <label>Outdoor No. :</label>{" "}
                      {selectedOpd && selectedOpd.invoiceNo}
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
                        {selectedOpd.consultCharge}
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Ultrasonography Charge</td>
                      <td className="text-right">{selectedOpd.usgCharge}</td>
                    </tr>
                    <tr>
                      <td>3.</td>
                      <td>Urine Test Charge</td>
                      <td className="text-right">{selectedOpd.uptCharge}</td>
                    </tr>
                    <tr>
                      <td>4.</td>
                      <td>Injection Charge</td>
                      <td className="text-right">
                        {selectedOpd.injectionCharge}
                      </td>
                    </tr>
                    <tr>
                      <td>5.</td>
                      <td>Other Charge</td>
                      <td className="text-right">{selectedOpd.otherCharge}</td>
                    </tr>
                  </tbody>
                  <tfoot className="invoice-footer">
                    <tr>
                      <td colSpan="2" className="text-capitalize">
                        Grand Total &nbsp;|{" "}
                        {`${numberToWords
                          .toWords(selectedOpd.totalCharge)
                          .replace(/,/g, "")} Only`}
                      </td>
                      <td className="text-right">
                        {this.helper.formatCurrency(selectedOpd.totalCharge)}
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
                  onClick={() => jquery("#print-div").print()}
                >
                  <i className="fa fa-print"></i> Print Invoice
                </button>
              </div>
            </>
          )}
        </Dialog>
      </>
    );
  }
}
