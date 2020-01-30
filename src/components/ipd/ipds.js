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

export default class Ipds extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ipds: [],
            first: 0,
            rows: ROWS,
            loading: true,
            filterString: "",
            sortString: "",
            controller: "ipds",
            includeProperties: "Patient,Charges",
            selectedOpd: null,
            isArchive: props.location.pathname.includes("archive"),
        };
        this.repository = new repository();
        this.helper = new helper();
        this.onRowEdit = this.onRowEdit.bind(this);
    }
    getIpds = () => {
        const { first, rows, filterString, sortString, includeProperties, controller } = this.state;
        this.repository.get(controller, `take=${rows}&skip=${first}&filter=${filterString}&sort=${sortString}&includeProperties=${includeProperties}`)
            .then(res => {
                res && res.data.map(item => {
                    item.formatedAddmissionDate = this.helper.formatDate(item.addmissionDate);
                    item.formatedDischargeDate = this.helper.formatDate(item.dischargeDate);
                    item.patient = { value: item.patient.id, label: item.patient.fullname };
                    item.bill = item.charges.reduce((total, item) => total + (item.amount ? Number(item.amount) : 0), 0);
                    item.discount = item.discount ? item.discount : "";
                    item.amount = item.bill - item.discount;
                    return item;
                });
                this.setState({
                    first: first,
                    rows: rows,
                    totalRecords: res && res.totalCount,
                    ipds: res && res.data,
                    loading: false
                });
            })
    }
    componentDidMount = (e) => {
        this.getIpds();
    }

    onPageChange = (e) => {
        this.setState({
            rows: e.rows,
            first: e.first,
            loading: true
        }, () => {
            this.getIpds();
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
                    this.getIpds();
                }, 10);
            });
        });
    }
    onFilter = (e) => {
        this.setState({ filters: e.filters, loading: true });
        const { filters } = this.state;
        let filterString = this.helper.generateFilterString(filters);
        this.setState({ filterString: filterString }, () => {
            this.getIpds();
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
        const { ipds, totalRecords, rows, first, loading, multiSortMeta, filters, deleteDialogVisible, isArchive } = this.state;
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
                <DataTable value={ipds} loading={loading} responsive={true} emptyMessage="No records found" header={header} onSort={this.onSort} sortMode="multiple" multiSortMeta={multiSortMeta} filters={filters} onFilter={this.onFilter} selectionMode="single">
                    <Column field="uniqueId" header="Ipd Id" style={{ "width": "120px" }} sortable={true} filter={true} filterMatchMode="equals" />
                    <Column field="patient.label" header="Patient's Name" sortable={true} filter={true} filterMatchMode="contains" />
                    <Column field="ipdType" style={{ "width": "150px" }} header="Type" />
                    <Column field="formatedAddmissionDate" style={{ "width": "150px" }} header="Add. Date" filter={true} filterMatchMode="contains" />
                    <Column field="formatedDischargeDate" style={{ "width": "150px" }} header="Dis. Date" sortable={true} filter={true} filterMatchMode="contains" />
                    <Column field="bill" style={{ "width": "100px" }} header="Bill" sortable={true} filter={true} filterMatchMode="contains" />
                    <Column field="discount" style={{ "width": "100px" }} header="Conc." sortable={true} filter={true} filterMatchMode="contains" />
                    <Column field="amount" style={{ "width": "120px" }} header="Amount" sortable={true} filter={true} filterMatchMode="contains" />
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
