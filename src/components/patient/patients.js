import React, { Component } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { repository } from "../../common/repository";
import { Paginator } from 'primereact/paginator';
//const title = "Patients";
export default class Patients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patients: [],
      first: 0,
      rows: 15,
      loading: true,
    };
    this.repository = new repository();
    //this.helper = new helper();
  }
  getPatients = () => {
    const { first, rows } = this.state;
    return this.repository.get("patients", `take=${rows}&skip=${first}`, this.messages)
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

  onPageChange = (event) => {
    this.setState({
      rows: event.rows,
      first: event.first,
      loading: true
    }, () => {
      this.getPatients();
    })
  }

  actionTemplate(rowData, column) {
    return <div>
      <Button type="button" icon="pi pi-pencil" className="p-button-warning" style={{ marginRight: '.5em' }}></Button >
      <Button type="button" icon="pi pi-times" className="p-button-danger" ></Button>
    </div >;
  }
  render() {
    const { patients, totalRecords, rows, first, loading } = this.state;
    return (
      <>
        <Messages ref={(el) => this.messages = el} />
        <DataTable value={patients} loading={loading} responsive={true}>
          <Column field="id" header="Id" style={{ "width": "100px" }} />
          <Column field="fullname" header="Patient's Name" />
          <Column field="age" header="Age" />
          <Column field="mobile" header="Mobile" />
          <Column field="address" header="Address" />
          <Column body={this.actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
        </DataTable>
        <Paginator paginator={true} rowsPerPageOptions={[15, 30, 45]} rows={rows} totalRecords={totalRecords} first={first} onPageChange={this.onPageChange}></Paginator>
      </>
    );
  }
}
