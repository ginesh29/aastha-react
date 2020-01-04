import React, { Component } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { repository } from "../../common/repository";
import { Paginator } from 'primereact/paginator';
import { helper } from "../../common/helpers";
//const title = "Patients";
export default class Patients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patients: [],
      first: 0,
      rows: 10,
      loading: true,
      filterString: "",
      sortString: ""
    };
    this.repository = new repository();
    this.helper = new helper();
  }
  getPatients = () => {
    const { first, rows, filterString, sortString } = this.state;
    return this.repository.get("patients", `take=${rows}&skip=${first}&filter=${filterString}&sort=${sortString}`, this.messages)
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
    let SortMetaOld = multiSortMeta ? multiSortMeta : [];
    this.setState({
      multiSortMeta: [...SortMetaOld, e.multiSortMeta[0]]
    }, () => {
      const { multiSortMeta } = this.state;
      let a = multiSortMeta.map(item => {
        if (item.field === e.multiSortMeta[0].field)
          return { "field": item.field, "order": e.multiSortMeta[0].order };
        else
          return item;
      })

      console.log(a)
      let sortString = this.helper.generateSortString(multiSortMeta);
      console.log(sortString)
      this.setState({ sortString: sortString }, () => {
        this.getPatients();
      });
    });
  }
  onFilter = (e) => {
    this.setState({ filters: e.filters });
    const { filters } = this.state;
    let filterString = this.helper.generateFilterString(filters);

    this.setState({ filterString: filterString }, () => {
      this.getPatients();
    });
  }

  actionTemplate(rowData, column) {
    return <div>
      <Button type="button" icon="pi pi-pencil" className="p-button-warning" style={{ marginRight: '.5em' }}></Button >
      <Button type="button" icon="pi pi-times" className="p-button-danger" ></Button>
    </div >;
  }
  render() {
    const { patients, totalRecords, rows, first, loading, multiSortMeta, filters } = this.state;
    return (
      <>
        <Messages ref={(el) => this.messages = el} />
        <DataTable value={patients} loading={loading} responsive={true} emptyMessage="No records found" onSort={this.onSort} sortMode="multiple" multiSortMeta={multiSortMeta} filters={filters} onFilter={this.onFilter} selectionMode="single">
          <Column field="id" header="Id" style={{ "width": "100px" }} sortable={true} filter={true} filterMatchMode="equals" />
          <Column field="fullname" header="Patient's Name" sortable={true} filter={true} filterMatchMode="contains" />
          <Column field="age" header="Age" />
          <Column field="mobile" header="Mobile" filter={true} filterMatchMode="contains" />
          <Column field="address" header="Address" sortable={true} filter={true} filterMatchMode="contains" />
          <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
        </DataTable>
        <Paginator paginator={true} rowsPerPageOptions={[10, 30, 45]} rows={rows} totalRecords={totalRecords} first={first} onPageChange={this.onPageChange}></Paginator>
      </>
    );
  }
}
