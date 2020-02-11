import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { repository } from "../../common/repository";
import { NavLink } from 'react-router-dom';
import { helper } from "../../common/helpers";
import { ROWS } from "../../common/constants";
import { Dialog } from 'primereact/dialog';

export default class Opds extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opds: [],
            first: 0,
            rows: ROWS,
            loading: true,
            filterString: "",
            sortString: "id desc",
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
                    opds: res && res.data,
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
            <button type="button" className="btn btn-secondary btn-grid mr-2" onClick={() => this.onRowEdit(rowData)}>
                <i className="fa fa-pencil"></i>
            </button>
            <button type="button" className="btn btn-info btn-grid mr-2" onClick={() => this.onRowEdit(rowData)}>
                <i className="fa fa-file"></i>
            </button>
            <button type="button" className="btn btn-danger btn-grid" onClick={() => this.onRowDelete(rowData)}>
                <i className="fa fa-times"></i>
            </button>
        </div>;
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
        const { opds, selectedPatient, isArchive, controller } = this.state;
        let flag = isArchive ? false : true;
        this.repository.delete(controller, `id=${selectedPatient.id}&isDeleted=${flag}`)
            .then(res => {
                this.setState({
                    opds: opds.filter(patient => patient.id !== selectedPatient.id),
                    selectedPatient: null,
                    deleteDialogVisible: false
                });
            })
    }
    render() {
        const { opds, totalRecords, rows, first, loading, multiSortMeta, filters, deleteDialogVisible, isArchive, selectedPatient } = this.state;
        let linkUrl = isArchive ? "/opds" : "/archive-opds";
        let panelTitle = isArchive ? "Archived Opds" : "Opds";
        let buttonText = !isArchive ? "Archived Opds" : "Opds";
        let action = isArchive ? "restore" : "delete";
        const startNo = first + 1;
        const endNo = first + rows;
        const deleteDialogFooter = (
            <div>
                <Button label="Yes" icon="pi pi-check" onClick={this.deleteRow} />
                <Button label="No" icon="pi pi-times" onClick={() => this.setState({ deleteDialogVisible: false })} className="p-button-secondary" />
            </div>
        );
        let paginatorRight = <div className="m-1">Showing {this.helper.formatAmount(startNo)} to {this.helper.formatAmount(endNo)} of {this.helper.formatAmount(totalRecords)} records</div>;
        return (
            <>
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between">
                            <div>
                                {
                                    !isArchive &&
                                    <button type="button" className="btn btn-labeled btn-secondary btn-sm mb-2" onClick={() => this.onRowEdit()}><span className="btn-label"><i className="fa fa-plus"></i></span>Add</button>
                                }
                            </div>
                            <div className="report-header">{panelTitle}</div>
                            <div>
                                <NavLink to={linkUrl}><Button className="btn-archive p-btn-sm mb-2" icon={`fa fa-${!isArchive ? "archive" : "file-text-o"}`} tooltip={`Show ${buttonText}`} /></NavLink>
                            </div>
                        </div>
                        <DataTable value={opds} loading={loading} responsive={true} emptyMessage="No records found"
                            onSort={this.onSort} sortMode="multiple" multiSortMeta={multiSortMeta}
                            filters={filters} onFilter={this.onFilter}
                            paginator={totalRecords && true} rowsPerPageOptions={[10, 30, 45]} rows={rows} lazy={true} totalRecords={totalRecords} first={first} onPage={this.onPageChange} paginatorRight={paginatorRight}
                            selectionMode="single" selection={selectedPatient} onSelectionChange={e => this.setState({ selectedPatient: e.value })}>

                            <Column style={{ "width": "80px" }} field="id" header="Invoice Id" sortable={true} filter={true} filterMatchMode="equals" />
                            <Column style={{ "width": "100px" }} field="invoiceNo" header="Outdoor No." sortable={true} filter={true} filterMatchMode="equals" />
                            <Column field="patient.label" header="Patient's Name" sortable={true} filter={true} filterMatchMode="contains" />
                            <Column style={{ "width": "90px" }} field="formatedDate" header="Opd Date" sortable={true} filter={true} filterMatchMode="contains" />
                            <Column className="text-center" style={{ "width": "70px" }} field="caseTypeName" header="Type" filter={true} filterMatchMode="contains" />
                            <Column className="text-right" style={{ "width": "70px" }} field="consultCharge" header="Cons" sortable={true} filter={true} filterMatchMode="contains" />
                            <Column className="text-right" style={{ "width": "70px" }} field="usgCharge" header="USG" sortable={true} filter={true} filterMatchMode="contains" />
                            <Column className="text-right" style={{ "width": "70px" }} field="uptCharge" header="UPT" sortable={true} filter={true} filterMatchMode="contains" />
                            <Column className="text-right" style={{ "width": "70px" }} field="injectionCharge" header="Inj" sortable={true} filter={true} filterMatchMode="contains" />
                            <Column className="text-right" style={{ "width": "70px" }} field="otherCharge" header="Other" sortable={true} filter={true} filterMatchMode="contains" />
                            <Column className="text-right" style={{ "width": "70px" }} field="totalCharge" header="Total" sortable={true} filter={true} filterMatchMode="contains" />
                            <Column body={this.actionTemplate.bind(this)} style={{ textAlign: 'center', width: '110px' }} />
                        </DataTable>
                    </div>
                </div>
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
