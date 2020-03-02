import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { repository } from "../common/repository";
import { helper } from "../common/helpers";
import { ROWS } from "../common/constants";
import { lookupTypeEnum } from "../common/enums";
import { Dialog } from "primereact/dialog";
import { NavLink } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import InputField from "./shared/input-field";
import $ from "jquery";
import FormFooterButton from "./shared/form-footer-button";
export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lookups: [],
      first: 0,
      rows: ROWS,
      loading: true,
      filterString: "",
      sortString: "name asc",
      includeProperties: "Parent",
      isArchive: props.location.pathname.includes("archive"),
      lookupType: lookupTypeEnum.DELIVERYTYPE,
      selectedLookup: {
        id: null,
        name: "",
        parentType: null
      },
      selectedType: null,
      medicineTypeOptions: [],
      validationErrors: {}
    };
    this.repository = new repository();
    this.helper = new helper();
  }
  getMedicineTypes = () => {
    const { sortString } = this.state;
    let lookupFilter = `type-eq-{${lookupTypeEnum.MEDICINETYPE.value}}`;
    this.repository
      .get(
        "lookups",
        `filter=${lookupFilter}&sort=${sortString}&isDeleted=${true}`
      )
      .then(res => {
        let medicineTypes =
          res &&
          res.data.map(function(item) {
            return { value: item.id, label: item.name };
          });
        this.setState({
          medicineTypeOptions: [
            { value: null, label: "[All]" },
            ...medicineTypes
          ]
        });
      });
  };
  getLookups = () => {
    const {
      first,
      rows,
      filterString,
      sortString,
      lookupType,
      includeProperties
    } = this.state;
    let lookupFilter = `type-eq-{${lookupType.value}}`;
    let filter = filterString
      ? `${lookupFilter} and ${filterString}`
      : `${lookupFilter}`;
    this.repository
      .get(
        "lookups",
        `take=${rows}&skip=${first}&filter=${filter}&sort=${sortString}&includeProperties=${includeProperties}`
      )
      .then(res => {
        this.setState(
          {
            first: first,
            rows: rows,
            totalRecords: res && res.totalCount,
            lookups: res && res.data,
            loading: false
          },
          () => {
            this.getMedicineTypes();
          }
        );
      });
  };
  componentDidMount = e => {
    const { isArchive } = this.state;
    let multiSortMeta = [];
    multiSortMeta.push({ field: "name", order: 1 });
    let sortString = this.helper.generateSortString(multiSortMeta);
    const filter = !isArchive
      ? `isDeleted-neq-{${!isArchive}}`
      : `isDeleted-eq-{${isArchive}}`;
    this.setState(
      {
        multiSortMeta: multiSortMeta,
        sortString: sortString,
        filterString: filter
      },
      () => {
        this.getLookups();
      }
    );
  };
  onPageChange = e => {
    this.setState(
      {
        rows: e.rows,
        first: e.first,
        loading: true
      },
      () => {
        this.getLookups();
      }
    );
  };
  onSort = e => {
    const { multiSortMeta } = this.state;
    let SortMetaOld = multiSortMeta
      ? multiSortMeta.filter(item => item.field !== e.multiSortMeta[0].field)
      : [];
    this.setState(
      {
        multiSortMeta: [e.multiSortMeta[0], ...SortMetaOld],
        loading: true
      },
      () => {
        const { multiSortMeta } = this.state;
        let sortString = this.helper.generateSortString(multiSortMeta);
        this.setState({ sortString: sortString }, () => {
          setTimeout(() => {
            this.getLookups();
          }, 10);
        });
      }
    );
  };
  onFilter = e => {
    this.setState({ filters: e.filters, loading: true });
    const { isArchive } = this.state;
    const deleteFilter = !isArchive
      ? `isDeleted-neq-{${!isArchive}}`
      : `isDeleted-eq-{${isArchive}}`;
    const filter = this.helper.generateFilterString(e.filters);
    const operator = filter ? "and" : "";
    let filterString = `${deleteFilter} ${operator} ${filter}`;
    this.setState({ first: 0, filterString: filterString }, () => {
      this.getLookups();
    });
  };

  actionTemplate(rowData, column) {
    return (
      <div>
        <button
          type="button"
          className="btn btn-labeled btn-secondary icon-btn-grid mr-2"
          onClick={() => this.onRowEdit(rowData)}
        >
          <span className="btn-label">
            <i className="fa fa-pencil"></i>
          </span>
          Edit
        </button>
        <button
          type="button"
          className="btn btn-labeled btn-danger icon-btn-grid"
          onClick={() => this.onRowDelete(rowData)}
        >
          <span className="btn-label">
            <i className="fa fa-times"></i>
          </span>
          Delete
        </button>
      </div>
    );
  }

  onRowDelete = row => {
    this.setState({
      deleteDialog: true,
      selectedLookup: Object.assign({}, row)
    });
  };
  onRowEdit = row => {
    this.setState({
      editDialog: true,
      selectedLookup: Object.assign({}, row),
      validationErrors: {}
    });
  };
  handleReset = e => {
    this.setState({ selectedLookup: {}, validationErrors: {} });
  };
  deleteRow = () => {
    const { lookups, selectedLookup, isArchive, totalRecords } = this.state;
    let flag = isArchive ? false : true;
    this.repository
      .delete("lookups", `${selectedLookup.id}?isDeleted=${flag}`)
      .then(res => {
        this.setState({
          lookups: lookups.filter(lookup => lookup.id !== selectedLookup.id),
          selectedLookup: null,
          deleteDialog: false,
          totalRecords: totalRecords - 1
        });
      });
  };

  onHide = () => {
    this.setState({ deleteDialog: false });
  };
  onChangeLookup = e => {
    this.setState(
      { first: 0, lookupType: e.target.value, loading: true },
      () => {
        this.getLookups();
      }
    );
  };
  onFilterChange = event => {
    this.dt.filter(event.value, event.target.name, "eq");
    this.setState({ [event.target.id]: event.value, loading: true });
  };
  handleChange = (e, action) => {
    const { isValidationFired, selectedLookup } = this.state;
    $("#errors").remove();
    let fields = selectedLookup;

    fields[e.target.name] = e.target.value;
    this.setState({
      selectedLookup: fields
    });
    if (isValidationFired) this.handleValidation();
  };
  handleValidation = e => {
    const { lookupType } = this.state;
    const { name, parentId } = this.state.selectedLookup;
    let errors = {};
    let isValid = true;

    if (!name) {
      isValid = false;
      errors.name = `Enter ${lookupType.label}`;
    }
    if (lookupType.value === lookupTypeEnum.MEDICINENAME.value && !parentId) {
      isValid = false;
      errors.parentId = "Select Perent Type";
    }
    this.setState({
      validationErrors: errors,
      isValidationFired: true
    });
    return isValid;
  };
  handleSubmit = e => {
    e.preventDefault();
    const { lookupType, includeProperties } = this.state;
    const { id, name, parentId } = this.state.selectedLookup;
    if (this.handleValidation()) {
      const lookup = {
        id: id && id,
        name: name,
        type: lookupType.value,
        parentId: parentId
      };
      this.repository
        .post(`${"lookups"}?includeProperties=${includeProperties} `, lookup)
        .then(res => {
          if (res && !res.errors) {
            this.setState({ editDialog: false });
            this.savelookup(res, lookup.id);
          }
        });
    }
  };
  savelookup = (updatedLookup, id) => {
    const { lookups, totalRecords } = this.state;
    let lookupData = [...lookups];
    updatedLookup.parent = updatedLookup.parent && {
      name: updatedLookup.parent.name
    };
    if (!id) {
      lookupData.splice(0, 0, updatedLookup);
    } else {
      let index = lookupData.findIndex(m => m.id === updatedLookup.id);
      lookupData[index] = updatedLookup;
    }
    this.setState({
      lookups: lookupData,
      editDialog: false,
      totalRecords: !id && totalRecords + 1
    });
  };
  render() {
    const lookupTypesOptions = this.helper.enumToObject(lookupTypeEnum);
    const {
      lookups,
      totalRecords,
      rows,
      first,
      loading,
      multiSortMeta,
      filters,
      deleteDialog,
      editDialog,
      isArchive,
      lookupType,
      selectedType,
      medicineTypeOptions,
      selectedLookup
    } = this.state;
    let linkUrl = isArchive ? "/admin-panel" : "/archive-admin-panel";
    let buttonText = !isArchive ? "Archived Lookups" : "Lookups";
    let action = isArchive ? "restore" : "delete";
    let typeFilter = (
      <Dropdown
        id="selectedType"
        name="parentId"
        value={selectedType}
        options={medicineTypeOptions}
        onChange={this.onFilterChange}
        showClear={true}
      />
    );
    let texboxLength =
      selectedLookup &&
      selectedLookup.name &&
      (selectedLookup.name.length + 1) * 8;
    const deleteDialogFooter = (
      <div>
        <Button label="Yes" icon="pi pi-check" onClick={this.deleteRow} />
        <Button
          label="No"
          icon="pi pi-times"
          onClick={this.onHide}
          className="p-button-secondary"
        />
      </div>
    );
    const startNo = first + 1;
    const endNo = totalRecords > rows ? first + rows : totalRecords;
    let paginatorRight = totalRecords && (
      <div className="m-1">
        Showing {this.helper.formatAmount(startNo)} to{" "}
        {this.helper.formatAmount(endNo)} of{" "}
        {this.helper.formatAmount(totalRecords)} records
      </div>
    );
    return (
      <>
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  {!isArchive && (
                    <div>
                      <button
                        type="button"
                        className="btn btn-labeled btn-secondary btn-sm mb-2"
                        onClick={() => this.onRowEdit()}
                      >
                        <span className="btn-label">
                          <i className="fa fa-plus"></i>
                        </span>
                        Add
                      </button>
                    </div>
                  )}
                  <div>
                    Filter By :&nbsp;
                    <Dropdown
                      name="lookupType"
                      options={lookupTypesOptions}
                      value={lookupType}
                      onChange={this.onChangeLookup}
                      style={{ width: "200px" }}
                      className=" ml-2 mb-2"
                      optionLabel="label"
                    />
                  </div>

                  <div>
                    <NavLink to={linkUrl}>
                      <Button
                        className="btn-archive p-btn-sm mb-2"
                        icon={`fa fa-${
                          !isArchive ? "archive" : "file-text-o"
                        } `}
                        tooltip={`Show ${buttonText} `}
                      />
                    </NavLink>
                  </div>
                </div>
                <DataTable
                  value={lookups}
                  loading={loading}
                  responsive={true}
                  emptyMessage="No records found"
                  ref={el => (this.dt = el)}
                  onSort={this.onSort}
                  sortMode="multiple"
                  multiSortMeta={multiSortMeta}
                  selection={selectedLookup}
                  onSelectionChange={e =>
                    this.setState({ selectedLookup: e.value })
                  }
                  filters={filters}
                  onFilter={this.onFilter}
                  selectionMode="single"
                  lazy={true}
                  paginatorRight={paginatorRight}
                  paginator={true}
                  rowsPerPageOptions={[10, 30, 45]}
                  rows={rows}
                  totalRecords={totalRecords}
                  first={first}
                  onPage={this.onPageChange}
                >
                  <Column
                    field="name"
                    header={lookupType.label}
                    sortable={true}
                    filter={true}
                    filterMatchMode="contains"
                  />
                  {lookupType.value === lookupTypeEnum.MEDICINENAME.value && (
                    <Column
                      field="parent.name"
                      header="Type"
                      filter={true}
                      filterElement={typeFilter}
                      filterMatchMode="eq"
                      style={{ width: "130px" }}
                    />
                  )}
                  <Column
                    body={this.actionTemplate.bind(this)}
                    style={{ textAlign: "center", width: "190px" }}
                  />
                </DataTable>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          header="Confirmation"
          visible={deleteDialog}
          footer={deleteDialogFooter}
          onHide={() => this.setState({ deleteDialog: false })}
        >
          Are you sure you want to {action} this item?
        </Dialog>

        <Dialog
          header={`Edit ${lookupType.label}`}
          visible={editDialog}
          onHide={() => this.setState({ editDialog: false })}
          style={{ width: texboxLength > 500 ? `${texboxLength}px` : "50%" }}
        >
          {editDialog && (
            <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
              <div>
                <InputField
                  name="name"
                  title={lookupType.label}
                  value={selectedLookup.name || ""}
                  onChange={this.handleChange}
                  onInput={this.helper.toSentenceCase}
                  {...this.state}
                />
                {lookupType.value === lookupTypeEnum.MEDICINENAME.value && (
                  <InputField
                    name="parentId"
                    title="Parent Type"
                    options={medicineTypeOptions}
                    value={selectedLookup.parentId || null}
                    onChange={this.handleChange}
                    {...this.state}
                    controlType="dropdown"
                  />
                )}
              </div>
              <FormFooterButton showReset={!selectedLookup.id} />
            </form>
          )}
        </Dialog>
      </>
    );
  }
}