import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { repository } from "../../common/repository";
import { NavLink } from 'react-router-dom';
import { helper } from "../../common/helpers";
import { ROWS } from "../../common/constants";
import { Dialog } from 'primereact/dialog';
import OpdForm from "./opd-form";

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
                    item.patient = { value: item.patient.id, label: item.patient.fullname, fullname: item.patient.fullname }
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
        const { isArchive } = this.state;
        const filter = !isArchive ? `isDeleted-neq-{${!isArchive}}` : `isDeleted-eq-{${isArchive}}`;
        this.setState({ filterString: filter }, () => {
            this.getOpds();
        });
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
        const { isArchive } = this.state;
        const deleteFilter = !isArchive ? `isDeleted-neq-{${!isArchive}}` : `isDeleted-eq-{${isArchive}}`;
        const filter = this.helper.generateFilterString(e.filters);
        const operator = filter ? "and" : "";
        let filterString = `${deleteFilter} ${operator} ${filter}`;
        this.setState({ first: 0, filterString: filterString }, () => {
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
    saveOpd = (updatedOpd, id) => {
        const { opds } = this.state;
        const isAdd = !id ? true : false;
        let opdData = [...opds];
        updatedOpd.patient = { label: updatedOpd.patient.fullname, value: updatedOpd.patientId, fullname: updatedOpd.patient.fullname }
        updatedOpd.formatedDate = this.helper.formatDate(updatedOpd.date)
        if (isAdd) {
            opdData.splice(0, 0, updatedOpd);
        }
        else {
            let index = opdData.findIndex(m => m.id === updatedOpd.id);
            opdData[index] = updatedOpd;
        }
        this.setState({
            opds: opdData,
            editDialogVisible: false
        });
    }

    onRowDelete = (row) => {
        this.setState({
            deleteDialogVisible: true,
            selectedOpd: Object.assign({}, row)
        });
    }
    onRowEdit = (row) => {
        this.setState({
            editDialogVisible: true,
            selectedOpd: Object.assign({}, row),
        });
    }

    deleteRow = () => {
        const { opds, selectedOpd, isArchive, controller } = this.state;
        let flag = isArchive ? false : true;
        this.repository.delete(controller, `id=${selectedOpd.id}&isDeleted=${flag}`)
            .then(res => {
                this.setState({
                    opds: opds.filter(patient => patient.id !== selectedOpd.id),
                    selectedOpd: null,
                    deleteDialogVisible: false
                });
            })
    }
    render() {
        const { opds, totalRecords, rows, first, loading, multiSortMeta, filters, deleteDialogVisible, isArchive, selectedOpd, editDialogVisible, includeProperties } = this.state;
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
        let paginatorRight = totalRecords && <div className="m-1">Showing {this.helper.formatAmount(startNo)} to {this.helper.formatAmount(endNo)} of {this.helper.formatAmount(totalRecords)} records</div>;
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
                            paginator={totalRecords ? true : false} rowsPerPageOptions={[10, 30, 45]} rows={rows} lazy={true} totalRecords={totalRecords} first={first} onPage={this.onPageChange} paginatorRight={paginatorRight}
                            selectionMode="single" selection={selectedOpd} onSelectionChange={e => this.setState({ selectedOpd: e.value })}>

                            <Column style={{ "width": "80px" }} field="id" header="Invoice Id" sortable={true} filter={true} filterMatchMode="eq" />
                            <Column style={{ "width": "100px" }} field="invoiceNo" header="Outdoor No." sortable={true} filter={true} filterMatchMode="eq" />
                            <Column field="patient.fullname" header="Patient's Name" sortable={true} filter={true} filterMatchMode="contains" />
                            <Column style={{ "width": "90px" }} field="formatedDate" header="Opd Date" sortable={true} filter={true} filterMatchMode="contains" />
                            <Column className="text-center" style={{ "width": "70px" }} field="caseTypeName" header="Type" filter={true} filterMatchMode="contains" />
                            <Column className="text-right" style={{ "width": "70px" }} field="consultCharge" header="Cons" />
                            <Column className="text-right" style={{ "width": "70px" }} field="usgCharge" header="USG" />
                            <Column className="text-right" style={{ "width": "70px" }} field="uptCharge" header="UPT" />
                            <Column className="text-right" style={{ "width": "70px" }} field="injectionCharge" header="Inj" />
                            <Column className="text-right" style={{ "width": "70px" }} field="otherCharge" header="Other" />
                            <Column className="text-right" style={{ "width": "70px" }} field="totalCharge" header="Total" />
                            <Column body={this.actionTemplate.bind(this)} style={{ textAlign: 'center', width: '110px' }} />
                        </DataTable>
                    </div>
                </div>
                <Dialog header="Confirmation" visible={deleteDialogVisible} footer={deleteDialogFooter} onHide={() => this.setState({ deleteDialogVisible: false })}>
                    Are you sure you want to {action} this item?
                </Dialog>

                <Dialog header="Edit Opd" visible={editDialogVisible} onHide={() => this.setState({ editDialogVisible: false })}>
                    {
                        editDialogVisible &&
                        <OpdForm selectedOpd={selectedOpd} hideEditDialog={() => this.setState({ editDialogVisible: false })} saveOpd={this.saveOpd} includeProperties={includeProperties} />
                    }
                </Dialog>
            </>
        );
    }
}
