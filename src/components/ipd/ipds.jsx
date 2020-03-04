import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { ROWS, TEN_YEAR_RANGE } from "../../common/constants";
import { Dialog } from "primereact/dialog";
import { NavLink } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { departmentTypeEnum } from "../../common/enums";
import IpdForm from "./ipd-form";
import IpdInvoice from "./ipd-invoice";
import ReactToPrint from "react-to-print";

export default class Ipds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ipds: [],
      first: 0,
      rows: ROWS,
      loading: true,
      controller: "ipds",
      includeProperties: "Patient.Address,Charges,DeliveryDetail,OperationDetail,IpdLookups.Lookup",
      selectedIpd: null,
      isArchive: props.location.pathname.includes("archive"),
      selectedIpdType: null,
      selectedAddmissionDate: ""
    };
    this.repository = new repository();
    this.helper = new helper();
  }
  getIpds = () => {
    const { first, rows, filterString, sortString, includeProperties, controller } = this.state;
    this.repository.get(controller, `take=${rows}&skip=${first}&filter=${filterString}&sort=${sortString}&includeProperties=${includeProperties}`).then(res => {
      res &&
        res.data.map(item => {
          item.formatedAddmissionDate = this.helper.formatDate(item.addmissionDate);
          item.formatedDischargeDate = this.helper.formatDate(item.dischargeDate);
          item.address = item.patient.address.name;
          item.patient = {
            value: item.patient.id,
            label: item.patient.fullname,
            fullname: item.patient.fullname
          };
          item.bill = item.charges.reduce((total, item) => total + (item.amount ? Number(item.amount) : 0), 0);
          item.discount = item.discount ? item.discount : 0;
          item.amount = item.bill - item.discount;
          return item;
        });
      this.setState({
        first: first,
        rows: rows,
        totalRecords: res && res.totalCount,
        ipds: res && res.data,
        startNo: res && res.startPage,
        endNo: res && res.endPage,
        loading: false
      });
    });
  };
  componentDidMount = e => {
    const { isArchive } = this.state;
    let multiSortMeta = [];
    multiSortMeta.push({ field: "uniqueId", order: -1 });
    let sortString = this.helper.generateSortString(multiSortMeta);
    const filter = !isArchive ? `isDeleted-neq-{${!isArchive}}` : `isDeleted-eq-{${isArchive}}`;
    this.setState(
      {
        multiSortMeta: multiSortMeta,
        sortString: sortString,
        filterString: filter
      },
      () => {
        this.getIpds();
      }
    );
  };

  onPageChange = e => {
    this.setState(
      {
        rows: e.rows,
        first: e.first,
        loading: true
      },
      () => {
        this.getIpds();
      }
    );
  };
  onSort = e => {
    const { multiSortMeta } = this.state;
    let SortMetaOld = multiSortMeta ? multiSortMeta.filter(item => item.field !== e.multiSortMeta[0].field) : [];
    this.setState(
      {
        multiSortMeta: [e.multiSortMeta[0], ...SortMetaOld],
        loading: true
      },
      () => {
        const { multiSortMeta } = this.state;
        let sortString = this.helper.generateSortString(multiSortMeta);
        this.setState({ sortString: sortString }, () => {
          setTimeout(() => {
            this.getIpds();
          }, 100);
        });
      }
    );
  };
  onFilter = e => {
    const { isArchive } = this.state;
    const deleteFilter = !isArchive ? `isDeleted-neq-{${!isArchive}}` : `isDeleted-eq-{${isArchive}}`;

    const filter = this.helper.generateFilterString(e.filters);
    const operator = filter ? "and" : "";
    let filterString = `${deleteFilter} ${operator} ${filter}`;
    this.setState({ first: 0, filterString: filterString, loading: true }, () => {
      this.getIpds();
    });
  };

  actionTemplate(rowData, column) {
    return (
      <div>
        <button type="button" className="btn btn-secondary btn-grid mr-2" onClick={() => this.onRowEdit(rowData)}>
          <i className="fa fa-pencil"></i>
        </button>
        <button type="button" className="btn btn-info btn-grid mr-2" onClick={() => this.onShowInvoice(rowData)}>
          <i className="fa fa-file-text-o"></i>
        </button>
        <button type="button" className="btn btn-danger btn-grid" onClick={() => this.onRowDelete(rowData)}>
          <i className="fa fa-times"></i>
        </button>
      </div>
    );
  }

  onRowDelete = row => {
    this.setState({
      deleteDialog: true,
      selectedIpd: Object.assign({}, row)
    });
  };
  onRowEdit = row => {
    this.setState({
      editDialog: true,
      selectedIpd: Object.assign({}, row)
    });
  };

  deleteRow = () => {
    const { ipds, selectedIpd, isArchive, controller } = this.state;
    let flag = isArchive ? false : true;
    this.repository.delete(controller, `${selectedIpd.id}?isDeleted=${flag}`).then(res => {
      this.setState({
        ipds: ipds.filter(patient => patient.id !== selectedIpd.id),
        selectedIpd: null,
        deleteDialog: false
      });
    });
  };
  onFilterChange = event => {
    this.dt.filter(event.value, event.target.name, "eq");
    this.setState({ [event.target.id]: event.value });
  };
  saveIpd = (updatedIpd, id) => {
    const { ipds, totalRecords } = this.state;
    let ipdData = [...ipds];
    updatedIpd.patient = {
      label: updatedIpd.patient.fullname,
      value: updatedIpd.patientId,
      fullname: updatedIpd.patient.fullname
    };
    updatedIpd.formatedAddmissionDate = this.helper.formatDate(updatedIpd.addmissionDate);
    updatedIpd.formatedDischargeDate = this.helper.formatDate(updatedIpd.dischargeDate);
    updatedIpd.bill = updatedIpd.charges.reduce((total, item) => total + (item.amount ? Number(item.amount) : 0), 0);
    updatedIpd.amount = updatedIpd.bill - updatedIpd.discount;
    if (!id) {
      ipdData.splice(0, 0, updatedIpd);
    } else {
      let index = ipdData.findIndex(m => m.id === updatedIpd.id);
      ipdData[index] = updatedIpd;
    }
    this.setState({
      ipds: ipdData,
      editDialog: false,
      totalRecords: !id ? totalRecords + 1 : totalRecords
    });
  };
  onShowInvoice = row => {
    this.setState({
      invoiceDialog: true,
      selectedIpd: Object.assign({}, row)
    });
  };

  render() {
    const { ipds, totalRecords, rows, first, loading, multiSortMeta, filters, deleteDialog, selectedIpd, isArchive, selectedAddmissionDate, selectedDischargeDate, selectedIpdType, editDialog, includeProperties, invoiceDialog, startNo, endNo } = this.state;
    const departmentTypeOptions = [{ value: null, label: "[All]" }, ...this.helper.enumToObject(departmentTypeEnum)];
    let linkUrl = isArchive ? "/ipds" : "/archive-ipds";
    let panelTitle = isArchive ? "Archived Ipds" : "Ipds";
    let buttonText = !isArchive ? "Archived Ipds" : "Ipds";
    let action = isArchive ? "restore" : "delete";
    const deleteDialogFooter = (
      <div>
        <Button label="Yes" icon="pi pi-check" onClick={this.deleteRow} />
        <Button label="No" icon="pi pi-times" onClick={() => this.setState({ deleteDialog: false })} className="p-button-secondary" />
      </div>
    );
    let addmissionDateFilter = <Calendar id="selectedAddmissionDate" name="addmissionDate" value={selectedAddmissionDate} onChange={this.onFilterChange} dateFormat="dd/mm/yy" readOnlyInput={true} monthNavigator={true} yearNavigator={true} yearRange={TEN_YEAR_RANGE} />;
    let dischargeDateFilter = <Calendar id="selectedDischargeDate" name="dischargeDate" value={selectedDischargeDate} onChange={this.onFilterChange} dateFormat="dd/mm/yy" readOnlyInput={true} monthNavigator={true} yearNavigator={true} yearRange={TEN_YEAR_RANGE} />;
    let depatmentFilter = <Dropdown id="selectedIpdType" name="type" value={selectedIpdType} options={departmentTypeOptions} onChange={this.onFilterChange} showClear={true} autoWidth={true} />;
    let paginatorRight = totalRecords && <div className="m-1">{`Showing ${this.helper.formatAmount(startNo)} to ${this.helper.formatAmount(endNo)} of ${this.helper.formatAmount(totalRecords)} records`}</div>;
    return (
      <>
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                {!isArchive && (
                  <button type="button" className="btn btn-labeled btn-secondary btn-sm mb-2" onClick={() => this.onRowEdit()}>
                    <span className="btn-label">
                      <i className="fa fa-plus"></i>
                    </span>
                    Add
                  </button>
                )}
              </div>
              <div className="report-header">{panelTitle}</div>
              <div>
                <NavLink to={linkUrl}>
                  <Button className="btn-archive p-btn-sm mb-2" icon={`fa fa-${!isArchive ? "archive" : "file-text-o"}`} tooltip={`Show ${buttonText}`} />
                </NavLink>
              </div>
            </div>

            <DataTable value={ipds} loading={loading} responsive={true} emptyMessage="No records found" ref={el => (this.dt = el)} onSort={this.onSort} sortMode="multiple" multiSortMeta={multiSortMeta} filters={filters} onFilter={this.onFilter} paginator={totalRecords ? true : false} rowsPerPageOptions={[10, 30, 45]} rows={rows} lazy={true} totalRecords={totalRecords} first={first} onPage={this.onPageChange} paginatorRight={paginatorRight} selectionMode="single" selection={selectedIpd} onSelectionChange={e => this.setState({ selectedIpd: e.value })}>
              <Column field="uniqueId" header="Ipd Id" style={{ width: "90px" }} sortable={true} filter={true} filterMatchMode="eq" />
              <Column field="patient.fullname" header="Patient's Name" sortable={true} filter={true} filterMatchMode="contains" />
              <Column field="ipdType" style={{ width: "120px" }} header="Ipd Type" filter={true} filterMatchMode="eq" filterElement={depatmentFilter} />
              <Column field="formatedAddmissionDate" style={{ width: "100px" }} header="Add. Date" sortable={true} filter={true} filterMatchMode="eq" filterElement={addmissionDateFilter} />
              <Column field="formatedDischargeDate" style={{ width: "100px" }} header="Dis. Date" sortable={true} filter={true} filterMatchMode="eq" filterElement={dischargeDateFilter} />
              <Column className="text-right" field="bill" style={{ width: "80px" }} header="Bill" />
              <Column className="text-right" field="discount" style={{ width: "80px" }} header="Conc." />
              <Column className="text-right" field="amount" style={{ width: "80px" }} header="Amount" />
              <Column body={this.actionTemplate.bind(this)} style={{ textAlign: "center", width: "100px" }} />
            </DataTable>
          </div>
        </div>
        <Dialog header="Confirmation" visible={deleteDialog} footer={deleteDialogFooter} onHide={() => this.setState({ deleteDialog: false })}>
          Are you sure you want to {action} this item?
        </Dialog>
        <Dialog
          header="Edit Ipd"
          visible={editDialog}
          onHide={() => {
            this.setState({ editDialog: false });
          }}
          className="p-scroll-dialog"
          style={{ width: "700px" }}
        >
          {editDialog && <IpdForm selectedIpd={selectedIpd} hideEditDialog={() => this.setState({ editDialog: false })} saveIpd={this.saveIpd} includeProperties={includeProperties} />}
        </Dialog>
        <Dialog header="Ipd Invoice" visible={invoiceDialog} onHide={() => this.setState({ invoiceDialog: false })} className="p-scroll-dialog" style={{ width: "650px" }}>
          {invoiceDialog && (
            <div ref={el => (this.printRef = el)} className="A5">
              <IpdInvoice InvoiceData={selectedIpd} />
            </div>
          )}
          <div className="modal-footer">
            <ReactToPrint
              trigger={() => (
                <button type="button" className="btn bt-sm btn-secondary">
                  <i className="fa fa-print"></i> Print Invoice
                </button>
              )}
              content={() => this.printRef}
            />
          </div>
        </Dialog>
        {/* <Dialog header="Edit Patient" visible={editDialog} onHide={() => this.setState({ editDialog: false })}>
                    <PatientForm {...this.state} />
                </Dialog> */}
      </>
    );
  }
}
