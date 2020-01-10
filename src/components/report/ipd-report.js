import React, { Component } from 'react';
import { Messages } from 'primereact/messages';
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { lookupTypeEnum } from "../../common/enums";
import _ from 'lodash';
import shortid from 'shortid';

let patientCount = 0;
let consultChargeTotal = 0;
let usgChargeTotal = 0;
let uptChargeTotal = 0;
let injectionChargeTotal = 0;
let otherChargeTotal = 0;
let amountChargeTotal = 0;

export default class IpdReport extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            ipds: [],
            loading: true,
            filterString: "",
            sortString: "id asc",
            controller: "ipds",
            includeProperties: "Patient,Charges",
        };
        this.repository = new repository();
        this.helper = new helper();
    }
    getIpds = () =>
    {
        const { first, rows, filterString, sortString, includeProperties, controller } = this.state;
        return this.repository.get(controller, `filter=${ filterString }&sort=${ sortString }&includeProperties=${ includeProperties }`, this.messages)
            .then(res =>
            {
                res && res.data.map(item =>
                {
                    item.formatedAddmissionDate = this.helper.formatDate(item.addmissionDate);
                    item.formatedDischargeDate = this.helper.formatDate(item.dischargeDate);
                    item.fullname = item.patient.fullname
                    return item;
                });
                var result = _.groupBy(res.data, "formatedDischargeDate")
                this.setState({
                    first: first,
                    rows: rows,
                    totalRecords: res && res.totalCount,
                    ipds: result,
                    loading: false
                });
            })
    }
    // getCharges = () =>
    // {
    //     this.repository.get("lookups", `filter=type-equals-{${ lookupTypeEnum.CHARGENAME.value }}`, this.messages).then(res =>
    //     {
    //         let charges = res && res.data;
    //         this.setState({ charges: charges, chargesCount: charges.length });
    //     })
    // }
    componentDidMount = (e) =>
    {
        //this.getCharges();
        const month = this.helper.getMonthFromDate();
        const year = this.helper.getYearFromDate();
        const date = this.helper.formatDate("08/31/2018", "en-US");
        console.log(date);
        const filter = `disChargeDate-equals-{${ date }}`
        this.setState({ filterString: filter }, () =>
        {
            this.getIpds();
        })
    }

    render()
    {
        const { ipds, charges, chargesCount } = this.state;
        return (
            <>
                <Messages ref={(el) => this.messages = el} />
                <table className="table table-bordered reportTable">
                    <thead>
                        <tr>
                            <th style={{ width: "10px" }}>Id</th>
                            <th>Patient's Name</th>
                            <th>IPD Type</th>
                            <th>Adm. Date</th>
                            {
                                charges && charges.map((c, i) =>
                                {
                                    return (
                                        <th key={shortid.generate()}>{i + 1}</th>
                                    )
                                })
                            }
                            <th>Total</th>
                            <th>Final Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(ipds).map((item, index) =>
                            {
                                let dischargeDate = item;
                                let ipd = ipds[item]
                                console.log(ipd)
                                let patientGroupCount = ipd.length
                                return (
                                    <React.Fragment key={`fragement${ index }`}>
                                        <tr className="report-group-title">
                                            <td colSpan={(chargesCount + 6 - 10)} className="text-center">Date: {dischargeDate}</td>
                                            <td colSpan="10" className="text-center">{patientGroupCount} Patients</td>
                                        </tr>
                                        {
                                            ipd.map((subitem, i) =>
                                            {
                                                return (
                                                    <tr key={`subitem${ subitem.uniqueId }`}>
                                                        <td>{subitem.uniqueId}</td>
                                                        <td>{subitem.fullname}</td>
                                                        <td>{subitem.ipdType}</td>
                                                        <td>{subitem.formatedAddmissionDate}</td>

                                                    </tr>
                                                )
                                            })
                                        }
                                    </React.Fragment>
                                )
                            })
                        }
                    </tbody>
                    {/* <tbody>
                        {
                            Object.keys(opds).map((item, index) =>
                            {
                                let opdDate = this.helper.formatDate(item);
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
                                                        <td>{subitem.consultCharge}</td>
                                                        <td>{subitem.usgCharge}</td>
                                                        <td>{subitem.uptCharge}</td>
                                                        <td>{subitem.injectionCharge}</td>
                                                        <td>{subitem.otherCharge}</td>
                                                        <td>{subitem.totalCharge}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        <tr className="report-group-title">
                                            <td colSpan="3"></td>
                                            <td className="text-right">Total</td>
                                            <td>{consultGroupTotal}</td>
                                            <td>{usgGroupTotal}</td>
                                            <td>{uptGroupTotal}</td>
                                            <td>{injectionGroupTotal}</td>
                                            <td>{otherGroupTotal}</td>
                                            <td>{amountGroupTotal}</td>
                                        </tr>

                                    </React.Fragment>
                                )
                            })
                        }
                    </tbody>
                    <tfoot className="report-footer"> */}
                    {/* {opds && opds.length ?
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
                    </tfoot> */}
                </table>
            </>
        );
    }
}
