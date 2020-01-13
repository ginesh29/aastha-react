import React, { Component } from 'react';
import { Messages } from 'primereact/messages';
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import _ from 'lodash';

let patientCount = 0;
let consultChargeTotal = 0;
let usgChargeTotal = 0;
let uptChargeTotal = 0;
let injectionChargeTotal = 0;
let otherChargeTotal = 0;
let amountChargeTotal = 0;

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
                    let totalCharge = Number(item.consultCharge) + Number(item.usgCharge) + Number(item.uptCharge) + Number(item.injectionCharge) + Number(item.otherCharge);
                    item.totalCharge = totalCharge > 0 && totalCharge;
                    return item;
                });
                res.data = _.groupBy(res.data, "formatedOpdDate")
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
        const month = this.helper.getMonthFromDate();
        const year = this.helper.getYearFromDate();
        // const date = this.helper.formatDate("09/03/2018", "en-US");
        // console.log(date);
        const filter = `Date.Month-equals-{${ month }} and Date.Year-equals-{${ year }}`
        this.setState({ filterString: filter }, () =>
        {
            this.getOpds();
        })
    }

    render()
    {
        const { opds } = this.state;
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
                            Object.keys(opds).map((item, index) =>
                            {
                                let opdDate = item;
                                let opd = opds[item]
                                let patientGroupCount = opd.length

                                let consultGroupTotal = opds[item].reduce((total, item) => total + Number(item.consultCharge), 0)
                                let usgGroupTotal = opds[item].reduce((total, item) => total + Number(item.usgCharge), 0)
                                let uptGroupTotal = opds[item].reduce((total, item) => total + Number(item.uptCharge), 0)
                                let injectionGroupTotal = opds[item].reduce((total, item) => total + Number(item.injectionCharge), 0)
                                let otherGroupTotal = opds[item].reduce((total, item) => total + Number(item.otherCharge), 0)
                                let amountGroupTotal = opds[item].reduce((total, item) => total + Number(item.totalCharge), 0)

                                patientCount = patientCount + patientGroupCount;
                                consultChargeTotal = consultChargeTotal + consultGroupTotal;
                                usgChargeTotal = usgChargeTotal + usgGroupTotal;
                                uptChargeTotal = uptChargeTotal + uptGroupTotal;
                                injectionChargeTotal = injectionChargeTotal + injectionGroupTotal;
                                otherChargeTotal = otherChargeTotal + otherGroupTotal;
                                amountChargeTotal = amountChargeTotal + amountGroupTotal;
                                return (
                                    <React.Fragment key={`fragement${ index }`}>
                                        <tr className="report-group-title">
                                            <td colSpan="4" className="text-center">Date: {opdDate}</td>
                                            <td colSpan="6" className="text-center">{patientGroupCount} Patients</td>
                                        </tr>
                                        {
                                            opd.map((subitem, i) =>
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
                                            <td className="text-right">{consultGroupTotal}</td>
                                            <td className="text-right">{usgGroupTotal}</td>
                                            <td className="text-right">{uptGroupTotal}</td>
                                            <td className="text-right">{injectionGroupTotal}</td>
                                            <td className="text-right">{otherGroupTotal}</td>
                                            <td className="text-right">{amountGroupTotal}</td>
                                        </tr>

                                    </React.Fragment>
                                )
                            })
                        }
                    </tbody>
                    <tfoot className="report-footer">
                        {opds && opds.length ?
                            (
                                <tr>
                                    <td colSpan="11" className="text-left">No Record Found</td>
                                </tr>
                            ) :
                            (
                                <tr className="report-group-title">
                                    <td colSpan="3">{patientCount} Patients</td>
                                    <td className="text-right">Grand Total</td>
                                    <td>{consultChargeTotal}</td>
                                    <td>{usgChargeTotal}</td>
                                    <td>{uptChargeTotal}</td>
                                    <td>{injectionChargeTotal}</td>
                                    <td>{otherChargeTotal}</td>
                                    <td>{amountChargeTotal}</td>
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
                                Object.keys(opds).map((item, index) =>
                                {
                                    let opdDate = item;
                                    let opd = opds[item]
                                    let patientGroupCount = opd.length
                                    let amountGroupTotal = opds[item].reduce((total, item) => total + Number(item.totalCharge), 0)
                                    return (
                                        <tr key={`summaryRow${ index }`}>
                                            <td>{opdDate}</td>
                                            <td className="text-right">{patientGroupCount}</td>
                                            <td className="text-right">{amountGroupTotal}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot className="report-footer">
                            {opds && opds.length ?
                                (
                                    <tr>
                                        <td colSpan="11" className="text-left">No Record Found</td>
                                    </tr>
                                ) :
                                (
                                    <tr className="report-group-title">
                                        <td>Grand Total</td>
                                        <td className="text-right">{patientCount}</td>
                                        <td className="text-right">{amountChargeTotal}</td>
                                    </tr>
                                )}
                        </tfoot>
                    </table>
                </OverlayPanel>
            </>
        );
    }
}
