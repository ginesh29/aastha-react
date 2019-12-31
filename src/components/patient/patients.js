import React, { Component } from "react";
import axios from "axios";
import { baseApiUrl } from "../../common/constants";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
//const title = "Patients";
export default class Patients extends Component {
  state = {
    patients: [],
    first: 0,
    rows: 15,
    loading: true
  };
  getPatients = e => {
    //const { rows, first } = this.state;
    return axios.get(`${baseApiUrl}/patients`).then(res => res.data.Result);
  };
  componentDidMount() {
    this.getPatients().then(data => {
      this.datasource = data.data;
      this.setState({
        totalRecords: data.totalCount,
        patients: data.data.slice(0, this.state.rows),
        loading: false
      });
    });
  }
  onPage = (event) => {
    this.setState({ loading: true });
    const rows = event.rows;
    const startIndex = event.first;
    const endIndex = event.first + rows;
    this.setState({
      first: startIndex,
      rows: rows,
      patients: this.datasource.slice(startIndex, endIndex),
      loading: false
    });
    // this.getPatients().then(data => {
    //   this.setState({
    //     first: startIndex,
    //     rows: rows,
    //     patients: data.data.slice(startIndex, endIndex),
    //     loading: false
    //   });
    console.log(this.state.first)
  }
  render() {
    const { patients, totalRecords, rows, first, loading } = this.state;
    return (
      <DataTable value={patients} paginator={true} rowsPerPageOptions={[15, 30, 45]} rows={rows} totalRecords={totalRecords} lazy={true} onPage={this.onPage} loading={loading} first={first} responsive={true} >
        <Column field="id" header="Id" style={{ "width": "100px" }} />
        <Column field="fullname" header="Patient's Name" />
        <Column field="age" header="Age" />
        <Column field="mobile" header="Mobile" />
        <Column field="address" header="Address" />
      </DataTable>
    );
  }
}
