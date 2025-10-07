import { Component } from "react";
import InputField from "../shared/input-field";
import { helper } from "../../common/helpers";
import { repository } from "../../common/repository";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import * as Constants from "../../common/constants";
import { lookupTypeEnum } from "../../common/enums";
import jquery from "jquery";
import FormFooterButton from "../shared/form-footer-button";
import { Dropdown } from "primereact/dropdown";

const controller = "patients";
export default class PatientForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.repository = new repository();
    this.helper = new helper();
  }
  getInitialState = () => ({
    formFields: {
      id: "",
      firstname: "",
      middlename: "",
      fathername: null,
      lastname: "",
      age: "",
      city: null,
      mobile: "",
      birthDate: "",
      address1: "",
      address2: "",
      dist: "",
      taluka: null,
    },
    cityText: "",
    distText: "",
    talukaText: "",
    isValidationFired: false,
    validationErrors: {},
    isExist: false,
    loading: false,
    loadingCity: false,
    distOptions: [],
    distId: "",
  });
  getDists = () => {
    let lookupFilter = `type-eq-{${lookupTypeEnum.DIST.code}}`;
    this.repository.get("lookups", `filter=${lookupFilter}`).then((res) => {
      let dists =
        res &&
        res.data &&
        res.data.map(function (item) {
          return { value: item.id, label: item.name };
        });
      this.setState({
        distOptions: dists,
      });
    });
  };

  handleChange = (e, action) => {
    const { isValidationFired, formFields } = this.state;
    jquery("#errors").remove();
    let fields = formFields ?? {};
    if (action)
      fields[action.name] =
        action !== Constants.SELECT2_ACTION_CLEAR_TEXT
          ? e && { value: e.value, label: e.label }
          : null;
    else fields[e.target.name] = e.target.value;

    this.setState({
      formFields: fields,
    });
    if (isValidationFired) this.handleValidation();
  };
  handleChangeDistrict = (e, action) => {
    const { isValidationFired, formFields } = this.state;
    jquery("#errors").remove();
    let fields = formFields ?? {};
    if (action)
      fields[action.name] =
        action !== Constants.SELECT2_ACTION_CLEAR_TEXT
          ? e && { value: e.value, label: e.label }
          : null;
    else fields[e.target.name] = e.target.value;
    fields["taluka"] = null;
    this.setState({
      formFields: fields,
    });
    this.getInitOptions(
      lookupTypeEnum.TALUKA.code,
      "taluka",
      (e && e.value) || 0
    );
    if (isValidationFired) this.handleValidation();
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const {
      id,
      firstname,
      middlename,
      fathername,
      lastname,
      age,
      city,
      mobile,
      birthDate,
      address1,
      address2,
      dist,
      taluka,
    } = this.state.formFields ?? {};
    const {
      hideEditDialog,
      savePatient,
      includeProperties,
      onHidePatientDialog,
    } = this.props;
    if (this.handleValidation()) {
      const patient = {
        id: id || 0,
        firstname: firstname,
        middlename: middlename,
        fathername: fathername,
        lastname: lastname,
        age: age || 0,
        mobile: mobile,
        cityId: city.value,
        birthDate: birthDate ? this.helper.formatDefaultDate(birthDate) : null,
        address1: address1,
        address2: address2,
        distId: dist && dist.value,
        talukaId: taluka && taluka.value,
      };
      this.setState({ loading: true });
      this.repository
        .post(
          `${controller}?includeProperties=${
            includeProperties ? includeProperties : ""
          }`,
          patient
        )
        .then((res) => {
          if (res && !res.errors) {
            setTimeout(() => {
              hideEditDialog && hideEditDialog();
              onHidePatientDialog && onHidePatientDialog();
              savePatient && savePatient(res, patient.id);
              !hideEditDialog && this.handleReset();
            }, 1000);
          }
          res.errors &&
            this.setState({
              loading: false,
              isExist: true,
            });
        });
    }
  };
  handleValidation = (e) => {
    const { firstname, middlename, lastname, age, city, birthDate, mobile } =
      this.state.formFields ?? {};
    let errors = {};
    let isValid = true;
    if (!firstname) {
      isValid = false;
      errors.firstname = "First Name is required";
    }
    if (!middlename) {
      isValid = false;
      errors.middlename = "Middle Name is required";
    }
    if (!lastname) {
      isValid = false;
      errors.lastname = "Last Name is required";
    }
    if (mobile && mobile.length !== 10) {
      isValid = false;
      errors.mobile = "Mobile must be 10 digit";
    }
    if (!age && !birthDate) {
      isValid = false;
      errors.birthDate = "Birth Date is required";
      errors.age = "Age is required";
    }
    if (!city) {
      isValid = false;
      errors.city = "City/Village is required";
    }
    this.setState({
      validationErrors: errors,
      isValidationFired: true,
    });
    return isValid;
  };

  handleReset = (e) => {
    this.setState(this.getInitialState());
  };

  saveCity = () => {
    const { cityText } = this.state;
    let cityError = "";
    let isValid = true;
    if (!cityText) {
      isValid = false;
      cityError = "City/Village is required";
    } else isValid = true;

    this.setState({
      cityError: cityError,
    });
    if (isValid) {
      const lookup = {
        name: cityText,
        type: lookupTypeEnum.CITY.code,
      };
      this.setState({ loadingCity: true });
      this.repository.post("lookups", lookup).then((res) => {
        setTimeout(() => {
          res &&
            this.setState({
              cityText: "",
              cityDialog: false,
              loadingCity: false,
            });
        }, 1000);
      });
    }
  };
  saveDist = () => {
    const { distText } = this.state;
    let distError = "";
    let isValid = true;
    if (!distText) {
      isValid = false;
      distError = "District is required";
    } else isValid = true;

    this.setState({
      distError: distError,
    });
    if (isValid) {
      const lookup = {
        name: distText,
        type: lookupTypeEnum.DIST.code,
      };
      this.setState({ loadingCity: true });
      this.repository.post("lookups", lookup).then((res) => {
        setTimeout(() => {
          res &&
            this.setState({
              distText: "",
              distDialog: false,
              loadingCity: false,
            });
        }, 1000);
      });
    }
  };
  saveTaluka = () => {
    const { talukaText, distId } = this.state;
    let talukaError = "";
    let isValid = true;
    if (!talukaText) {
      isValid = false;
      talukaError = "Taluka is required";
    }
    let distIdError = "";
    if (!distId) {
      isValid = false;
      distIdError = "District is required";
    } else isValid = true;

    this.setState({
      talukaError: talukaError,
      distIdError: distIdError,
    });
    if (isValid) {
      const lookup = {
        name: talukaText,
        type: lookupTypeEnum.TALUKA.code,
        parentId: distId,
      };
      this.setState({ loadingCity: true });
      this.repository.post("lookups", lookup).then((res) => {
        setTimeout(() => {
          res &&
            this.setState({
              talukaText: "",
              talukaDialog: false,
              loadingCity: false,
            });
        }, 1000);
      });
    }
  };
  getInitOptions = (type, label, subtype) => {
    let filter = `type-eq-{${type}} and isdeleted-neq-{true}`;
    if (subtype || subtype === 0)
      filter = `parentId-eq-{${subtype}} and ${filter}`;
    this.repository.get("lookups", `take=15&filter=${filter}`).then((res) => {
      let lookups =
        res &&
        res.data &&
        res.data.map(function (item) {
          return { value: item.id, label: item.name };
        });
      this.setState({
        [`${label}InitialOptions`]: lookups,
      });
    });
  };
  componentDidMount = () => {
    jquery("#errors").remove();
    const { selectedPatient } = this.props;
    if (selectedPatient) {
      selectedPatient.birthDate =
        selectedPatient.birthDate && new Date(selectedPatient.birthDate);
      selectedPatient.age = selectedPatient.birthDate
        ? this.helper.calculateAge(selectedPatient.birthDate)
        : selectedPatient.age;
    }
    this.setState({
      formFields: selectedPatient,
    });
    this.getInitOptions(lookupTypeEnum.CITY.code, "city");
    setTimeout(() => {
      this.getInitOptions(lookupTypeEnum.DIST.code, "dist");
    }, 500);
    setTimeout(() => {
      let distId = selectedPatient ? selectedPatient.distId : 0;
      distId = distId ? distId : 0;
      this.getInitOptions(lookupTypeEnum.TALUKA.code, "taluka", distId);
    }, 1000);
  };
  render() {
    const {
      id,
      firstname,
      middlename,
      fathername,
      lastname,
      age,
      city,
      mobile,
      birthDate,
      address1,
      address2,
      dist,
      taluka,
    } = this.state.formFields ?? {};
    const {
      cityDialog,
      cityText,
      cityError,
      loading,
      loadingCity,
      distText,
      talukaText,
      distId,
      distIdError,
      distError,
      talukaError,
      distDialog,
      talukaDialog,
      distOptions,
      cityInitialOptions,
      distInitialOptions,
      talukaInitialOptions,
    } = this.state;
    let selectedDistId =
      (this.state &&
        this.state.formFields &&
        this.state.formFields.dist &&
        this.state.formFields.dist.value) ||
      dist ||
      0;
    let cityDialogFooter = (
      <div className="ui-dialog-buttonpane p-clearfix">
        <button
          className="btn btn-secondary"
          onClick={(e) => this.setState({ cityDialog: false })}
        >
          Close
        </button>
        <button
          className="btn btn-info"
          onClick={this.saveCity}
          disabled={loadingCity}
        >
          {loadingCity ? "Please wait" : "Save"}
          {loadingCity && <i className="fa fa-spinner fa-spin ml-2"></i>}
        </button>
      </div>
    );
    let distDialogFooter = (
      <div className="ui-dialog-buttonpane p-clearfix">
        <button
          className="btn btn-secondary"
          onClick={(e) => this.setState({ distDialog: false })}
        >
          Close
        </button>
        <button
          className="btn btn-info"
          onClick={this.saveDist}
          disabled={loadingCity}
        >
          {loadingCity ? "Please wait" : "Save"}
          {loadingCity && <i className="fa fa-spinner fa-spin ml-2"></i>}
        </button>
      </div>
    );
    let talukaDialogFooter = (
      <div className="ui-dialog-buttonpane p-clearfix">
        <button
          className="btn btn-secondary"
          onClick={(e) => this.setState({ talukaDialog: false })}
        >
          Close
        </button>
        <button
          className="btn btn-info"
          onClick={this.saveTaluka}
          disabled={loadingCity}
        >
          {loadingCity ? "Please wait" : "Save"}
          {loadingCity && <i className="fa fa-spinner fa-spin ml-2"></i>}
        </button>
      </div>
    );
    return (
      <>
        <div id="validation-message"></div>
        <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
          <div className="row">
            <div className="col">
              <InputField
                name="firstname"
                title="First Name"
                value={firstname || ""}
                onChange={this.handleChange}
                onInput={this.helper.toSentenceCase}
                {...this.state}
              />
            </div>
            <div className="col">
              <InputField
                name="middlename"
                title="Middle Name"
                value={middlename || ""}
                onChange={this.handleChange}
                onInput={this.helper.toSentenceCase}
                {...this.state}
              />
            </div>
            <div className="col">
              <InputField
                name="fathername"
                title="Father Name"
                value={fathername || ""}
                onChange={this.handleChange}
                onInput={this.helper.toSentenceCase}
                {...this.state}
              />
            </div>
            <div className="col">
              <InputField
                name="lastname"
                title="Last Name"
                value={lastname || ""}
                onChange={this.handleChange}
                onInput={this.helper.toSentenceCase}
                {...this.state}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <InputField
                name="age"
                title="Age"
                value={age || ""}
                onChange={this.handleChange}
                {...this.state}
                keyfilter="pint"
                maxLength="2"
                className="text-right"
              />
            </div>
            <div className="col-md-4">
              <InputField
                name="birthDate"
                title="Birth Date"
                value={birthDate || ""}
                onChange={(e) => {
                  this.handleChange(e);
                  var calculatedAge = this.helper.calculateAge(e.value);
                  var fields = this.state.formFields;
                  fields.age = calculatedAge;
                  this.setState({
                    formFields: fields,
                  });
                }}
                {...this.state}
                controlType="datepicker"
                groupIcon="fa-calendar"
                readOnly={false}
              />
            </div>
            <div className="col-md-4">
              <InputField
                name="mobile"
                title="Mobile"
                value={mobile || ""}
                onChange={this.handleChange}
                {...this.state}
                keyfilter="pint"
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <InputField
                name="address1"
                title="Address Line 1"
                value={address1 || ""}
                onChange={this.handleChange}
                onInput={this.helper.toSentenceCase}
                {...this.state}
              />
            </div>
            <div className="col">
              <InputField
                name="address2"
                title="Address Line 2"
                value={address2 || ""}
                onChange={this.handleChange}
                onInput={this.helper.toSentenceCase}
                {...this.state}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <InputField
                name="city"
                title="City/Village"
                value={city || ""}
                onChange={this.handleChange}
                className="p-select2"
                onCreateOption={() =>
                  this.setState({
                    cityDialog: true,
                    cityText: cityText,
                    cityError: "",
                  })
                }
                {...this.state}
                controlType="select2"
                defaultOptions={cityInitialOptions}
                loadOptions={(e, callback) =>
                  this.helper.LookupOptions(
                    e,
                    callback,
                    lookupTypeEnum.CITY.code
                  )
                }
                onInputChange={(e) => {
                  e &&
                    this.setState({
                      cityText: this.helper.toSentenceCase(e),
                    });
                }}
              />
            </div>
            <div className="col-md-4">
              <InputField
                name="dist"
                title="District"
                value={dist || ""}
                onChange={this.handleChangeDistrict}
                className="p-select2"
                onCreateOption={() =>
                  this.setState({
                    distDialog: true,
                    distText: distText,
                    distError: "",
                  })
                }
                {...this.state}
                controlType="select2"
                defaultOptions={distInitialOptions}
                loadOptions={(e, callback) =>
                  this.helper.LookupOptions(
                    e,
                    callback,
                    lookupTypeEnum.DIST.code
                  )
                }
                onInputChange={(e) => {
                  e &&
                    this.setState({
                      distText: this.helper.toSentenceCase(e),
                    });
                }}
              />
            </div>
            <div className="col-md-4">
              <InputField
                name="taluka"
                title="Taluka"
                value={taluka || ""}
                onChange={this.handleChange}
                className="p-select2"
                onCreateOption={() =>
                  this.setState({
                    talukaDialog: true,
                    talukaText: talukaText,
                    talukaError: "",
                  })
                }
                {...this.state}
                controlType="select2"
                defaultOptions={talukaInitialOptions}
                loadOptions={(e, callback) =>
                  this.helper.LookupOptions(
                    e,
                    callback,
                    lookupTypeEnum.TALUKA.code,
                    selectedDistId
                  )
                }
                onInputChange={(e) => {
                  e &&
                    this.setState({
                      talukaText: this.helper.toSentenceCase(e),
                    });
                }}
              />
            </div>
          </div>
          <FormFooterButton showReset={!id} loading={loading} />
        </form>
        <Dialog
          header={Constants.ADD_CITY_TITLE}
          footer={cityDialogFooter}
          visible={cityDialog}
          onHide={() => this.setState({ cityDialog: false })}
          baseZIndex={0}
          dismissableMask={true}
        >
          {cityDialog && (
            <div className="form-group">
              <div className="row">
                <div className="col-md-12">
                  <InputText
                    name="cityText"
                    value={cityText}
                    placeholder="Enter City/Village"
                    onChange={(e) =>
                      this.setState({
                        cityText: e.target.value,
                        cityError: "",
                      })
                    }
                    className={cityError ? "error" : ""}
                    style={{ width: "100%" }}
                  />
                  <span className="error">{cityError}</span>
                </div>
              </div>
            </div>
          )}
        </Dialog>
        <Dialog
          header="Add District"
          footer={distDialogFooter}
          visible={distDialog}
          onHide={() => this.setState({ distDialog: false })}
          baseZIndex={0}
          dismissableMask={true}
        >
          {distDialog && (
            <div className="form-group">
              <div className="row">
                <div className="col-md-12">
                  <InputText
                    name="distText"
                    value={distText}
                    placeholder="Enter District"
                    onChange={(e) =>
                      this.setState({
                        distText: e.target.value,
                        distError: "",
                      })
                    }
                    className={distError ? "error" : ""}
                    style={{ width: "100%" }}
                  />
                  <span className="error">{distError}</span>
                </div>
              </div>
            </div>
          )}
        </Dialog>
        <Dialog
          header="Add Taluka"
          footer={talukaDialogFooter}
          visible={talukaDialog}
          onHide={() => this.setState({ talukaDialog: false })}
          onShow={() => {
            setTimeout(() => {
              this.getDists();
            }, 1000);
          }}
          baseZIndex={0}
          dismissableMask={true}
        >
          {talukaDialog && (
            <>
              <div className="form-group">
                <Dropdown
                  name="distId"
                  title="District"
                  options={distOptions}
                  placeholder={"Select District"}
                  value={distId || null}
                  onChange={(e) =>
                    this.setState({
                      distId: e.target.value,
                      distIdError: "",
                    })
                  }
                  showClear={true}
                  style={{ width: "100%" }}
                />
                <span className="error">{distIdError}</span>
              </div>
              <div className="form-group">
                <InputText
                  name="talukaText"
                  value={talukaText}
                  placeholder="Enter Taluka"
                  onChange={(e) =>
                    talukaText &&
                    this.setState({
                      talukaText: e.target.value,
                      talukaError: "",
                    })
                  }
                  className={talukaError ? "error" : ""}
                  style={{ width: "100%" }}
                />
                <span className="error">{talukaError}</span>
              </div>
            </>
          )}
        </Dialog>
      </>
    );
  }
}
