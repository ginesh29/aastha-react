import React, { Component } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { repository } from "../../common/repository";
import { Paginator } from 'primereact/paginator';
import { helper } from "../../common/helpers";
import { ROWS } from "../../common/constants";
import { Dialog } from 'primereact/dialog';

// import { NavLink } from 'react-router-dom';
import PatientForm from "./patient-form";
export default class Patients extends Component
{
  constructor(props)
  {
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
  getPatients = () =>
  {
    const { first, rows, filterString, sortString, includeProperties, controller } = this.state;
    this.repository.get(controller, `take=${ rows }&skip=${ first }&filter=${ filterString }&sort=${ sortString }&includeProperties=${ includeProperties }`)
      .then(res =>
      {
        this.setState({
          first: first,
          rows: rows,
          totalRecords: res && res.totalCount,
          patients: res && res.data,
          loading: false
        });
      })
  }
  componentDidMount = (e) =>
  {
    this.getPatients();
  }

  onPageChange = (e) =>
  {
    this.setState({
      rows: e.rows,
      first: e.first,
      loading: true
    }, () =>
    {
      this.getPatients();
    })
  }
  onSort = (e) =>
  {
    const { multiSortMeta } = this.state;
    let SortMetaOld = multiSortMeta ? multiSortMeta.filter(item => item.field !== e.multiSortMeta[0].field) : [];
    this.setState({
      multiSortMeta: [e.multiSortMeta[0], ...SortMetaOld],
      loading: true
    }, () =>
    {
      const { multiSortMeta } = this.state;
      let sortString = this.helper.generateSortString(multiSortMeta);
      this.setState({ sortString: sortString }, () =>
      {
        setTimeout(() =>
        {
          this.getPatients();
        }, 10);
      });
    });
  }
  onFilter = (e) =>
  {
    this.setState({ filters: e.filters, loading: true });
    const { filters } = this.state;
    let filterString = this.helper.generateFilterString(filters);
    this.setState({ filterString: filterString }, () =>
    {
      this.getPatients();
    });
  }

  actionTemplate(rowData, column)
  {
    return (
      <div>
        <button type="button" className="btn btn-labeled btn-secondary btn-grid mr-2" onClick={() => this.onRowEdit(rowData)}>
          <span className="btn-label"><i className="fa fa-pencil"></i></span>Edit
        </button>
        <button type="button" className="btn btn-labeled btn-danger btn-grid" onClick={() => this.onRowDelete(rowData)}>
          <span className="btn-label"><i className="fa fa-times"></i></span>Delete
        </button>
      </div>
    )
  }

  onRowDelete = (row) =>
  {
    this.setState({
      deleteDialogVisible: true,
      selectedPatient: Object.assign({}, row)
    });
  }
  onRowEdit = (row) =>
  {
    row.addressId = row.address && { value: row.address.id, label: row.address.name }
    delete row.address;
    this.setState({
      editDialogVisible: true,
      selectedPatient: Object.assign({}, row),
    });
  }
  savePatient = () =>
  {
    const { patients, selectedPatient } = this.state;
    let patientData = [...patients];

    if (!selectedPatient.id)
      patientData.push(selectedPatient);
    else {
      let index = patientData.findIndex(m => m.id === selectedPatient.id);
      patientData[index] = selectedPatient;
    }
    this.setState({
      patients: patientData,
      selectedPatient: null,
      editDialogVisible: false
    });
  }

  deleteRow = () =>
  {
    const { patients, selectedPatient, isArchive, controller } = this.state;
    let flag = isArchive ? false : true;
    this.repository.delete(controller, `id=${ selectedPatient.id }&isDeleted=${ flag }`)
      .then(res =>
      {
        this.setState({
          patients: patients.filter(patient => patient.id !== selectedPatient.id),
          selectedPatient: null,
          deleteDialogVisible: false
        });
      })
  }

  render()
  {
    let { patients, totalRecords, rows, first, loading, multiSortMeta, filters, deleteDialogVisible, editDialogVisible, isArchive, selectedPatient } = this.state;

    // let linkUrl = isArchive ? "/patients" : "/archive-patients";
    // let panelTitle = isArchive ? "Archived Patients" : "Current Patients";
    let action = isArchive ? "restore" : "delete";
    //var header = <div className="p-clearfix" style={{ 'lineHeight': '1.87em' }}>{panelTitle}<NavLink to={linkUrl}><Button icon="pi pi-replay" style={{ 'float': 'right' }} /></NavLink> </div>;
    //var footer = "There are " + carCount + ' cars';
    const deleteDialogFooter = (
      <div>
        <Button label="Yes" icon="pi pi-check" onClick={this.deleteRow} />
        <Button label="No" icon="pi pi-times" onClick={() => this.setState({ deleteDialogVisible: false })} className="p-button-secondary" />
      </div>
    );
    return (
      <>
        <DataTable value={patients} loading={loading} responsive={true} emptyMessage="No records found" onSort={this.onSort} sortMode="multiple" multiSortMeta={multiSortMeta} filters={filters} onFilter={this.onFilter} selectionMode="single" tableClassName="">
          <Column field="id" header="Id" style={{ "width": "100px" }} sortable={true} filter={true} filterMatchMode="equals" />
          <Column field="fullname" header="Patient's Name" sortable={true} filter={true} filterMatchMode="contains" />
          <Column field="age" style={{ "width": "100px" }} header="Age" />
          <Column field="mobile" style={{ "width": "150px" }} header="Mobile" filter={true} filterMatchMode="contains" />
          <Column field="address.name" style={{ "width": "150px" }} header="Address" sortable={true} filter={true} filterMatchMode="contains" />
          <Column body={this.actionTemplate.bind(this)} style={{ textAlign: 'center', width: '190px' }} />
        </DataTable>
        <Paginator paginator={true} rowsPerPageOptions={[10, 30, 45]} rows={rows} totalRecords={totalRecords} first={first} onPageChange={this.onPageChange} />

        <Dialog header="Confirmation" visible={deleteDialogVisible} footer={deleteDialogFooter} onHide={() => this.setState({ deleteDialogVisible: false })}>
          Are you sure you want to {action} this item ?
        </Dialog>

        <Dialog header="Edit Patient" visible={editDialogVisible} onHide={() => this.setState({ editDialogVisible: false })}>
          {
            editDialogVisible &&
            <PatientForm selectedPatient={selectedPatient} hideEditDialog={() => this.setState({ editDialogVisible: false })} savePatient={this.savePatient} />
          }
        </Dialog>
      </>
    );
  }
}
