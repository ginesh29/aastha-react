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
            opdCurrentYear: new Date().getFullYear(),
            loading: true,
        };
        this.repository = new repository();
        this.helper = new helper();
    }
    getYears = () =>
    {
        const opdFilterString = "date-neq-{01-01-1900}";
        this.repository.get("opds", `filter=${ opdFilterString }&fields=date.year&sort=date desc`, this.messages)
            .then(res =>
            {
                this.setState({ opdYears: res.data })
            })
    }
    getOpds = () =>
    {
        const { opdCurrentYear } = this.state

        const opdFilterString = `date-neq-{01-01-1900} and date.Year-eq-{${ opdCurrentYear - 1 }}`;
        this.repository.get("opds", `filter=${ opdFilterString }&sort=date desc`, this.messages)
            .then(res =>
            {
                let a = _.groupBy(res.data, "date");
                console.log(a)
                // this.setState({ opdYears: res.data })
            })
    }
    componentDidMount = () =>
    {
        this.getYears();
        this.getOpds();
    }
    render()
    {
        const { opdYears } = this.state;
        return (
            <div className="row">
                <div className="col-md-6">
                    <Panel header="Godfather I">
                        <TabView activeIndex={this.state.opdActiveIndex} onTabChange={(e) => this.setState({ opdActiveIndex: e.index })}>
                            {
                                opdYears.map((item) =>
                                {
                                    return (
                                        <TabPanel header={item.Year.toString()} key={item.Year}>
                                            {item.Year}
                                        </TabPanel>
                                    )
                                })
                            }
                        </TabView>
                    </Panel>
                </div>
                {/* <div className="col-md-6">
                    <Panel header="Godfather I">
                        <TabView activeIndex={this.state.ipdActiveIndex} onTabChange={(e) => this.setState({ ipdActiveIndex: e.index })}>
                            {
                                ipdYears.map((item) =>
                                {
                                    return (
                                        <TabPanel header={item.Year.toString()} key={item.Year}>
                                            {item.Year}
                                        </TabPanel>
                                    )
                                })
                            }
                        </TabView>
                    </Panel>
                </div> */}
            </div>
        );
    }
}