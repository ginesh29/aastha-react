import React, { Component } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { ROWS } from "../../common/constants";
import { Dialog } from 'primereact/dialog';
import { NavLink } from 'react-router-dom';
import PatientForm from "./patient-form";

export default class Patients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patients: [],
      first: 0,
      rows: ROWS,
      loading: true,
      filterString: "",
      sortString: "id desc",
      includeProperties: "Address",
      selectedPatient: null,
      controller: "patients",
      isArchive: props.location.pathname.includes("archive"),
    };
    this.repository = new repository();
    this.helper = new helper();
  }
  getPatients = () => {
    const { first, rows, filterString, sortString, includeProperties, controller } = this.state;
    this.repository.get(controller, `take=${rows}&skip=${first}&${filterString}&sort=${sortString}&includeProperties=${includeProperties}`)
      .then(res => {
        const patients = res.data.map(item => {
          delete item.addressId;
          return item;
        })
        this.setState({
          first: first,
          rows: rows,
          totalRecords: res && res.totalCount,
          patients: res && patients,
          loading: false
        });
      })
  }
  componentDidMount = (e) => {
    this.getPatients();
  }

  onPageChange = (e) => {
    this.setState({
      rows: e.rows,
      first: e.first,
      loading: true
    }, () => {
      this.getPatients();
    })
  }
  onSort = (e) => {
    const { multiSortMeta } = this.state;
    let SortMetaOld = multiSortMeta ? multiSortMeta.filter(item => item.field !== e.multiSortMeta[0].field) : [];
    this.setState({
      multiSortMeta: [...e.multiSortMeta, ...SortMetaOld],
      loading: true
    }, () => {
      const { multiSortMeta } = this.state;
      let sortString = this.helper.generateSortString(multiSortMeta);
      this.setState({ sortString: sortString }, () => {
        setTimeout(() => {
          this.getPatients();
        }, 10);
      });
    });
  }

  onFilter = (e) => {
    this.setState({ filters: e.filters, loading: true });
    const { filters } = this.state;
    let filterString = this.helper.generateFilterString(filters);
    console.log(filterString)
    this.setState({ filterString: filterString }, () => {
      this.getPatients();
    });
  }

  onRowDelete = (row) => {
    this.setState({
      deleteDialogVisible: true,
      selectedPatient: Object.assign({}, row)
    });
  }

  onRowEdit = (row) => {
    if (row)
      row.address = { value: row.address.id, label: row.address.name, name: row.address.name }
    this.setState({
      editDialogVisible: true,
      selectedPatient: Object.assign({}, row),
    });
  }

  savePatient = (updatedPatient, id) => {
    const { patients } = this.state;
    const isAdd = !id ? true : false;
    let patientData = [...patients];
    updatedPatient.address = { label: updatedPatient.address.name, value: updatedPatient.address.id, name: updatedPatient.address.name }
    delete updatedPatient.addressId;
    if (isAdd) {
      patientData.splice(0, 0, updatedPatient);
    }
    else {
      let index = patientData.findIndex(m => m.id === updatedPatient.id);
      patientData[index] = updatedPatient;
    }
    this.setState({
      patients: patientData,
      editDialogVisible: false
    });
  }

  deleteRow = () => {
    const { patients, selectedPatient, isArchive, controller } = this.state;
    let flag = isArchive ? false : true;
    this.repository.delete(controller, `id=${selectedPatient.id}&isDeleted=${flag}`)
      .then(res => {
        this.setState({
          patients: patients.filter(patient => patient.id !== selectedPatient.id),
          selectedPatient: null,
          deleteDialogVisible: false
        });
      })
  }

  actionTemplate(rowData, column) {
    return (
      <div>
        <button type="button" className="btn btn-labeled btn-secondary icon-btn-grid mr-2" onClick={() => this.onRowEdit(rowData)}>
          <span className="btn-label"><i className="fa fa-pencil"></i></span>Edit
        </button>
        <button type="button" className="btn btn-labeled btn-danger icon-btn-grid" onClick={() => this.onRowDelete(rowData)}>
          <span className="btn-label"><i className="fa fa-times"></i></span>Delete
        </button>
      </div>
    )
  }

  render() {
    let { patients, totalRecords, rows, first, loading, multiSortMeta,
      filters, deleteDialogVisible, editDialogVisible, isArchive, selectedPatient, includeProperties } = this.state;

    let linkUrl = isArchive ? "/patients" : "/archive-patients";
    let panelTitle = isArchive ? "Archived Patients" : "Patients";
    let buttonText = !isArchive ? "Archived Patients" : "Patients";
    let action = isArchive ? "restore" : "delete";
    const deleteDialogFooter = (
      <div>
        <Button label="Yes" icon="pi pi-check" onClick={this.deleteRow} />
        <Button label="No" icon="pi pi-times" onClick={() => this.setState({ deleteDialogVisible: false })} className="p-button-secondary" />
      </div>
    );
    let paginatorRight = <div className="m-2">Showing {first + 1} to {first + rows} of {totalRecords} entries</div>;
    return (
      <>
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <button type="button" className="btn btn-labeled btn-secondary btn-sm mb-2" onClick={() => this.onRowEdit()}><span className="btn-label"><i className="fa fa-plus"></i></span>Add</button>
              </div>
              <div className="report-header">{panelTitle}</div>
              <div>
                <NavLink to={linkUrl}><Button className="btn-archive" icon="fa fa-archive" tooltip={`Show ${buttonText}`} /></NavLink>
              </div>
            </div>
            <DataTable value={patients} loading={loading} responsive={true} emptyMessage="No records found"
              onSort={this.onSort} sortMode="multiple" multiSortMeta={multiSortMeta}
              filters={filters} onFilter={this.onFilter}
              paginator={true} rowsPerPageOptions={[10, 30, 45]} rows={rows} lazy={true} totalRecords={totalRecords} first={first} onPage={this.onPageChange} paginatorRight={paginatorRight}
              selectionMode="single" selection={selectedPatient} onSelectionChange={e => this.setState({ selectedPatient: e.value })}>

              <Column field="id" header="Id" style={{ "width": "100px" }} sortable={true} filter={true} filterMatchMode="equals" />
              <Column field="fullname" header="Patient's Name" sortable={true} filter={true} filterMatchMode="contains" />
              <Column field="age" style={{ "width": "100px" }} header="Age" />
              <Column field="mobile" style={{ "width": "150px" }} header="Mobile" filter={true} filterMatchMode="contains" />
              <Column field="address.name" style={{ "width": "150px" }} header="Address" sortable={true} filter={true} filterMatchMode="contains" />
              <Column body={this.actionTemplate.bind(this)} style={{ textAlign: 'center', width: '190px' }} />
            </DataTable>
          </div>
        </div>
        <Dialog header="Confirmation" visible={deleteDialogVisible} footer={deleteDialogFooter} onHide={() => this.setState({ deleteDialogVisible: false })}>
          Are you sure you want to {action} this item ?
        </Dialog>

        <Dialog header="Edit Patient" visible={editDialogVisible} onHide={() => this.setState({ editDialogVisible: false })}>
          {
            editDialogVisible &&
            <PatientForm selectedPatient={selectedPatient} hideEditDialog={() => this.setState({ editDialogVisible: false })} savePatient={this.savePatient} includeProperties={includeProperties} />
          }
        </Dialog>
      </>
    );
  }
}
