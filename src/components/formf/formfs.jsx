import { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { RadioButton } from "primereact/radiobutton";
import { ROWS, FormFDiagnosisOptions } from "../../common/constants";
import { Dialog } from "primereact/dialog";
import { HUNDRED_YEAR_RANGE } from "../../common/constants";
import { Calendar } from "primereact/calendar";
import jquery from "jquery";
import FormFForm from "./formf-form";
import { languageEnum } from "../../common/enums";
import axios from "axios";
window.$ = window.jQuery = jquery;
require("jQuery.print/jQuery.print");

export default class FormFs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formfDetails: [],
      first: 0,
      rows: ROWS,
      loading: true,
      controller: "formfDetails",
      includeProperties: "Patient,Patient.City,Patient.Dist,Patient.Taluka",
      selectedFormF: null,
      language: languageEnum.GUJARATI.value,
    };
    this.repository = new repository();
    this.helper = new helper();
  }
  getFormFDetails = () => {
    const {
      first,
      rows,
      filterString,
      sortString,
      includeProperties,
      controller,
    } = this.state;
    this.repository
      .get(
        controller,
        `take=${rows}&skip=${first}&filter=${filterString}&sort=${sortString}&includeProperties=${includeProperties}`
      )
      .then((res) => {
        res &&
          res.data.map((item) => {
            item.formatedDate = this.helper.formatDateTime(item.date);
            item.formatedLMPDate = this.helper.formatDate(item.lmpDate);
            item.noOfMaleChild = item.children.filter(
              (m) => m.type === 1
            ).length;
            item.noOfFemaleChild = item.children.filter(
              (m) => m.type === 2
            ).length;

            item.patient = {
              value: item.patient.id,
              label: item.patient.fullname,
              fullname: item.patient.fullname,
              age: item.patient.calculatedAge,
              name: item.patient.name,
              firstname: item.patient.firstname,
              middlename: item.patient.middlename,
              fathername: item.patient.fathername,
              lastname: item.patient.lastname,
              address1: item.patient.address1,
              address2: item.patient.address2,
              city: item.patient.city.name,
              district: item.patient.dist.name,
              taluka: item.patient.taluka.name,
              mobile: item.patient.mobile,
            };
            return item;
          });
        this.setState({
          first: first,
          rows: rows,
          totalRecords: res && res.totalCount,
          formfDetails: res && res.data,
          startNo: res && res.startPage,
          endNo: res && res.endPage,
          loading: false,
        });
      });
  };
  componentDidMount = (e) => {
    let multiSortMeta = [];
    const filter = `isDeleted-neq-{${true}}`;
    multiSortMeta.push({ field: "id", order: -1 });
    let sortString = this.helper.generateSortString(multiSortMeta);
    this.setState(
      {
        multiSortMeta: multiSortMeta,
        sortString: sortString,
        filterString: filter,
      },
      () => {
        this.getFormFDetails();
      }
    );
  };
  onPageChange = (e) => {
    this.setState(
      {
        rows: e.rows,
        first: e.first,
        loading: true,
      },
      () => {
        this.getFormFDetails();
      }
    );
  };
  onSort = (e) => {
    const { multiSortMeta } = this.state;
    let SortMetaOld = multiSortMeta
      ? multiSortMeta.filter((item) => item.field !== e.multiSortMeta[0].field)
      : [];
    this.setState(
      {
        multiSortMeta: [e.multiSortMeta[0], ...SortMetaOld],
        loading: true,
      },
      () => {
        const { multiSortMeta } = this.state;
        let sortString = this.helper.generateSortString(multiSortMeta);
        this.setState({ sortString: sortString }, () => {
          setTimeout(() => {
            this.getFormFDetails();
          }, 10);
        });
      }
    );
  };
  onFilter = (e) => {
    this.setState({ filters: e.filters, loading: true });
    const filter = this.helper.generateFilterString(e.filters);
    const operator = filter ? "and" : "";
    let filterString = `isDeleted-neq-{${true}} ${operator} ${filter}`;
    this.setState(
      { first: 0, filterString: filterString, loading: true },
      () => {
        this.getFormFDetails();
      }
    );
  };

  actionTemplate(rowData, column) {
    return (
      <div>
        <button
          type="button"
          className="btn btn-secondary btn-grid mr-2"
          onClick={() => this.onRowEdit(rowData)}
        >
          <i className="fa fa-pencil"></i>
        </button>
        <button
          type="button"
          className="btn btn-info btn-grid mr-2"
          onClick={() => this.onShowFormFPrint(rowData)}
        >
          <i className="fa fa-print"></i>
        </button>
        <button
          type="button"
          className="btn btn-warning btn-grid mr-2"
          onClick={() => this.onShowFormFAutoFill(rowData)}
        >
          <i className="fa fa-file-text-o"></i>
        </button>
        <button
          type="button"
          className="btn btn-danger btn-grid"
          onClick={() => this.onRowDelete(rowData)}
        >
          <i className="fa fa-trash"></i>
        </button>
      </div>
    );
  }
  saveFormF = (updatedFormF, id) => {
    const { formfDetails, totalRecords } = this.state;
    let FormFData = [...formfDetails];
    updatedFormF.patient = updatedFormF.patient && {
      label: updatedFormF.patient.fullname,
      value: updatedFormF.patientId,
      fullname: updatedFormF.patient.fullname,
      firstname: updatedFormF.patient.firstname,
      middlename: updatedFormF.patient.middlename,
      fathername: updatedFormF.patient.fathername,
      lastname: updatedFormF.patient.lastname,
      name: updatedFormF.patient.name,
      age: updatedFormF.patient.calculatedAge,
      address1: updatedFormF.patient.address1,
      address2: updatedFormF.patient.address2,
      city: updatedFormF.patient.city.name,
      district: updatedFormF.patient.dist.name,
      taluka: updatedFormF.patient.taluka.name,
      mobile: updatedFormF.patient.mobile,
    };
    updatedFormF.formatedDate = this.helper.formatDateTime(updatedFormF.date);
    updatedFormF.formatedLMPDate = this.helper.formatDate(updatedFormF.lmpDate);
    updatedFormF.noOfMaleChild = updatedFormF.children.filter(
      (m) => m.type === 1
    ).length;
    updatedFormF.noOfFemaleChild = updatedFormF.children.filter(
      (m) => m.type === 2
    ).length;
    if (!id) {
      FormFData.splice(0, 0, updatedFormF);
    } else {
      let index = FormFData.findIndex((m) => m.id === updatedFormF.id);
      FormFData[index] = updatedFormF;
    }
    this.setState({
      formfDetails: FormFData,
      editDialog: false,
      totalRecords: !id ? totalRecords + 1 : totalRecords,
    });
  };

  onRowDelete = (row) => {
    this.setState({
      deleteDialog: true,
      selectedFormF: Object.assign({}, row),
    });
  };
  onRowUpdateStatus = (row) => {
    if (!row.submitted)
      this.setState({
        formFStatusDialog: true,
        selectedFormF: Object.assign({}, row),
      });
  };
  onRowEdit = (row) => {
    this.setState({
      editDialog: true,
      selectedFormF: Object.assign({}, row),
    });
  };

  onShowFormFPrint = (row) => {
    this.setState({
      pdfDialog: true,
      selectedFormF: Object.assign({}, row),
    });
  };
  onShowFormFAutoFill = (row) => {
    axios.get(`http://localhost:5004/formf-autofill?id=${row.id}`);
  };
  deleteRow = () => {
    const { formfDetails, selectedFormF, isArchive, controller, totalRecords } =
      this.state;
    let flag = isArchive ? false : true;
    this.repository
      .delete(controller, `${selectedFormF.id}?isDeleted=${flag}`)
      .then((res) => {
        this.setState({
          formfDetails: formfDetails.filter(
            (patient) => patient.id !== selectedFormF.id
          ),
          selectedFormF: null,
          deleteDialog: false,
          totalRecords: totalRecords - 1,
        });
      });
  };
  updateFormFStatus = () => {
    const { formfDetails, selectedFormF, controller, totalRecords } =
      this.state;
    let FormFData = [...formfDetails];
    this.repository
      .post(`${controller}/${selectedFormF.id}`, {
        id: selectedFormF.id,
      })
      .then((res) => {
        selectedFormF.submitted = true;
        if (!selectedFormF.id) {
          FormFData.splice(0, 0, selectedFormF);
        } else {
          let index = FormFData.findIndex((m) => m.id === selectedFormF.id);
          FormFData[index] = selectedFormF;
        }
        this.setState({
          formfDetails: FormFData,
          formFStatusDialog: false,
          totalRecords: totalRecords,
        });
      });
  };
  onFilterChange = (event) => {
    this.dt.filter(event.value, event.target.name, "eq");
    this.setState({ [event.target.id]: event.value });
  };
  render() {
    const languageOptions = this.helper.enumToObject(languageEnum);
    const {
      formfDetails,
      totalRecords,
      rows,
      first,
      loading,
      multiSortMeta,
      filters,
      deleteDialog,
      formFStatusDialog,
      isArchive,
      selectedFormF,
      editDialog,
      includeProperties,
      selectedDate,
      pdfDialog,
      startNo,
      endNo,
      language,
    } = this.state;
    let dateFilter = (
      <Calendar
        id="selectedDate"
        name="date"
        value={selectedDate}
        onChange={this.onFilterChange}
        dateFormat="dd/mm/yy"
        monthNavigator={true}
        yearNavigator={true}
        yearRange={HUNDRED_YEAR_RANGE}
        readOnlyInput={true}
        showButtonBar={true}
      />
    );
    const deleteDialogFooter = (
      <div>
        <Button label="Yes" icon="pi pi-check" onClick={this.deleteRow} />
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => this.setState({ deleteDialog: false })}
          className="p-button-secondary"
        />
      </div>
    );
    const deleteformFStatusDialogFooter = (
      <div>
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={this.updateFormFStatus}
        />
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => this.setState({ formFStatusDialog: false })}
          className="p-button-secondary"
        />
      </div>
    );
    let paginatorRight = totalRecords && (
      <div className="m-1">{`Showing ${this.helper.formatAmount(
        startNo
      )} to ${this.helper.formatAmount(endNo)} of ${this.helper.formatAmount(
        totalRecords
      )} records`}</div>
    );
    let declaration = "";
    if (selectedFormF) {
      if (language === languageEnum.GUJARATI.value) {
        declaration = (
          <>
            <p className="mb-0">
              આથી હું નીચે સહી કરનાર શ્રીમતી
              <span className="blank_space" style={{ width: "300px" }}></span>
              જાહેર કરું છું કે સોનોગ્રાફી તપાસ દ્વારા મારે મારા ગર્ભસ્થ બાળકની
              જાતિ (બાબો/બેબી) જાણવી નથી તથા લિંગ પરિક્ષણ માટે હું આ તપાસ કરાવતી
              નથી.
            </p>
            <div className="d-flex mt-2 font-weight-bold">
              <div className="flex-grow-1">
                તારીખ :{" "}
                {this.helper.formatDateWithLanguage(selectedFormF.date, "gu")}
              </div>
              <div>દર્દીની સહી અથવા અંગુઠાનું નિશાન</div>
            </div>
          </>
        );
      } else if (language === languageEnum.HINDI.value) {
        declaration = (
          <>
            <p className="mb-0">
              इसलिए में निम्न दस्तखत करनेवाली श्रीमती{" "}
              <span className="blank_space" style={{ width: "300px" }}></span>{" "}
              घोषित करती हूँ की सोनोग्राफी की जाँच द्वारा मुझे भृण की लिंग/जाति
              जाननी नहीं है| तथा लिंग परीक्षण के लिए मैं यह जाँच करवाती नहीं
              हूँ|
            </p>
            <div className="d-flex mt-2 font-weight-bold">
              <div className="flex-grow-1">
                दिनांक :{" "}
                {this.helper.formatDateWithLanguage(selectedFormF.date, "hi")}
              </div>
              <div>दर्दी की सही एवं अंगूठे का निशान</div>
            </div>
          </>
        );
      } else {
        declaration = (
          <>
            <p className="mb-0">
              I, Mrs{" "}
              <span className="filled_answer">
                {selectedFormF.patient.name}
              </span>{" "}
              declare that by undergoing{" "}
              <span className="filled_answer">ULTRASOUND</span> Prenatal
              Diagnostic Test/Procedure. I do not want to know the sex of my
              foetus.
            </p>
            <div className="d-flex mt-2 font-weight-bold">
              <div className="flex-grow-1">
                Date: {this.helper.formatDate(selectedFormF.date)}
              </div>
              <div>Signature/Thumb</div>
            </div>
          </>
        );
      }
    }
    const nameColumnTemplate = (rowData) => {
      var dotClass = rowData.submitted ? "text-success" : "text-danger";
      return (
        <span>
          <i
            id={`submitted-${rowData.id}`}
            className={`fa fa-circle mr-2 ${dotClass}`}
            onClick={() => this.onRowUpdateStatus(rowData)}
          ></i>
          {rowData.patient.fullname}
        </span>
      );
    };
    return (
      <>
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div className="report-header">Form F Details</div>
              <div>
                {!isArchive && (
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
                )}
              </div>
            </div>

            <DataTable
              value={formfDetails}
              loading={loading}
              responsive={true}
              emptyMessage="No records found"
              onSort={this.onSort}
              sortMode="multiple"
              multiSortMeta={multiSortMeta}
              filters={filters}
              onFilter={this.onFilter}
              ref={(el) => (this.dt = el)}
              paginator={totalRecords ? true : false}
              rowsPerPageOptions={[10, 30, 45]}
              rows={rows}
              lazy={true}
              totalRecords={totalRecords}
              first={first}
              onPage={this.onPageChange}
              paginatorRight={paginatorRight}
              selectionMode="single"
              selection={selectedFormF}
              onSelectionChange={(e) =>
                this.setState({ selectedFormF: e.value })
              }
            >
              <Column
                style={{ width: "90px" }}
                field="id"
                header="Form F Id"
                sortable={true}
                filter={true}
                filterMatchMode="eq"
              />
              <Column
                field="patient.fullname"
                header="Patient's Name"
                sortable={true}
                filter={true}
                filterMatchMode="contains"
                body={nameColumnTemplate}
              />
              <Column
                style={{ width: "180px" }}
                field="formatedDate"
                header="Ultrasound Date"
                sortable={true}
                filter={true}
                filterMatchMode="eq"
                filterElement={dateFilter}
              />
              <Column
                style={{ width: "100px" }}
                field="formatedLMPDate"
                header="LMP Date"
              />
              <Column
                body={this.actionTemplate.bind(this)}
                style={{ textAlign: "center", width: "120px" }}
              />
            </DataTable>
          </div>
        </div>
        <Dialog
          header="Confirmation"
          visible={deleteDialog}
          footer={deleteDialogFooter}
          onHide={() => this.setState({ deleteDialog: false })}
          dismissableMask={true}
        >
          Are you sure you want to delete this item?
        </Dialog>
        <Dialog
          header="Confirmation"
          visible={formFStatusDialog}
          footer={deleteformFStatusDialogFooter}
          onHide={() => this.setState({ formFStatusDialog: false })}
          dismissableMask={true}
        >
          Are you sure you want to confirm to update status?
        </Dialog>
        <Dialog
          header="Edit Form F"
          visible={editDialog}
          onHide={() => this.setState({ editDialog: false })}
          style={{ width: "800px" }}
          dismissableMask={true}
        >
          {editDialog && (
            <FormFForm
              selectedFormF={selectedFormF}
              hideEditDialog={() => this.setState({ editDialog: false })}
              saveFormF={this.saveFormF}
              includeProperties={includeProperties}
            />
          )}
        </Dialog>
        <Dialog
          header="Form F Print"
          visible={pdfDialog}
          onHide={() => this.setState({ pdfDialog: false })}
          className="p-scroll-dialog"
          style={{ width: "950px" }}
          dismissableMask={true}
        >
          {pdfDialog && formfDetails && (
            <>
              <label>Language</label>
              <div className="d-flex">
                {languageOptions &&
                  languageOptions.map((item, i) => {
                    return (
                      <div key={i} className="p-2">
                        <RadioButton
                          inputId={`language${i}`}
                          name="language"
                          value={item.value}
                          onChange={(e) => {
                            this.setState({
                              language: e.target.value,
                            });
                          }}
                          checked={language === item.value}
                        />
                        <label
                          htmlFor={`language${i}`}
                          className="p-radiobutton-label"
                        >
                          {item.label}
                        </label>
                      </div>
                    );
                  })}
              </div>
              <div id="print-div" className="A4 formf-print-container">
                <p className="mb-0 text-right font-weight-bold">
                  Sr No. :<span className="blank_space"></span>
                </p>
                <div className="text-center">
                  <p className="font-weight-bold text-underline mb-0">FORM F</p>
                  <p className="mb-0">
                    [See Provison to section 4(3), Rule 9(4) and Rule 10(1A)]
                  </p>
                  <p className="text-uppercase mb-0">
                    FORM FOR MAINTENANCE OF RECORD IN CASE OF PRENATAL
                    DIAGNOSTIC TEST/PROCEDURE BY GENETIC CLINIC/ULTRASOUND
                    CLINIC/IMAGING CENTRE
                  </p>
                </div>
                <hr className="separator" />
                <h6 className="font-weight-bold mb-0">
                  Section A: To be filled in for all Diagnostic Procedures/Tests
                </h6>
                <ol className=" mb-0">
                  <li key="list1">
                    Name and complete address of Genetic Clinic/Ultrasound
                    Clinic/Imaging centre :{" "}
                    <span className="filled_answer">
                      {selectedFormF.doctorDetail.hospitalName},{" "}
                      {selectedFormF.doctorDetail.address1},{" "}
                      {selectedFormF.doctorDetail.address2},{" "}
                      {selectedFormF.doctorDetail.place}-
                      {selectedFormF.doctorDetail.pincode}, Ta-
                      {selectedFormF.doctorDetail.taluka}, Dist-
                      {selectedFormF.doctorDetail.district}
                    </span>
                  </li>
                  <li key="list2">
                    Registration No(Under PC & PNDT ACT, 1994) :
                    <span className="filled_answer"> NVS/JGC/112</span>
                  </li>
                  <li key="list3">
                    Patient's Name :{"  "}
                    <span className="filled_answer mr-5">
                      {" "}
                      {selectedFormF.patient.name}
                    </span>
                    Age :{" "}
                    <span className="filled_answer">
                      {selectedFormF.patient.age} Year
                    </span>
                  </li>
                  <li key="list4">
                    Total Number of Living children :{" "}
                    <span className="filled_answer mr-5">
                      {selectedFormF.children.length &&
                        selectedFormF.children.length}
                    </span>{" "}
                    Boy :{"  "}
                    <span className="filled_answer mr-5">
                      {selectedFormF.noOfMaleChild &&
                        selectedFormF.noOfMaleChild}
                    </span>
                    Girl :{"  "}
                    <span className="filled_answer">
                      {selectedFormF.noOfFemaleChild &&
                        selectedFormF.noOfFemaleChild}
                    </span>
                    <p className="mb-0">
                      {" "}
                      <span className="mr-3">(a)</span> Number of Living sons
                      with age of each living son(in years & months) :{" "}
                      {selectedFormF &&
                        selectedFormF.children &&
                        selectedFormF.children
                          .filter((m) => m.type === 1)
                          .map((item, i) => {
                            return (
                              <span
                                className="filled_answer"
                                key={`malechild_${item.no}`}
                              >
                                ({i + 1}) {item.ageYr} Yr {item.ageMn} Mn{" "}
                              </span>
                            );
                          })}
                      <span className="filled_answer">
                        {!selectedFormF.children.filter((m) => m.type === 1)
                          .length && "No Applicable"}
                      </span>
                      <br />
                      <span className="mr-3">(b)</span> Number of living
                      Daughters with age of each living daughter (in years of
                      months) :{" "}
                      {selectedFormF &&
                        selectedFormF.children &&
                        selectedFormF.children
                          .filter((m) => m.type === 2)
                          .map((item, i) => {
                            return (
                              <span
                                className="filled_answer"
                                key={`femalechild_${item.no}`}
                              >
                                ({i + 1}) {item.ageYr} Yr {item.ageMn} Mn{" "}
                              </span>
                            );
                          })}
                      <span className="filled_answer">
                        {!selectedFormF.children.filter((m) => m.type === 2)
                          .length && "No Applicable"}
                      </span>
                    </p>
                  </li>
                  <li key="list5">
                    Husband's /wife's /Father's /Mother's Name :{" "}
                    <span className="filled_answer">
                      {`${selectedFormF.patient.middlename} 
                      ${selectedFormF.patient.fathername} ${selectedFormF.patient.lastname}`}
                    </span>
                  </li>
                  <li key="list6">
                    Full postal address of the patient with Contact Number, if
                    any :{" "}
                    <span className="filled_answer">
                      {selectedFormF.patient.address1},{" "}
                      {selectedFormF.patient.address2}{" "}
                      {selectedFormF.patient.address2 && ","}
                      {selectedFormF.patient.city}, Ta-
                      {selectedFormF.patient.taluka}, Dist-
                      {selectedFormF.patient.district}, Mob. :{" "}
                      {selectedFormF.patient.mobile}
                    </span>
                  </li>
                  <li key="list7">
                    <span className="mr-3">(a)</span>
                    Referred by (Full name and address of Doctor(s)/ Genetic
                    Counseling Centre) :
                    <span className="filled_answer"> Not Applicable</span>
                    <br />
                    <span className="mr-3">(b)</span>
                    Self-Referral by Gynaecologist/Radiologist/Registered
                    Medical Practitioner conducting the diagnostic procedures :{" "}
                    <span className="filled_answer">
                      {selectedFormF.doctorDetail.name}, Aastha Hospital,
                      Maternity & Nursing Home,{" "}
                      {selectedFormF.doctorDetail.address1},{" "}
                      {selectedFormF.doctorDetail.address2},{" "}
                      {selectedFormF.doctorDetail.place}-
                      {selectedFormF.doctorDetail.pincode}, Ta-
                      {selectedFormF.doctorDetail.taluka}, Dist-
                      {selectedFormF.doctorDetail.district}
                    </span>
                  </li>
                  <li key="list8">
                    Last menstrual period :{" "}
                    <span className="filled_answer mr-5">
                      {this.helper.formatDate(selectedFormF.lmpDate)}
                    </span>
                    Weeks of pregnancy :{" "}
                    <span className="filled_answer">
                      {this.helper.getWeeksBetweenDates(
                        selectedFormF.lmpDate,
                        selectedFormF.date
                      )}
                    </span>
                  </li>
                </ol>
                <hr className="separator" />
                <h6 className="font-weight-bold mb-0">
                  Section B: To be filled in for performing non-invasive
                  diagnostic Procedures/Tests only
                </h6>
                <ol className="" start="9">
                  <li key="list9">
                    Name of the doctor performing the procedure/s :{" "}
                    <span className="filled_answer">
                      {selectedFormF.doctorDetail.name}
                    </span>
                  </li>
                  <li key="list10">
                    Indication/s for diagnosis procedure (specify with reference
                    to the request made in the referral slip or in a
                    self-referral note ) : <br />
                    {
                      // eslint-disable-next-line
                      FormFDiagnosisOptions.map((item, i) => {
                        if (
                          selectedFormF.diagnosisProcedure.includes(item.value)
                        ) {
                          return (
                            <span
                              key={`diagnosis-${i}`}
                              className="filled_answer"
                            >
                              {item.label}
                              <br />
                            </span>
                          );
                        }
                      })
                    }
                  </li>
                  <li key="list11">
                    Procedures carried out (Non-Invasive) :{" "}
                    <span className="filled_answer">Ultrasound</span>
                  </li>
                  <li key="list12">
                    Date on which declaration of pregnant woman/person was
                    obtained :{" "}
                    <span className="filled_answer">
                      {this.helper.formatDate(selectedFormF.date)}
                    </span>
                  </li>
                  <li key="list13">
                    Date on which procedures carried out :{" "}
                    <span className="filled_answer">
                      {this.helper.formatDate(selectedFormF.date)}
                    </span>
                  </li>
                  <li key="list14">
                    Result of the non-invasive procedure carried out (report in
                    brief) :{" "}
                    <span className="filled_answer">
                      {selectedFormF.diagnosisResult}
                    </span>
                  </li>
                  <li key="list15">
                    The result of pre-natal diagnostic procedures was conveyed
                    to{" "}
                    <span className="filled_answer">
                      {selectedFormF.patient.name}
                    </span>{" "}
                    on{" "}
                    <span className="filled_answer">
                      {this.helper.formatDate(selectedFormF.date)}
                    </span>{" "}
                  </li>
                  <li key="list16">
                    Any indication for MTP as per the abnormality detected in
                    the diagnostic procedures/tests :{" "}
                    <span className="filled_answer">
                      <span className="mr-5">(a) Yes</span>
                      <span className="position-relative">
                        (b)
                        <i
                          className="fa fa-check position-absolute"
                          style={{ left: 0, top: "15px", fontSize: "18px" }}
                        ></i>{" "}
                        No
                      </span>
                    </span>
                  </li>
                </ol>
                <div
                  className="d-flex mt-4 font-weight-bold"
                  style={{ lineHeight: "1.2" }}
                >
                  <div className="flex-grow-1">
                    <div>&#8205;</div>
                    <div>
                      {" "}
                      Date: {this.helper.formatDate(selectedFormF.date)}
                    </div>
                    <div>Place: {selectedFormF.doctorDetail.place}</div>
                  </div>
                  <div>
                    <div>{selectedFormF.doctorDetail.name}</div>
                    <div>M.S (OBS & GYN)</div>
                    <div>Reg. No. G-17879</div>
                  </div>
                </div>
                <hr className="separator" />
                <div className="watermark">
                  <h6 className="font-weight-bold mb-0">
                    Section C: To be filled for performing invasive
                    Procedures/Tests only
                  </h6>
                  <ol className="" start="17">
                    <li key="list17">
                      Name of the doctor/s performing the procedure/s :{" "}
                      <span
                        className="blank_space"
                        style={{ width: "300px" }}
                      ></span>
                    </li>
                    <li key="list18">
                      History of genetic/medical disease in the family
                      (specify)Basis of diagnosis (“Tick" on appropriate basis
                      of diagnosis): (a) Clinical (b) Bio-chemical (c)
                      Cytogenetic (d) other :{" "}
                      <span
                        className="blank_space"
                        style={{ width: "300px" }}
                      ></span>
                    </li>
                    <li key="list19">
                      Indication/s for the diagnosis procedure ("Tick” on
                      appropriate indication/s) A. Previous child/children with:
                      (i) Chromosomal disorders (ii) Metabolic disorders (iii)
                      Congenital anomaly (iv) Mental Disability (v)
                      Haemoglobinopathy (vi) Sex linked disorders(vii) Single
                      gene disorder (viii) Any other (specify) B. Advanced
                      maternal age (35 years) C. Mother/father/sibling has
                      genetic disease (specify) D. Other (specify) :{" "}
                      <span
                        className="blank_space"
                        style={{ width: "20px" }}
                      ></span>
                    </li>
                    <li key="list20">
                      Date on which consent of pregnant woman / person was
                      obtained in Form G prescribed in PC&PNDT Act, 1994 :{" "}
                      <span
                        className="blank_space"
                        style={{ width: "100px" }}
                      ></span>
                    </li>
                    <li key="list21">
                      Invasive procedures carried out (“Tick" on appropriate
                      indication/s) i. Amniocentesis ii. Chorionic Villi
                      aspiration iii. Fetal biopsy iv. Cordocentesis v. Any
                      other (specify) :{" "}
                      <span
                        className="blank_space"
                        style={{ width: "300px" }}
                      ></span>
                    </li>
                    <li key="list22">
                      Any complication/s of invasive procedure(specify) :{" "}
                      <span
                        className="blank_space"
                        style={{ width: "300px" }}
                      ></span>
                    </li>
                    <li key="list23">
                      Additional tests recommended (Please mention if
                      applicable) (i) Chromosomal studies (ii) Biochemical
                      studies (iii) Molecular studies (iv) Pre-implantation
                      gender diagnosis (v) Any other (specify) :{" "}
                      <span
                        className="blank_space"
                        style={{ width: "300px" }}
                      ></span>
                    </li>
                    <li key="list24">
                      Result of the Procedures/ Tests carried out (report in
                      brief of the invasive tests/ procedures carried out) :{" "}
                      <span
                        className="blank_space"
                        style={{ width: "200px" }}
                      ></span>
                    </li>
                    <li key="list25">
                      Date on which procedures carried out :{" "}
                      <span
                        className="blank_space"
                        style={{ width: "300px" }}
                      ></span>
                    </li>
                    <li key="list26">
                      The result of pre-natal diagnostic procedures was conveyed
                      to :{" "}
                      <span
                        className="blank_space"
                        style={{ width: "300px" }}
                      ></span>
                    </li>
                    <li key="list27">
                      Any indication for MTP as per the abnormality detected in
                      the diagnostic procedures/test :{" "}
                      <span
                        className="blank_space"
                        style={{ width: "200px" }}
                      ></span>
                    </li>
                  </ol>
                </div>
                <div
                  className="d-flex font-weight-bold"
                  style={{ lineHeight: "1" }}
                >
                  <div className="flex-grow-1">
                    <div>Date:</div>
                    <div>Place:</div>
                  </div>
                </div>
                <hr className="separator" />
                <h6 className="font-weight-bold mb-0">
                  Section D : Declaration
                </h6>
                <p className="mb-0 font-weight-bold">
                  Declaration of person undergoing Prenatal Dignostic
                  Test/Procedure
                </p>
                {declaration}
                <span className="font-weight-bold">
                  In Case of thumb Impression:
                </span>
                <p className="mb-0">
                  Identified by (Name) :{" "}
                  <span className="filled_answer mr-3">
                    {selectedFormF.relativeName}
                  </span>
                  Age :{" "}
                  <span className="filled_answer mr-3">
                    {selectedFormF.thumbImpression && selectedFormF.relativeAge}
                  </span>
                  Sex :{" "}
                  <span className="filled_answer mr-3">
                    {selectedFormF.thumbImpression &&
                      selectedFormF.relativeGenderName}
                  </span>
                  Relation (if any) :{" "}
                  <span className="filled_answer mr-3">
                    {selectedFormF.relativeRelation}
                  </span>{" "}
                  Contact No. :{" "}
                  <span className="filled_answer mr-3">
                    {selectedFormF.relativeMobile}
                  </span>
                  Address :{" "}
                  <span className="filled_answer mr-3">
                    {selectedFormF.relativeAddress}
                  </span>{" "}
                </p>
                <div className="d-flex mt-0 font-weight-bold">
                  <div className="flex-grow-1">
                    Date: {this.helper.formatDate(selectedFormF.date)}
                  </div>
                  <div>Signature of a person attesting thumb impression</div>
                </div>
                <p className="mb-0 font-weight-bold">
                  Declaration of person conducting Prenatal Dignostic
                  Test/Procedure
                </p>
                <p className="mb-0">
                  I,{" "}
                  <span className="filled_answer">
                    {selectedFormF.doctorDetail.name}
                  </span>{" "}
                  declare that while conducting ultrasonography/image scanning
                  on Mrs.{" "}
                  <span className="filled_answer">
                    {selectedFormF.patient.name}
                  </span>
                  , I have neither detected nor disclosed the sex of her fetus
                  to anybody in any manner.
                </p>
                <div
                  className="d-flex mt-4 font-weight-bold"
                  style={{ lineHeight: "1.2" }}
                >
                  <div className="flex-grow-1">
                    <div>&#8205;</div>
                    <div>
                      {" "}
                      Date: {this.helper.formatDate(selectedFormF.date)}
                    </div>
                    <div>Place: {selectedFormF.doctorDetail.place}</div>
                  </div>
                  <div>
                    <div>{selectedFormF.doctorDetail.name}</div>
                    <div>M.S (OBS & GYN)</div>
                    <div>Reg. No. G-17879</div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn bt-sm btn-secondary"
                  onClick={() => jquery("#print-div").print()}
                >
                  <i className="fa fa-print"></i> Print Invoice
                </button>
              </div>
            </>
          )}
        </Dialog>
      </>
    );
  }
}
