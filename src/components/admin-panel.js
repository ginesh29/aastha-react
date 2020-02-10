import React, { Component } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { repository } from "../common/repository";
import { Paginator } from 'primereact/paginator';
import { helper } from "../common/helpers";
import { ROWS } from "../common/constants";
import { lookupTypeEnum } from "../common/enums";
import { Dialog } from 'primereact/dialog';
import { Panel } from 'primereact/panel';
import { NavLink } from 'react-router-dom';
import { Dropdown } from "primereact/dropdown";
// import PatientForm from "./patient-form";
//const title = "Patients";
export default class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lookups: [],
            first: 0,
            rows: ROWS,
            loading: true,
            filterString: "",
            sortString: "",
            lookupType: "",
            selectedLookup: null,
            isArchive: props.location.pathname.includes("archive"),
        };
        this.repository = new repository();
        this.helper = new helper();
    }
    getLookups = () => {
        const { first, rows, filterString, sortString, isArchive, lookupType } = this.state;
        let lookupFilter = `type-eq-{${lookupType || lookupTypeEnum.DELIVERYTYPE.value}}`
        let filter = filterString ? `${lookupFilter} and ${filterString}` : `${lookupFilter}`;
        this.repository.get("lookups", `take=${rows}&skip=${first}&filter=${filter}&sort=${sortString}&isDeleted=${isArchive}`)
            .then(res => {
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
        this.getLookups();
    }

    onPageChange = (e) => {
        this.setState({
            rows: e.rows,
            first: e.first,
            loading: true
        }, () => {
            this.getLookups();
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
                    this.getLookups();
                }, 10);
            });
        });
    }
    onFilter = (e) => {
        this.setState({ filters: e.filters, loading: true });
        const { filters } = this.state;
        let filterString = this.helper.generateFilterString(filters);
        this.setState({ filterString: filterString }, () => {
            this.getLookups();
        });
    }

    actionTemplate(rowData, column) {
        return <>
            <button type="button" className="btn btn-warning grid-action-btn" style={{ marginRight: '.5em' }} onClick={() => this.onRowEdit(rowData)}><i className="fa fa-pencil"></i></button>
            <button type="button" className="btn btn-danger grid-action-btn" onClick={() => this.onRowDelete(rowData)}><i className="fa fa-times"></i></button>
        </>;
    }

    onRowDelete = (row) => {
        this.setState({
            deleteDialogVisible: true,
            selectedPatient: Object.assign({}, row)
        });
    }
    onRowEdit = (row) => {
        this.setState({
            editDialogVisible: true,
            selectedPatient: Object.assign({}, row),
        });
    }

    deleteRow = () => {
        const { patients, selectedPatient, isArchive } = this.state;
        let flag = isArchive ? false : true;
        this.repository.delete("patients", `id=${selectedPatient.id}&isDeleted=${flag}`)
            .then(res => {
                this.setState({
                    patients: patients.filter(patient => patient.id !== selectedPatient.id),
                    selectedPatient: null,
                    deleteDialogVisible: false
                });
            })
    }
    onHide = () => {
        this.setState({ deleteDialogVisible: false });
    }
    onChangeLookup = (e) => {
        this.setState({ lookupType: e.target.value }, () => {
            this.getLookups();
        })
    }
    render() {
        const lookupTypesOptions = this.helper.enumToObject(lookupTypeEnum)
        const { patients, totalRecords, rows, first, loading, multiSortMeta, filters, deleteDialogVisible, editDialogVisible, isArchive, lookupType } = this.state;
        let linkUrl = isArchive ? "/patients" : "/archive-patients";
        let panelTitle = isArchive ? "Archived Patients" : "Current Patients";
        let action = isArchive ? "restore" : "delete";
        var header = <div className="p-clearfix" style={{ 'lineHeight': '1.87em' }}>{panelTitle}
            <Dropdown options={lookupTypesOptions} value={lookupType || lookupTypeEnum.DELIVERYTYPE.value} onChange={this.onChangeLookup} />
            <NavLink to={linkUrl}><Button icon="pi pi-replay" style={{ 'float': 'right' }} /></NavLink> </div>;
        const deleteDialogFooter = (
            <div>
                <Button label="Yes" icon="pi pi-check" onClick={this.deleteRow} />
                <Button label="No" icon="pi pi-times" onClick={this.onHide} className="p-button-secondary" />
            </div>
        );

        return (
            <Panel header={header} toggleable={true} >
                <div className="col-md-6">
                    <div className="row">
                        <DataTable value={patients} loading={loading} responsive={true} emptyMessage="No records found" onSort={this.onSort} sortMode="multiple" multiSortMeta={multiSortMeta} filters={filters} onFilter={this.onFilter} selectionMode="single">
                            <Column field="name" header="Patient's Name" sortable={true} filter={true} filterMatchMode="contains" />
                            <Column field="type" header="Age" />
                            <Column body={this.actionTemplate.bind(this)} style={{ textAlign: 'center', width: '8em' }} />
                        </DataTable>
                        <Paginator paginator={true} rowsPerPageOptions={[10, 30, 45]} rows={rows} totalRecords={totalRecords} first={first} onPageChange={this.onPageChange}></Paginator>
                    </div>
                </div>
                <Dialog header="Confirmation" visible={deleteDialogVisible} footer={deleteDialogFooter} onHide={this.onHide}>
                    Are you sure you want to {action} this item?
                </Dialog>

                <Dialog header="Edit Patient" visible={editDialogVisible} footer={deleteDialogFooter} onHide={this.onHide}>
                </Dialog>
            </Panel>
        );
    }
}
