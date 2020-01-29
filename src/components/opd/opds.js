import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { repository } from "../../common/repository";
import { Paginator } from 'primereact/paginator';
import { helper } from "../../common/helpers";
import { ROWS } from "../../common/constants";
import { Dialog } from 'primereact/dialog';

import { NavLink } from 'react-router-dom';

export default class Opds extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opds: [],
            first: 0,
            rows: ROWS,
            loading: true,
            filterString: "",
            sortString: "",
            controller: "opds",
            includeProperties: "Patient",
            selectedOpd: null,
            isArchive: props.location.pathname.includes("archive"),
        };
        this.repository = new repository();
        this.helper = new helper();
        this.onRowEdit = this.onRowEdit.bind(this);
    }
    getOpds = () => {
        const { first, rows, filterString, sortString, includeProperties, controller } = this.state;
        this.repository.get(controller, `take=${rows}&skip=${first}&filter=${filterString}&sort=${sortString}&includeProperties=${includeProperties}`)
            .then(res => {
                res && res.data.map(item => {
                    item.consultCharge = item.consultCharge ? item.consultCharge : "";
                    item.usgCharge = item.usgCharge ? item.usgCharge : "";
                    item.uptCharge = item.uptCharge ? item.uptCharge : "";
                    item.injectionCharge = item.injectionCharge ? item.injectionCharge : "";
                    item.otherCharge = item.otherCharge ? item.otherCharge : "";
                    item.formatedDate = this.helper.formatDate(item.date);
                    item.patient = { value: item.patient.id, label: item.patient.fullname }
                    let totalCharge = Number(item.consultCharge) + Number(item.usgCharge) + Number(item.uptCharge) + Number(item.injectionCharge) + Number(item.otherCharge);
                    item.totalCharge = totalCharge > 0 && totalCharge;
                    return item;
                });
                this.setState({
                    first: first,
                    rows: rows,
                    totalRecords: res && res.totalCount,
                    patients: res && res.data,
                    loading: false
                });
            })
    }
    componentDidMount = (e) => {
        this.getOpds();
    }

    onPageChange = (e) => {
        this.setState({
            rows: e.rows,
            first: e.first,
            loading: true
        }, () => {
            this.getOpds();
        })
    }
    onSort = (e) => {
        const { multiSortMeta } = this.state;
        let SortMetaOld = multiSortMeta ? multiSortMeta.filter(item => item.field !== e.multiSortMeta[0].field) : [];
        this.setState({
            multiSortMeta: [e.multiSortMeta[0], ...SortMetaOld],
            loading: true
        }, () => {
            const { multiSortMeta } = this.state;
            let sortString = this.helper.generateSortString(multiSortMeta);
            this.setState({ sortString: sortString }, () => {
                setTimeout(() => {
                    this.getOpds();
                }, 10);
            });
        });
    }
    onFilter = (e) => {
        this.setState({ filters: e.filters, loading: true });
        const { filters } = this.state;
        let filterString = this.helper.generateFilterString(filters);
        this.setState({ filterString: filterString }, () => {
            this.getOpds();
        });
    }

    actionTemplate(rowData, column) {
        return <div>
            <Button type="button" icon="pi pi-pencil" className="p-button-warning" style={{ marginRight: '.5em' }} onClick={() => this.onRowEdit(rowData)}></Button >
            <Button type="button" icon="pi pi-times" className="p-button-danger" onClick={() => this.onRowDelete(rowData)}></Button>
        </div >;
    }

    onRowDelete = (row) => {
        this.setState({
            deleteDialogVisible: true,
            selectedPatient: Object.assign({}, row)
        });
    }
    onRowEdit = (row) => {
        row.addressId = { value: row.address.id, label: row.address.name }
        delete row.address;
        this.setState({
            editDialogVisible: true,
            selectedPatient: Object.assign({}, row),
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
    render() {
        const { patients, totalRecords, rows, first, loading, multiSortMeta, filters, deleteDialogVisible, isArchive } = this.state;
        let linkUrl = isArchive ? "/patients" : "/archive-patients";
        let panelTitle = isArchive ? "Archived Patients" : "Current Patients";
        let action = isArchive ? "restore" : "delete";
        var header = <div className="p-clearfix" style={{ 'lineHeight': '1.87em' }}>{panelTitle}<NavLink to={linkUrl}><Button icon="pi pi-replay" style={{ 'float': 'right' }} /></NavLink> </div>;
        //var footer = "There are " + carCount + ' cars';
        const deleteDialogFooter = (
            <div>
                <Button label="Yes" icon="pi pi-check" onClick={this.deleteRow} />
                <Button label="No" icon="pi pi-times" onClick={() => this.setState({ deleteDialogVisible: false })} className="p-button-secondary" />
            </div>
        );

        return (
            <>
                <DataTable value={patients} loading={loading} responsive={true} emptyMessage="No records found" header={header} onSort={this.onSort} sortMode="multiple" multiSortMeta={multiSortMeta} filters={filters} onFilter={this.onFilter} selectionMode="single">
                    <Column field="id" header="Invoice Id" style={{ "width": "120px" }} sortable={true} filter={true} filterMatchMode="equals" />
                    <Column field="invoiceNo" header="Outdoor No." style={{ "width": "150px" }} sortable={true} filter={true} filterMatchMode="equals" />
                    <Column field="patient.label" header="Patient's Name" sortable={true} filter={true} filterMatchMode="contains" />
                    <Column field="formatedDate" style={{ "width": "150px" }} header="Opd Date" />
                    <Column field="caseTypeName" style={{ "width": "100px" }} header="Type" filter={true} filterMatchMode="contains" />
                    <Column field="consultCharge" style={{ "width": "100px" }} header="Cons" sortable={true} filter={true} filterMatchMode="contains" />
                    <Column field="usgCharge" style={{ "width": "100px" }} header="USG" sortable={true} filter={true} filterMatchMode="contains" />
                    <Column field="uptCharge" style={{ "width": "100px" }} header="UPT" sortable={true} filter={true} filterMatchMode="contains" />
                    <Column field="injectionCharge" style={{ "width": "100px" }} header="Inj" sortable={true} filter={true} filterMatchMode="contains" />
                    <Column field="otherCharge" style={{ "width": "100px" }} header="Other" sortable={true} filter={true} filterMatchMode="contains" />
                    <Column field="totalCharge" style={{ "width": "100px" }} header="Total" sortable={true} filter={true} filterMatchMode="contains" />
                    <Column body={this.actionTemplate.bind(this)} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>
                <Paginator paginator={true} rowsPerPageOptions={[10, 30, 45]} rows={rows} totalRecords={totalRecords} first={first} onPageChange={this.onPageChange}></Paginator>

                <Dialog header="Confirmation" visible={deleteDialogVisible} footer={deleteDialogFooter} onHide={() => this.setState({ deleteDialogVisible: false })}>
                    Are you sure you want to {action} this item?
        </Dialog>

                {/* <Dialog header="Edit Patient" visible={editDialogVisible} onHide={() => this.setState({ editDialogVisible: false })}>
                    <PatientForm {...this.state} />
                </Dialog> */}
            </>
        );
    }
}
