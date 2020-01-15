import React, { Component } from 'react';
import { Messages } from 'primereact/messages';
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { lookupTypeEnum } from "../../common/enums";
import _ from 'lodash';

let patientCount = 0;
let chargeTotal = {};
let amountTotal = 0;
export default class IpdReport extends Component {
    constructor(props) {
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
    getIpds = () => {
        const { first, rows, filterString, sortString, includeProperties, controller, chargeNames } = this.state;
        return this.repository.get(controller, `filter=${filterString}&sort=${sortString}&includeProperties=${includeProperties}`, this.messages)
            .then(res => {
                res && res.data.map(item => {
                    item.formatedAddmissionDate = this.helper.formatDate(item.addmissionDate);
                    item.formatedDischargeDate = this.helper.formatDate(item.dischargeDate);
                    item.fullname = item.patient.fullname;
                    return item;
                });
                this.setState({
                    first: first,
                    rows: rows,
                    totalRecords: res && res.totalCount,
                    ipds: res && res.data,
                    loading: false
                });
            })
    }
    // getChargesTotal = (lookupId) => {
    //     const { ipds } = this.state;
    //     chargeNames && chargeNames.map((key, i) => {
    //         let chargeName = `${key.name.substring(0, 4)}.`;
    //         res && res.data.map(item => {
    //             let groupChargeTotal = item.charges.filter(item => item.lookupId === key.id).reduce((total, item1) => total + (item1.amount ? Number(item1.amount) : 0), 0);
    //             chargeTotal = chargeTotal + groupChargeTotal;
    //             item[chargeName] = chargeTotal
    //             return item;
    //         })
    //     });
    //     return chargeTotal;

    // }
    getCharges = () => {
        this.repository.get("lookups", `filter=type-equals-{${lookupTypeEnum.CHARGENAME.value}}`, this.messages).then(res => {
            let charges = res && res.data;
            this.setState({ chargeNames: charges, chargesLength: charges.length });
        })
    }
    componentDidMount = (e) => {
        //const month = this.helper.getMonthFromDate();
        // /const year = this.helper.getYearFromDate();
        //const date = this.helper.formatDate("08/31/2018", "en-US");
        const filter = `disChargeDate.Month-equals-{1} and disChargeDate.Year-equals-{2019}`
        this.setState({ filterString: filter }, () => {
            this.getIpds();
            this.getCharges();
        })
    }

    render() {
        const { ipds, chargesLength, chargeNames } = this.state;

        ipds.map((item) => {
            let chargeName;
            let amount = 0;
            return chargeNames && chargeNames.map((key, i) => {
                chargeName = `${key.name.substring(0, 4)}Charge`;
                amount = item.charges.filter(item => item.lookupId === key.id)[0].amount;
                item[`${chargeName}`] = amount ? amount : 0;
                return item;
            })
        })
        let ipdData = _.groupBy(ipds, "formatedDischargeDate")

        let MapData = _.map(ipdData, item => {

            let chargeName;
            return chargeNames && chargeNames.map((key, i) => {
                chargeName = `${key.name.substring(0, 4)}GroupTotal`;
                //groupAmount = item.charges.filter(item => item.lookupId === key.id)[0].amount;
                item[`${chargeName}`] = 0;
                return item;
            })
        })
        console.log(MapData)
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
                                chargeNames && chargeNames.map((key, i) => {
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
                            Object.keys(ipdData).map((item, index) => {
                                let dischargeDate = item;
                                let ipd = ipdData[item]
                                let patientGroupCount = ipd.length
                                patientCount = patientCount + patientGroupCount;
                                let chargeGroupTotal = {};
                                let amountGroupTotal = 0;
                                return (
                                    <React.Fragment key={`fragement${index}`}>
                                        <tr className="report-group-title" >
                                            <td colSpan="5" className="text-center">Date: {dischargeDate}</td>
                                            <td colSpan={chargesLength} className="text-center">{patientGroupCount} Patients</td>
                                        </tr>
                                        {
                                            ipd.map((subitem, i) => {
                                                let rowTotalCharge = 0;
                                                amountGroupTotal = 0;
                                                return (
                                                    <tr key={`subitem${subitem.id}`}>
                                                        <td>{subitem.uniqueId}</td>
                                                        <td>{subitem.invoiceNo}</td>
                                                        <td>{subitem.fullname}</td>
                                                        <td>{subitem.formatedAddmissionDate}</td>
                                                        {
                                                            chargeNames && chargeNames.map((key, i) => {
                                                                let charge = subitem.charges.filter(item => item.lookupId === key.id)[0];
                                                                rowTotalCharge = subitem.charges.reduce((total, item) => total + (item.amount ? Number(item.amount) : 0), 0);
                                                                chargeGroupTotal[key.id] = ipd.reduce((total, item) => total + (charge.amount ? Number(charge.amount) : 0), 0)
                                                                amountGroupTotal = amountGroupTotal + chargeGroupTotal[key.id];
                                                                return (
                                                                    <td key={i} className="text-right">{charge && charge.amount ? charge.amount : 0}</td>
                                                                )
                                                            })
                                                        }
                                                        <td className="text-right"> {rowTotalCharge}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        <tr className="report-group-title">
                                            <td colSpan="3"></td>
                                            <td className="text-right">Total</td>
                                            {
                                                chargeNames && chargeNames.map((key, i) => {
                                                    return (
                                                        <td className="text-right" key={`groupTotal${i}`}>{chargeGroupTotal[key.id]}</td>
                                                    )
                                                })
                                            }
                                            <td className="text-right">{amountGroupTotal}</td>
                                        </tr>
                                    </React.Fragment>
                                )
                            })
                        }
                    </tbody>
                    <tfoot className="report-footer">
                        {ipdData && ipdData.length ?
                            (
                                <tr>
                                    <td colSpan={chargesLength + 5} className="text-left">No Record Found</td>
                                </tr>
                            ) :
                            (
                                <tr className="report-group-title">
                                    <td colSpan="3">{patientCount} Patients</td>
                                    <td className="text-right">Grand Total</td>
                                    {
                                        chargeNames && chargeNames.map((key, i) => {
                                            return (
                                                <td className="text-right" key={`groupTotal${i}`}>{chargeTotal[key.id]}</td>
                                            )
                                        })
                                    }
                                    <td className="text-right">{amountTotal}</td>
                                </tr>
                            )}
                    </tfoot>
                </table>
            </>
        );
    }
}
