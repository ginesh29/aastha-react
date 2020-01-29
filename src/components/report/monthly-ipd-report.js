import React, { Component } from 'react';
import { Messages } from 'primereact/messages';
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { lookupTypeEnum, reportTypeEnum } from "../../common/enums";
import _ from 'lodash';
import numberToWords from 'number-to-words';
import invoice_header from "../../assets/images/invoice_header.jpg"
import ReportFilter from './report-filter';
import { TODAY_DATE } from "../../common/constants";

export default class MonthlyIpdReport extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            reportType: reportTypeEnum.MONTHLY.value,
            ipds: [],
            loading: true,
            filterString: "",
            dateSelection: TODAY_DATE,
            dateRangeSelection: [TODAY_DATE],
            monthSelection: TODAY_DATE,
            sortString: "dischargeDate asc",
            controller: "ipds",
            includeProperties: "Patient.Address,Charges.ChargeDetail",
        };
        this.repository = new repository();
        this.helper = new helper();
    }
    getIpds = () =>
    {
        const { first, rows, filterString, sortString, includeProperties, controller } = this.state;
        this.repository.get(controller, `filter=${ filterString }&sort=${ sortString }&includeProperties=${ includeProperties }`, this.messages)
            .then(res =>
            {
                this.getCharges();
                res && res.data.map(item =>
                {
                    item.formatedAddmissionDate = this.helper.formatDate(item.addmissionDate);
                    item.formatedDischargeDate = this.helper.formatDate(item.dischargeDate);
                    item.fullname = item.patient.fullname;
                    item.address = item.patient.address && item.patient.address.name;
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
        const month = this.helper.getMonthFromDate(TODAY_DATE);
        const year = this.helper.getYearFromDate(TODAY_DATE);
        const filter = `DischargeDate.Month-eq-{${ month }} and DischargeDate.Year-eq-{${ year }}`;
        this.setState({ filterString: filter }, () =>
        {
            this.getIpds();
        });
    }
    onDateSelection = (e) =>
    {
        const { reportType } = this.state;
        let name = e.target.name;
        let value = e.target.value;
        this.setState({
            [name]: value
        });
        let filter = "";
        if (reportType === reportTypeEnum.DAILY.value) {
            let date = this.helper.formatDate(value, 'en-US')
            filter = `DischargeDate-eq-{${ date }}`;
        }
        else if (reportType === reportTypeEnum.DATERANGE.value) {
            let startDate = this.helper.formatDate(value[0], 'en-US')
            let endDate = this.helper.formatDate(value[1], 'en-US')
            filter = `DischargeDate-gte-{${ startDate }} and DischargeDate-lte-{${ endDate }}`
        }
        else if (reportType === reportTypeEnum.MONTHLY.value) {
            let month = this.helper.getMonthFromDate(value);
            let year = this.helper.getYearFromDate(value);
            filter = `DischargeDate.Month-eq-{${ month }} and DischargeDate.Year-eq-{${ year }}`
        }
        this.setState({ filterString: filter }, () =>
        {
            this.getIpds();
        });
    }

    render()
    {
        const { ipds, chargeNames } = this.state;
        let ipdData;
        let chargesColumns;
        let amount = 0;
        let days = 0;
        let rate = 0;
        if (chargeNames) {
            let mapWithCharge = ipds.map((item) =>
            {
                let chargeName;
                _.reduce(chargeNames, function (hash, key)
                {
                    chargeName = `dynamic-charge-${ key.id }`;
                    let obj = item.charges && item.charges.filter(item => item.lookupId === key.id)[0];
                    days = obj && obj.days ? Number(obj.days) : 0;
                    rate = obj && obj.rate ? Number(obj.rate) : 0;
                    amount = obj && obj.amount ? Number(obj.amount) : 0;
                    hash[chargeName] = { chargeName: key.name, rate: rate, days: days, amount: amount };
                    hash.amount = _.sumBy(item.charges, x => x.amount);
                    hash.discount = hash.discount ? hash.discount : 0;
                    hash.payableAmount = hash.amount - hash.discount;
                    hash.amountInWord = numberToWords.toWords(hash.payableAmount).toUpperCase();
                    return hash;
                }, item);
                //delete item.charges;
                return item;
            });
            ipdData = mapWithCharge;
            chargesColumns = ipdData[0] && Object.keys(ipdData[0]).filter(m => m.includes("dynamic-charge"));
        }

        return (
            <>
                <Messages ref={(el) => this.messages = el} />
                <div className="panel">
                    <div className="panel-body">
                        <ReportFilter {...this.state} onDateSelection={this.onDateSelection} onReportTypeChange={(e) => this.setState({ reportType: e.value })} data={ipdData} showSummary={false} />
                        <hr />
                        <div className="row invoice" id="print-div">
                            {
                                ipdData && ipdData.map((items, i) =>
                                {
                                    return (
                                        <div className={`col-md-6 col-xs-6 ${ i % 2 === 0 ? "vertical-devider" : "" }`} key={i}>
                                            <div className="" style={{ paddingLeft: "50px" }}>
                                                <img src={invoice_header} className="img-responsive" alt="Invoice Header" />
                                                <h3 className="invoice-title">Indoor Invoice</h3>
                                                <table className="table" id="invoice-detail">
                                                    <tr>
                                                        <td><b>Name :</b> {items.fullname}</td>
                                                        <td width="200px"><b>Date :</b> {items.formatedDischargeDate}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><b>Invoice No. :</b> {items.uniqueId}</td>
                                                        <td><b>Address :</b> {items.address}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><b>Indoor No. :</b> {items.invoiceNo}</td>
                                                        <td><b>Room Type :</b> {items.roomTypeName}</td>
                                                    </tr>
                                                </table>
                                                <div className="row">
                                                    <div className="col-xs-12">
                                                        <table className="table table-bordered invoice-table">
                                                            <thead>
                                                                <tr>
                                                                    <th width="10px">No.</th>
                                                                    <th>Description</th>
                                                                    <th width="50px">Rate</th>
                                                                    <th width="50px">Days</th>
                                                                    <th width="50px">Amount</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    chargesColumns.map((key, i) =>
                                                                    {
                                                                        return (
                                                                            <tr key={`chrge-${ i }`}>
                                                                                <td>{i + 1}</td>
                                                                                <td>{items[key].chargeName}</td>
                                                                                <td className="text-right"> {items[key].rate}</td>
                                                                                <td className="text-right"> {items[key].days}</td>
                                                                                <td className="text-right"> {this.helper.formatCurrency(items[key].amount)}</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                            <tfoot className="invoice-footer">
                                                                <tr>
                                                                    <td colSpan="4">Grand Total <span></span></td>
                                                                    <td className="text-right"><strong> {items.amount}</strong></td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan="4">Discount</td>
                                                                    <td className="text-right"><strong> {this.helper.formatCurrency(items.discount)}</strong></td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan="4">Net Payable Amount :<span > {`${ items.amountInWord } Only`}</span></td>
                                                                    <td className="text-right"><strong> {this.helper.formatCurrency(items.payableAmount)}</strong></td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                    <div style={{ marginTop: "15px" }}>
                                                        <div className="col-xs-7">
                                                            <span>Rececived By</span>
                                                        </div>
                                                        <div className="col-xs-5 pull-right">
                                                            <strong>Dr. Bhaumik Tandel</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div >
            </>
        );
    }
}