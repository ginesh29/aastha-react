import React, { Component } from 'react';
import { Messages } from 'primereact/messages';
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import _ from 'lodash';

export default class OpdReport extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            opds: [],
            loading: true,
            filterString: "",
            sortString: "id asc",
            controller: "opds",
            includeProperties: "Patient",
        };
        this.repository = new repository();
        this.helper = new helper();
    }
    getOpds = () =>
    {
        const { first, rows, filterString, sortString, includeProperties, controller } = this.state;
        return this.repository.get(controller, `filter=${ filterString }&sort=${ sortString }&includeProperties=${ includeProperties }`, this.messages)
            .then(res =>
            {
                res && res.data.map(item =>
                {
                    item.consultCharge = item.consultCharge ? item.consultCharge : "";
                    item.usgCharge = item.usgCharge ? item.usgCharge : "";
                    item.uptCharge = item.uptCharge ? item.uptCharge : "";
                    item.injectionCharge = item.injectionCharge ? item.injectionCharge : "";
                    item.otherCharge = item.otherCharge ? item.otherCharge : "";
                    item.formatedOpdDate = this.helper.formatDate(item.date);
                    item.fullname = item.patient.fullname
                    item.totalCharge = Number(item.consultCharge) + Number(item.usgCharge) + Number(item.uptCharge) + Number(item.injectionCharge) + Number(item.otherCharge);
                    return item;
                });
                this.setState({
                    first: first,
                    rows: rows,
                    totalRecords: res && res.totalCount,
                    opds: res && res.data,
                    loading: false
                });
            })
    }
    componentDidMount = (e) =>
    {
        const month = 9;// this.helper.getMonthFromDate();
        const year = 2018;// this.helper.getYearFromDate();
        // const startDate = this.helper.formatDate("09/03/2018", "en-US");
        // const endDate = this.helper.formatDate("09/04/2018", "en-US");
        //const filter = `Date-gte-{${ startDate }} and Date-lte-{${ endDate }}`
        const filter = `Date.Month-eq-{${ month }} and Date.Year-eq-{${ year }}`
        this.setState({ filterString: filter }, () =>
        {
            this.getOpds();
        })
    }
    render()
    {
        const { opds } = this.state;
        let opdGroupByDate = _.groupBy(opds, "formatedOpdDate");
        let opdData = _.map(opdGroupByDate, (items, key) => 
        {
            let result = {};
            result.opdDate = key;
            result.data = items;
            result.count = items.length;
            result.consultCharge = items.reduce((total, item) => total + Number(item.consultCharge), 0);
            result.usgCharge = items.reduce((total, item) => total + Number(item.usgCharge), 0);
            result.uptCharge = items.reduce((total, item) => total + Number(item.uptCharge), 0);
            result.injectionCharge = items.reduce((total, item) => total + Number(item.injectionCharge), 0);
            result.otherCharge = items.reduce((total, item) => total + Number(item.otherCharge), 0);
            result.totalCharge = items.reduce((total, item) => total + Number(item.totalCharge), 0);
            return result;
        });
        const opdCount = opdData.reduce((total, item) => total + Number(item.count), 0);
        const consultChargeTotal = opdData.reduce((total, item) => total + Number(item.consultCharge), 0);
        const usgChargeTotal = opdData.reduce((total, item) => total + Number(item.usgCharge), 0);
        const uptChargeTotal = opdData.reduce((total, item) => total + Number(item.uptCharge), 0);
        const injectionChargeTotal = opdData.reduce((total, item) => total + Number(item.injectionCharge), 0);
        const otherChargeTotal = opdData.reduce((total, item) => total + Number(item.otherCharge), 0);
        const amountChargeTotal = opdData.reduce((total, item) => total + Number(item.totalCharge), 0);
        return (
            <>
                <Messages ref={(el) => this.messages = el} />
                <Button type="button" label="Toggle" onClick={(e) => this.op.toggle(e)} />
                <table className="table table-bordered reportTable">
                    <thead>
                        <tr>
                            <th>Invoice No</th>
                            <th>OPD Id</th>
                            <th>Patient's Name</th>
                            <th>Type</th>
                            <th>Cons</th>
                            <th>USG</th>
                            <th>UPT</th>
                            <th>Inj</th>
                            <th>Other</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            opdData.map((items, key) =>
                            {
                                return (
                                    <React.Fragment key={`fragement${ key }`}>
                                        <tr className="report-group-title">
                                            <td colSpan="4" className="text-center">Date: {items.opdDate}</td>
                                            <td colSpan="6" className="text-center">{items.count} Patients</td>
                                        </tr>
                                        {
                                            items.data.map((subitem) =>
                                            {
                                                return (
                                                    <tr key={`subitem${ subitem.id }`}>
                                                        <td>{subitem.id}</td>
                                                        <td>{subitem.invoiceNo}</td>
                                                        <td>{subitem.fullname}</td>
                                                        <td>{subitem.caseTypeName}</td>
                                                        <td className="text-right">{subitem.consultCharge ? subitem.consultCharge : 0}</td>
                                                        <td className="text-right">{subitem.usgCharge ? subitem.usgCharge : 0}</td>
                                                        <td className="text-right">{subitem.uptCharge ? subitem.uptCharge : 0}</td>
                                                        <td className="text-right">{subitem.injectionCharge ? subitem.injectionCharge : 0}</td>
                                                        <td className="text-right">{subitem.otherCharge ? subitem.otherCharge : 0}</td>
                                                        <td className="text-right">{subitem.totalCharge ? subitem.totalCharge : 0}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        <tr className="report-group-title">
                                            <td colSpan="3"></td>
                                            <td className="text-right">Total</td>
                                            <td className="text-right">{items.consultCharge}</td>
                                            <td className="text-right">{items.usgCharge}</td>
                                            <td className="text-right">{items.uptCharget}</td>
                                            <td className="text-right">{items.injectionCharge}</td>
                                            <td className="text-right">{items.otherCharge}</td>
                                            <td className="text-right">{items.totalCharge}</td>
                                        </tr>
                                    </React.Fragment>
                                )
                            })
                        }
                    </tbody>
                    <tfoot className="report-footer">
                        {opdData && opdData.length ?
                            (
                                <tr className="report-group-title">
                                    <td colSpan="3">{opdCount} Patients</td>
                                    <td className="text-right">Grand Total</td>
                                    <td className="text-right">{consultChargeTotal}</td>
                                    <td className="text-right">{usgChargeTotal}</td>
                                    <td className="text-right">{uptChargeTotal}</td>
                                    <td className="text-right">{injectionChargeTotal}</td>
                                    <td className="text-right">{otherChargeTotal}</td>
                                    <td className="text-right">{amountChargeTotal}</td>
                                </tr>

                            ) :
                            (
                                <tr>
                                    <td colSpan="11" className="text-left">No Record Found</td>
                                </tr>
                            )}
                    </tfoot>
                </table>
                <OverlayPanel ref={(el) => this.op = el}>
                    <label> Opd Report Summary</label>
                    <table className="table table-bordered reportTable">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>No of Patients</th>
                                <th>Total Collection</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                opdData.map((items, index) =>
                                {
                                    return (
                                        <tr key={`summaryRow${ index }`}>
                                            <td>{items.opdDate}</td>
                                            <td className="text-right">{items.count}</td>
                                            <td className="text-right">{items.totalCharge}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot className="report-footer">
                            {opdData && opdData.length ?
                                (
                                    <tr className="report-group-title">
                                        <td>Grand Total</td>
                                        <td className="text-right">{opdCount}</td>
                                        <td className="text-right">{amountChargeTotal}</td>
                                    </tr>
                                ) :
                                (
                                    <tr>
                                        <td colSpan="11" className="text-left">No Record Found</td>
                                    </tr>
                                )}
                        </tfoot>
                    </table>
                </OverlayPanel>
            </>
        );
    }
}
