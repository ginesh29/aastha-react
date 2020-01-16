import React, { Component } from 'react';
import { Messages } from 'primereact/messages';
import { repository } from "../../common/repository";
import { helper } from "../../common/helpers";
import { lookupTypeEnum } from "../../common/enums";
import _ from 'lodash';

export default class MonthlyIpdReport extends Component
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
        const { ipds,  chargeNames } = this.state;
        let ipdData;
        //let chargesColumns;
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
            
            ipdData=mapWithCharge;
            console.log(ipdData)
            // let ipdGroupByDate = _.groupBy(mapWithCharge, "formatedDischargeDate");
            // ipdData = _.map(ipdGroupByDate, (items, key) => 
            // {
            //     let result = {};
            //     let chargeName;
            //     result.dischargeDate = key;
            //     result.data = items;
            //     result.count = items.length;
            //     _.reduce(chargeNames, function (hash, key)
            //     {
            //         chargeName = `${ key.name.substring(0, 4) }Charge`;
            //         result[`${ chargeName }`] = items.reduce((total, item) => total + Number(item[chargeName]), 0);
            //         result.total = items.reduce((total, item) => total + Number(item.amount), 0)
            //         return hash;
            //     }, items);
            //     return result
            // });
            //chargesColumns = ipdData[0].data[0];
        }
        //let ipdCount = ipdData && ipdData.reduce((total, item) => total + Number(item.count), 0);
        //let amountTotal = ipdData && ipdData.reduce((total, item) => total + Number(item.total), 0);
        return (
            <>
                <Messages ref={(el) => this.messages = el} />
            </>
        );
    }
}
