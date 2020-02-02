import React from 'react';
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
    getStatistics = () => {
        const { controller } = this.state;
        this.repository.get(`${controller}/GetPatientStatistics`, `filter=0`)
            .then(res => {
                this.setState({
                    patientStatistics: res && res.patients,
                    opdStatistics: res && res.opds,
                    ipdStatistics: res && res.ipds
                })
            })
    }
    componentDidMount = () => {
        this.getStatistics();
    }
    render() {
        const month = Number(this.helper.getMonthFromDate(TODAY_DATE));
        const year = this.helper.getYearFromDate(TODAY_DATE);
        const { patientStatistics, opdStatistics, ipdStatistics } = this.state;
        const totalPatients = patientStatistics && patientStatistics.reduce((total, item) => total + item.totalPatient, 0)
        const totalOpds = opdStatistics && opdStatistics.reduce((total, item) => total + item.totalPatient, 0)
        const totalIpds = ipdStatistics && ipdStatistics.reduce((total, item) => total + item.totalPatient, 0)

        const currentMonthPatients = patientStatistics && patientStatistics.filter(m => m.year === year && m.month === month).reduce((total, item) => total + item.totalPatient, 0)
        const currentMonthOpds = opdStatistics && opdStatistics.filter(m => m.year === year && m.month === month).reduce((total, item) => total + item.totalPatient, 0)
        const currentMonthIpds = ipdStatistics && ipdStatistics.filter(m => m.year === year && m.month === month).reduce((total, item) => total + item.totalPatient, 0)
        const currentYearPatients = patientStatistics && patientStatistics.filter(m => m.year === year).reduce((total, item) => total + item.totalPatient, 0)
        const currentYearOpds = opdStatistics && opdStatistics.filter(m => m.year === year).reduce((total, item) => total + item.totalPatient, 0)
        const currentYearIpds = ipdStatistics && ipdStatistics.filter(m => m.year === year).reduce((total, item) => total + item.totalPatient, 0)
        return (
            <div className="panel">
                <div className="panel-body">
                    {
                        <div className="row">
                            <div className="col-md-4">
                                <div className="tile-stats tile-red">
                                    <div className="icon"><i className="fa fa-users"></i></div>
                                    <div className="num">{totalPatients}</div>
                                    <h3>Registered Patients</h3>
                                    <p>Current Month Patients {currentMonthPatients}</p>
                                    <p>Current Year Patients {currentYearPatients}</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="tile-stats tile-green">
                                    <div className="icon"><i className="fa fa-bar-chart"></i></div>
                                    <div className="num">{totalOpds}</div>
                                    <h3>OPD Patients</h3>
                                    <p>Current Month OPD Patients {currentMonthOpds}</p>
                                    <p>Current Year OPD Patients {currentYearOpds}</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="tile-stats tile-aqua">
                                    <div className="icon"><i className="fa fa-envelope"></i></div>
                                    <div className="num">{totalIpds}</div>
                                    <h3>IPD Patients</h3>
                                    <p>Current Month IPD Patients {currentMonthIpds}</p>
                                    <p>Current Year IPD Patients {currentYearIpds}</p>
                                </div>
                            </div>
                        </div>
                    }
                </div >
            </div >
        )
    }
}