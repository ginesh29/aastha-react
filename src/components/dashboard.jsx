import React from "react";
import { repository } from "../common/repository";
import { helper } from "../common/helpers";
import { TODAY_DATE } from "../common/constants";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      controller: "statistics",
    };
    this.repository = new repository();
    this.helper = new helper();
  }
  getStatistics = (year) => {
    const { controller } = this.state;
    this.repository
      .get(`${controller}/GetPatientStatistics`, `year=${year}`)
      .then((res) => {
        this.setState({
          patientStatistics: res && res.patients,
          opdStatistics: res && res.opds,
          ipdStatistics: res && res.ipds,
        });
      });
  };
  componentDidMount = () => {
    // localStorage.setItem("token", null);
    const year = this.helper.getYearFromDate(TODAY_DATE);
    this.setState({ year: year }, () => {
      this.getStatistics(year);
    });
  };
  render() {
    const month = Number(this.helper.getMonthFromDate(TODAY_DATE));
    const { patientStatistics, opdStatistics, ipdStatistics } = this.state;
    const totalPatients =
      patientStatistics &&
      patientStatistics.reduce((total, item) => total + item.totalPatient, 0);
    const totalOpds =
      opdStatistics &&
      opdStatistics.reduce((total, item) => total + item.totalPatient, 0);
    const totalIpds =
      ipdStatistics &&
      ipdStatistics.reduce((total, item) => total + item.totalPatient, 0);

    const currentMonthPatients =
      patientStatistics &&
      patientStatistics
        .filter((m) => m.month === month)
        .reduce((total, item) => total + item.totalPatient, 0);
    const currentMonthOpds =
      opdStatistics &&
      opdStatistics
        .filter((m) => m.month === month)
        .reduce((total, item) => total + item.totalPatient, 0);
    const currentMonthIpds =
      ipdStatistics &&
      ipdStatistics
        .filter((m) => m.month === month)
        .reduce((total, item) => total + item.totalPatient, 0);
    const currentYearPatients =
      patientStatistics &&
      patientStatistics.reduce((total, item) => total + item.totalPatient, 0);
    const currentYearOpds =
      opdStatistics &&
      opdStatistics.reduce((total, item) => total + item.totalPatient, 0);
    const currentYearIpds =
      ipdStatistics &&
      ipdStatistics.reduce((total, item) => total + item.totalPatient, 0);
    return (
      <div className="card">
        <div className="card-body">
          {
            <div className="row">
              <div className="col-md-4">
                <div className="tile-stats tile-red">
                  <div className="icon">
                    <i className="fa fa-users"></i>
                  </div>
                  <div className="num">{totalPatients}</div>
                  <h3>Registered Patients</h3>
                  <p>Current Month Patients : {currentMonthPatients}</p>
                  <p>Current Year Patients : {currentYearPatients}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="tile-stats tile-green">
                  <div className="icon">
                    <i className="fa fa-bar-chart"></i>
                  </div>
                  <div className="num">{totalOpds}</div>
                  <h3>Opd Patients</h3>
                  <p>Current Month Opd Patients : {currentMonthOpds}</p>
                  <p>Current Year Opd Patients : {currentYearOpds}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="tile-stats tile-aqua">
                  <div className="icon">
                    <i className="fa fa-envelope"></i>
                  </div>
                  <div className="num">{totalIpds}</div>
                  <h3>Ipd Patients</h3>
                  <p>Current Month Ipd Patients : {currentMonthIpds}</p>
                  <p>Current Year Ipd Patients : {currentYearIpds}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}
