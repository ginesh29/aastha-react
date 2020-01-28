import React, { Component } from 'react';
import { repository } from "../common/repository";
import { helper } from "../common/helpers";
import { Panel } from 'primereact/panel';
import { TabView, TabPanel } from 'primereact/tabview';
import _ from 'lodash';

export default class Statistics extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            loading: true,
        };
        this.repository = new repository();
        this.helper = new helper();
    }
    getStatistics = () =>
    {
        this.repository.get("opds/GetStatistics", `filter=0`, this.messages)
            .then(res =>
            {
                let opdStatistics = _.groupBy(res, "year");
                this.setState({ opdStatistics: opdStatistics })
            })
        this.repository.get("ipds/GetStatistics", `filter=0`, this.messages)
            .then(res =>
            {
                let ipdStatistics = _.groupBy(res, "year");
                this.setState({ ipdStatistics: ipdStatistics })
            })
    }
    componentDidMount = () =>
    {
        this.getStatistics();
    }
    render()
    {
        const { opdStatistics, ipdStatistics, opdActiveTab, ipdActiveTab } = this.state;
        let totalOpdPatient = 0;
        let totalOpdCollection = 0;
        let totalIpdPatient = 0;
        let totalIpdCollection = 0;
        return (
            <div className="row">
                <div className="col-md-6">
                    <Panel header="Opd Statistics" toggleable={true}>
                        <TabView activeIndex={opdActiveTab} onTabChange={(e) => this.setState({ opdActiveTab: e.index })}>
                            {
                                opdStatistics && Object.keys(opdStatistics).reverse().map((year) =>
                                {
                                    totalOpdPatient = opdStatistics[year].reduce((total, item) => total + item.totalPatient, 0);
                                    totalOpdCollection = opdStatistics[year].reduce((total, item) => total + item.totalCollection, 0);
                                    return (
                                        <TabPanel header={year} key={year}>
                                            <div className="row">
                                                <table className="table table-bordered statistics-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Month</th>
                                                            <th>No of Patients </th>
                                                            <th>Total Collection</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            opdStatistics[year].map(item =>
                                                            {
                                                                return (
                                                                    <tr key={item.monthName}>
                                                                        <td>{item.monthName}</td>
                                                                        <td>{item.totalPatient}</td>
                                                                        <td>{this.helper.formatCurrency(item.totalCollection)}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                    <tfoot className="report-footer">
                                                        <tr>
                                                            <td>Total</td>
                                                            <td>{totalOpdPatient}</td>
                                                            <td>{this.helper.formatCurrency(totalOpdCollection)}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </TabPanel>
                                    )
                                })
                            }
                        </TabView>
                    </Panel>
                </div>
                <div className="col-md-6">
                    <Panel header="Ipd Statistics" toggleable={true}>
                        <TabView activeIndex={ipdActiveTab} onTabChange={(e) => this.setState({ ipdActiveTab: e.index })}>
                            {
                                ipdStatistics && Object.keys(ipdStatistics).reverse().map((year) =>
                                {
                                    totalIpdPatient = ipdStatistics[year].reduce((total, item) => total + item.totalPatient, 0);
                                    totalIpdCollection = ipdStatistics[year].reduce((total, item) => total + item.totalCollection, 0);
                                    return (
                                        <TabPanel header={year} key={year}>
                                            <div className="row">
                                                <table className="table table-bordered statistics-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Month</th>
                                                            <th>No of Patients </th>
                                                            <th>Total Collection</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            ipdStatistics[year].map(item =>
                                                            {
                                                                return (
                                                                    <tr key={item.monthName}>
                                                                        <td>{item.monthName}</td>
                                                                        <td>{item.totalPatient}</td>
                                                                        <td>{this.helper.formatCurrency(item.totalCollection)}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                    <tfoot className="report-footer">
                                                        <tr>
                                                            <td>Total</td>
                                                            <td>{totalIpdPatient}</td>
                                                            <td>{this.helper.formatCurrency(totalIpdCollection)}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </TabPanel>
                                    )
                                })
                            }
                        </TabView>
                    </Panel>
                </div>

            </div >
        );
    }
}