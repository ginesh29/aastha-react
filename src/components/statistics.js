import React, { Component } from 'react';
import { repository } from "../common/repository";
import { helper } from "../common/helpers";
import { Panel } from 'primereact/panel';
import { TabView, TabPanel } from 'primereact/tabview';
import _ from 'lodash';

export default class Statistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
        this.repository = new repository();
        this.helper = new helper();
    }
    // getYears = () => {
    //     const opdFilterString = "date-neq-{01-01-1900}";
    //     this.repository.get("opds", `filter=${opdFilterString}&fields=date.year&sort=date desc`, this.messages)
    //         .then(res => {
    //             this.setState({ opdYears: res.data })
    //         })
    // }
    getStatistics = () => {
        const opdFilterString = `date-neq-{01-01-1900}`;
        this.repository.get("opds/GetStatistics", `filter=${opdFilterString}`, this.messages)
            .then(res => {
                let opdStatistics = _.groupBy(res, "year");
                this.setState({ opdStatistics: opdStatistics })
            })
    }
    componentDidMount = () => {
        this.getStatistics();
    }
    render() {
        const { opdStatistics, opdActiveIndex } = this.state;
        return (
            <div className="row">
                <div className="col-md-6">
                    <Panel header="Opd Statistics">
                        <TabView activeIndex={opdActiveIndex} onTabChange={(e) => this.setState({ opdActiveIndex: e.index })}>
                            {
                                opdStatistics && Object.keys(opdStatistics).map((year) => {
                                    return (
                                        <TabPanel header={year}>
                                            <div className="row">
                                                <table class="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>Month</th>
                                                            <th>No of Patients </th>
                                                            <th>Total Collection</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            opdStatistics[year].map(item => {
                                                                return (
                                                                    <tr>
                                                                        <td>{item.monthName}</td>
                                                                        <td>{item.totalPatient}</td>
                                                                        <td>{item.totalCollection}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td>Total</td>
                                                            <td>5610</td>
                                                            <td>1612930</td>
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