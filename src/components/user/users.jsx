// import React, { Component } from "react";
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Button } from 'primereact/button';
// import { repository } from "./../common/repository";
// import { helper } from "./../common/helpers";
// import { ROWS } from "./../common/constants";
// import { Dialog } from 'primereact/dialog';
// import { Link } from 'react-router-dom';
// import { lookupTypeEnum } from "./../common/enums";
// import { Dropdown } from 'primereact/dropdown';

// export default class Users extends Component
// {
//   constructor(props)
//   {
//     super(props);
//     this.state = {
//       users: [],
//       first: 0,
//       rows: ROWS,
//       loading: true,
//       includeProperties: "",
//       selectedUser: null,
//       controller: "users",
//       addressOptions: [],
//       selectedAddress: null
//     };
//     this.repository = new repository();
//     this.helper = new helper();
//   }
//   getUsers = () =>
//   {
//     const { first, rows, filterString, sortString, includeProperties, controller } = this.state;
//     this.repository.get(controller, `take=${ rows }&skip=${ first }&filter=${ filterString }&sort=${ sortString }&includeProperties=${ includeProperties }`)
//       .then(res =>
//       {
//         this.setState({
//           first: first,
//           rows: rows,
//           totalRecords: res && res.totalCount,
//           users: res && res.data,
//           loading: false
//         });
//       })
//   }
//   getAddresses = () =>
//   {
//     this.repository.get("lookups", `&filter=type-eq-{${ lookupTypeEnum.ADDRESS.codw }} and isDeleted-neq-{${ false }}&sort=name asc`)
//       .then(res =>
//       {
//         let addresses = res && res.data.map(function (item)
//         {
//           return { value: item.id, label: item.name };
//         });
//         // addresses && addresses.splice(0, 0, )
//         this.setState({
//           addressOptions: res && [{ value: null, label: "[All]" }, ...addresses],
//         });
//       })
//   }
//   componentDidMount = (e) =>
//   {
//     const { isArchive } = this.state;
//     let multiSortMeta = [];
//     multiSortMeta.push({ field: 'id', order: -1 });
//     let sortString = this.helper.generateSortString(multiSortMeta);
//     const filter = !isArchive ? `isDeleted-neq-{${ !isArchive }}` : `isDeleted-eq-{${ isArchive }}`;
//     this.getAddresses();
//     this.setState({ multiSortMeta: multiSortMeta, sortString: sortString, filterString: filter }, () =>
//     {
//       this.getUsers();
//     });
//   }
//   onPageChange = (e) =>
//   {
//     this.setState({
//       rows: e.rows,
//       first: e.first,
//       loading: true
//     }, () =>
//     {
//       this.getUsers();
//     })
//   }
//   onSort = (e) =>
//   {
//     const { multiSortMeta } = this.state;
//     let SortMetaOld = multiSortMeta ? multiSortMeta.filter(item => item.field !== e.multiSortMeta[0].field) : [];
//     this.setState({
//       first: 0,
//       multiSortMeta: [...e.multiSortMeta, ...SortMetaOld],
//       loading: true
//     }, () =>
//     {
//       const { multiSortMeta } = this.state;
//       let sortString = this.helper.generateSortString(multiSortMeta);
//       this.setState({ sortString: sortString }, () =>
//       {
//         setTimeout(() =>
//         {
//           this.getUsers();
//         }, 10);
//       });
//     });
//   }

//   onFilter = (e) =>
//   {
//     this.setState({ filters: e.filters, loading: true });
//     const { isArchive } = this.state;
//     const deleteFilter = !isArchive ? `isDeleted-neq-{${ !isArchive }}` : `isDeleted-eq-{${ isArchive }}`;
//     const filter = this.helper.generateFilterString(e.filters);
//     const operator = filter ? "and" : "";
//     let filterString = `${ deleteFilter } ${ operator } ${ filter }`;
//     this.setState({ first: 0, filterString: filterString }, () =>
//     {
//       this.getUsers();
//     });
//   }

//   onRowDelete = (row) =>
//   {
//     this.setState({
//       deleteDialog: true,
//       selectedUser: Object.assign({}, row)
//     });
//   }

//   onRowEdit = (row) =>
//   {
//     if (row)
//       row.address = { value: row.addressId, label: row.address.name, name: row.address.name }
//     this.setState({
//       editDialog: true,
//       selectedUser: Object.assign({}, row),
//     });
//   }

//   saveUser = (updatedUser, id) =>
//   {
//     const { users, totalRecords } = this.state;
//     let userData = [...users];
//     updatedUser.address = { label: updatedUser.address.name, value: updatedUser.addressId, name: updatedUser.address.name }
//     if (!id) {
//       userData.splice(0, 0, updatedUser);
//     }
//     else {
//       let index = userData.findIndex(m => m.id === updatedUser.id);
//       userData[index] = updatedUser;
//     }
//     this.setState({
//       users: userData,
//       editDialog: false,
//       totalRecords: !id ? totalRecords + 1 : totalRecords
//     });
//   }

//   deleteRow = () =>
//   {
//     const { users, selectedUser, isArchive, controller, totalRecords } = this.state;
//     this.repository.delete(controller, `${ selectedUser.id }?isDeleted=${ !isArchive }`)
//       .then(res =>
//       {
//         this.setState({
//           users: users.filter(user => user.id !== selectedUser.id),
//           selectedUser: null,
//           deleteDialog: false,
//           totalRecords: totalRecords - 1
//         });
//       })
//   }

//   actionTemplate(rowData, column)
//   {
//     return (
//       <div>
//         <button type="button" className="btn btn-labeled btn-secondary icon-btn-grid mr-2" onClick={() => this.onRowEdit(rowData)}>
//           <span className="btn-label"><i className="fa fa-pencil"></i></span>Edit
//         </button>
//         <button type="button" className="btn btn-labeled btn-danger icon-btn-grid" onClick={() => this.onRowDelete(rowData)}>
//           <span className="btn-label"><i className="fa fa-times"></i></span>Delete
//         </button>
//       </div>
//     )
//   }
//   onFilterChange = (event) =>
//   {
//     this.dt.filter(event.value, event.target.name, 'eq');
//     this.setState({ [event.target.id]: event.value });
//   }
//   render()
//   {
//     let { users, totalRecords, rows, first, loading, multiSortMeta,
//       filters, deleteDialog, isArchive, selectedUser, selectedAddress, addressOptions } = this.state;
//     let addressFilter = <Dropdown id="selectedAddress" name="address.id" value={selectedAddress} options={addressOptions} onChange={this.onFilterChange} filter={true} showClear={true} />
//     let linkUrl = isArchive ? "/users" : "/archive-users";
//     let panelTitle = isArchive ? "Archived Users" : "Users";
//     let buttonText = !isArchive ? "Archived Users" : "Users";
//     let action = isArchive ? "restore" : "delete";
//     const startNo = first + 1;
//     const endNo = totalRecords > rows ? first + rows : totalRecords;
//     const deleteDialogFooter = (
//       <div>
//         <Button label="Yes" icon="pi pi-check" onClick={this.deleteRow} />
//         <Button label="No" icon="pi pi-times" onClick={() => this.setState({ deleteDialog: false })} className="p-button-secondary" />
//       </div>
//     );
//     let paginatorRight = totalRecords && <div className="m-1">Showing {this.helper.formatAmount(startNo)} to {this.helper.formatAmount(endNo)} of {this.helper.formatAmount(totalRecords)} records</div>;
//     return (
//       <>
//         <div className="card">
//           <div className="card-body">
//             <div className="d-flex justify-content-between">
//               <div>
//                 {
//                   !isArchive &&
//                   <button type="button" className="btn btn-labeled btn-secondary btn-sm mb-2" onClick={() => this.onRowEdit()}><span className="btn-label"><i className="fa fa-plus"></i></span>Add</button>
//                 }
//               </div>
//               <div className="report-header">{panelTitle}</div>
//             </div>
//             <DataTable value={users} loading={loading} responsive={true} emptyMessage="No records found" ref={(el) => this.dt = el}
//               onSort={this.onSort} sortMode="multiple" multiSortMeta={multiSortMeta}
//               filters={filters} onFilter={this.onFilter}
//               paginator={totalRecords ? true : false} rowsPerPageOptions={[10, 30, 45]} rows={rows} lazy={true} totalRecords={totalRecords} first={first} onPage={this.onPageChange} paginatorRight={paginatorRight}
//               selectionMode="single" selection={selectedUser} onSelectionChange={e => this.setState({ selectedUser: e.value })}>

//               <Column field="id" header="Id" style={{ "width": "100px" }} sortable={true} filter={true} filterMatchMode="eq" />
//               <Column field="fullname" header="User's Name" sortable={true} filter={true} filterMatchMode="contains" />
//               <Column field="age" style={{ "width": "100px" }} header="Age" />
//               <Column field="mobile" style={{ "width": "150px" }} header="Mobile" filter={true} filterMatchMode="contains" />
//               <Column field="address.name" style={{ "width": "150px" }} header="City" sortable={true} filter={true} filterElement={addressFilter} />
//               <Column body={this.actionTemplate.bind(this)} style={{ textAlign: 'center', width: '190px' }} />
//             </DataTable>
//           </div>
//         </div>
//         <Dialog header="Edit User" visible={editDialog} onHide={() => this.setState({ editDialog: false })}>
//           {
//             editDialog &&
//             <PatientForm selectedPatient={selectedPatient} hideEditDialog={() => this.setState({ editDialog: false })} savePatient={this.savePatient} includeProperties={includeProperties} />
//           }
//         </Dialog>
//         <Dialog header="Confirmation" visible={deleteDialog} footer={deleteDialogFooter} onHide={() => this.setState({ deleteDialog: false })}>
//           Are you sure you want to {action} this item ?
//         </Dialog>
//       </>
//     );
//   }
// }
