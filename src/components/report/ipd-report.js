import React, { Component } from 'react';
import { Messages } from 'primereact/messages';
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { lookupTypeEnum } from "../../common/enums";
import _ from 'lodash';

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
                    item.fullname = item.patient.fullname;
                    item.groupedCharges = _.groupBy(item.charges, "lookupId")
                    return item;
                });

                let groupByDate = _.groupBy(res.data, "formatedDischargeDate")
                res.data = groupByDate;
                this.setState({
                    first: first,
                    rows: rows,
                    totalRecords: res && res.totalCount,
                    ipds: res && res.data,
                    loading: false
                });
            })
    }
    getCharges = () =>
    {
        this.repository.get("lookups", `filter=type-equals-{${ lookupTypeEnum.CHARGENAME.value }}`, this.messages).then(res =>
        {
            let charges = res && res.data;
            this.setState({ chargeNames: charges, chargesLength: charges.length });
        })
    }
    componentDidMount = (e) =>
    {
        this.getCharges();
        //const month = this.helper.getMonthFromDate();
        // /const year = this.helper.getYearFromDate();
        //const date = this.helper.formatDate("08/31/2018", "en-US");
        const filter = `disChargeDate.Month-equals-{1} and disChargeDate.Year-equals-{2019}`
        this.setState({ filterString: filter }, () =>
        {
            this.getIpds();
        })
    }

    render()
    {
        const { ipds, chargesLength, chargeNames } = this.state;
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
                                chargeNames && chargeNames.map((key, i) =>
                                {
                                    return (
                                        <th key={i}>{key.name.substring(0, 4)}.</th>
                                    )
                                })
                            }
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(ipds).map((item, index) =>
                            {
                                let dischargeDate = item;
                                let ipd = ipds[item]
                                let patientGroupCount = ipd.length
                                let chargeGroupTotal = {};

                                return (
                                    <React.Fragment key={`fragement${ index }`}>
                                        <tr className="report-group-title" >
                                            <td colSpan="5" className="text-center">Date: {dischargeDate}</td>
                                            <td colSpan={chargesLength} className="text-center">{patientGroupCount} Patients</td>
                                        </tr>
                                        {
                                            ipd.map((subitem, i) =>
                                            {
                                                let rowTotalCharge = 0;

                                                return (
                                                    <tr key={`subitem${ subitem.id }`}>
                                                        <td>{subitem.uniqueId}</td>
                                                        <td>{subitem.invoiceNo}</td>
                                                        <td>{subitem.fullname}</td>
                                                        <td>{subitem.formatedAddmissionDate}</td>
                                                        {
                                                            chargeNames && chargeNames.map((key, i) =>
                                                            {
                                                                let charge = subitem.groupedCharges[key.id][0];
                                                                rowTotalCharge = subitem.charges.reduce((total, item) => total + (item.amount ? Number(item.amount) : 0), 0);
                                                                chargeGroupTotal[key.id] = ipds[item].reduce((total, item) => total + (item.groupedCharges[key.id][0].amount ? Number(item.groupedCharges[key.id][0].amount) : 0), 0)
                                                                return (
                                                                    <td key={i} className="text-right">{charge && charge.amount ? charge.amount : 0}</td>
                                                                )
                                                            })
                                                        }
                                                        <td> {rowTotalCharge}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        <tr className="report-group-title">
                                            <td colSpan="3"></td>
                                            <td className="text-right">Total</td>
                                            {
                                                chargeNames && chargeNames.map((key, i) =>
                                                {
                                                    return (
                                                        <td className="text-right" key={`groupTotal${ i }`}>{chargeGroupTotal[key.id]}</td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    </React.Fragment>
                                )
                            })
                        }
                    </tbody>
                    <tfoot className="report-footer">
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
                            )} */}
                    </tfoot>
                    {/* <tbody>
                        {
                            ipds.map((subitem, index) =>
                            {
                                //let dischargeDate = item;
                                //let ipd = ipds[item]
                                // /let patientGroupCount = ipd.length
                                return (
                                    <tr key={`subitem${ subitem.uniqueId }`}>
                                        <td>{subitem.uniqueId}</td>
                                        <td>{subitem.fullname}</td>
                                        <td>{subitem.ipdType}</td>
                                        <td>{subitem.formatedDischargeDate}</td>
                                        {
                                            chargeNames && chargeNames.map((key, i) =>
                                            {
                                                return (
                                                    <td key={i}></td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                            // Object.keys(ipds).map((item, index) => {
                            //     let dischargeDate = item;
                            //     let ipd = ipds[item]
                            //     let patientGroupCount = ipd.length
                            //     return (
                            //         <React.Fragment key={`fragement${index}`}>
                            //             <tr className="report-group-title">
                            //                 <td colSpan="8" className="text-center">Date: {dischargeDate}</td>
                            //                 <td colSpan="10" className="text-center">{patientGroupCount} Patients</td>
                            //             </tr>
                            //             {
                            //                 ipd.map((subitem, i) => {
                            //                     return (
                            //                         <tr key={`subitem${subitem.uniqueId}`}>
                            //                             <td>{subitem.uniqueId}</td>
                            //                             <td>{subitem.fullname}</td>
                            //                             <td>{subitem.ipdType}</td>
                            //                             <td>{subitem.formatedAddmissionDate}</td>

                            //                         </tr>
                            //                     )
                            //                 })
                            //             }
                            //         </React.Fragment>
                            //     )
                            // })
                        }
                    </tbody> */}
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
