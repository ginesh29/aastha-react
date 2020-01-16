import React, { Component } from 'react';
import { Messages } from 'primereact/messages';
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { lookupTypeEnum } from "../../common/enums";
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import _ from 'lodash';

let chargeTotal = 0;
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
                this.getCharges();
                res && res.data.map(item =>
                {
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
    getCharges = () =>
    {
        this.repository.get("lookups", `filter=type-eq-{${ lookupTypeEnum.CHARGENAME.value }}`, this.messages).then(res =>
        {
            let charges = res && res.data;
            this.setState({ chargeNames: charges, chargesLength: charges.length });
        })
    }
    componentDidMount = (e) =>
    {
        const month = 9;// this.helper.getMonthFromDate();
        const year = 2018;// this.helper.getYearFromDate();
        // // const date = this.helper.formatDate("09/03/2018", "en-US");
        const filter = `DischargeDate.Month-eq-{${ month }} and DischargeDate.Year-eq-{${ year }}`
        this.setState({ filterString: filter }, () =>
        {
            this.getIpds();
        })
    }

    render()
    {
        const { ipds, chargesLength, chargeNames } = this.state;
        let ipdData;
        let chargesColumns;
        let amount = 0;
        if (chargeNames) {
            let mapWithCharge = ipds.map((item) =>
            {
                let chargeName;
                _.reduce(chargeNames, function (hash, key)
                {
                    chargeName = `${ key.name.substring(0, 4) }Charge`;
                    let obj = item.charges.filter(item => item.lookupId === key.id)[0];
                    amount = obj && obj.amount;
                    hash[chargeName] = amount ? Number(amount) : 0;
                    hash.amount = _.sumBy(item.charges, x => x.amount);
                    return hash;
                }, item);
                delete item.charges;
                return item;
            });
            let ipdGroupByDate = _.groupBy(mapWithCharge, "formatedDischargeDate");
            ipdData = _.map(ipdGroupByDate, (items, key) => 
            {
                let result = {};
                let chargeName;
                result.dischargeDate = key;
                result.data = items;
                result.count = items.length;
                _.reduce(chargeNames, function (hash, key)
                {
                    chargeName = `${ key.name.substring(0, 4) }Charge`;
                    result[`${ chargeName }`] = items.reduce((total, item) => total + Number(item[chargeName]), 0);
                    result.total = items.reduce((total, item) => total + Number(item.amount), 0)
                    return hash;
                }, items);
                return result
            });
            chargesColumns = ipdData[0].data[0];
        }
        let ipdCount = ipdData && ipdData.reduce((total, item) => total + Number(item.count), 0);
        let amountTotal = ipdData && ipdData.reduce((total, item) => total + Number(item.total), 0);
        return (
            <>
                <Messages ref={(el) => this.messages = el} />
                <Button type="button" label="Toggle" onClick={(e) => this.op.toggle(e)} />
                <table className="table table-bordered reportTable">
                    <thead>
                        <tr>
                            <th style={{ width: "10px" }}>Id</th>
                            <th>Patient's Name</th>
                            <th>IPD Type</th>
                            <th>Adm. Date</th>
                            {
                                chargesColumns && Object.keys(chargesColumns).filter(m => m.includes("Charge")).map((key, i) =>
                                {
                                    return (
                                        <th key={i}>{key.substring(0, 4)}.</th>
                                    )
                                })
                            }
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ipdData && ipdData.map((items, key) =>
                            {
                                return (
                                    <React.Fragment key={`fragement${ key }`}>
                                        <tr className="report-group-title">
                                            <td colSpan="5" className="text-center">Discharge & Billing Date: {items.dischargeDate}</td>
                                            <td colSpan={chargesLength} className="text-center">{items.count} Patients</td>
                                        </tr>
                                        {
                                            items.data.map((subitem) =>
                                            {
                                                return (
                                                    <tr key={`subitem${ subitem.id }`}>
                                                        <td>{subitem.uniqueId}</td>
                                                        <td>{subitem.fullname}</td>
                                                        <td>{subitem.ipdType}</td>
                                                        <td>{subitem.formatedAddmissionDate}</td>
                                                        {
                                                            chargesColumns && Object.keys(chargesColumns).filter(m => m.includes("Charge")).map((key, i) =>
                                                            {
                                                                return (
                                                                    <td key={i} className="text-right">{subitem[key]}</td>
                                                                )
                                                            })
                                                        }
                                                        <td className="text-right">{subitem.amount}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        <tr className="report-group-title">
                                            <td colSpan="3"></td>
                                            <td className="text-right">Total</td>
                                            {
                                                chargesColumns && Object.keys(chargesColumns).filter(m => m.includes("Charge")).map((key, i) =>
                                                {
                                                    return (
                                                        <td key={i} className="text-right">{items[`${ key }`]}</td>
                                                    )
                                                })
                                            }
                                            <td className="text-right">{items.total}</td>
                                        </tr>
                                    </React.Fragment>
                                )
                            })
                        }
                    </tbody>
                    <tfoot className="report-footer">
                        {ipdData && ipdData.length ?
                            (
                                <tr className="report-group-title">
                                    <td colSpan="3">{ipdCount} Patients</td>
                                    <td className="text-right">Grand Total</td>
                                    {
                                        chargesColumns && Object.keys(chargesColumns).filter(m => m.includes("Charge")).map((key, i) =>
                                        {
                                            chargeTotal = ipdData && ipdData.reduce((total, item) => total + Number(item[key]), 0);
                                            return (
                                                <td key={i} className="text-right">{chargeTotal}</td>
                                            )
                                        })
                                    }
                                    <td className="text-right">{amountTotal}</td>
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
                    <label> Ipd Report Summary</label>
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
                                ipdData && ipdData.map((items, index) =>
                                {
                                    return (
                                        <tr key={`summaryRow${ index }`}>
                                            <td>{items.dischargeDate}</td>
                                            <td className="text-right">{items.count}</td>
                                            <td className="text-right">{items.total}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot className="report-footer">
                            {ipdData && ipdData.length ?
                                (
                                    <tr className="report-group-title">
                                        <td>Grand Total</td>
                                        <td className="text-right">{ipdCount}</td>
                                        <td className="text-right">{amountTotal}</td>
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
