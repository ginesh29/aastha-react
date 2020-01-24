import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { helper } from "../../common/helpers";
import { Calendar } from 'primereact/calendar';
import { reportTypeEnum } from "../../common/enums";
import { TEN_YEAR_RANGE } from "../../common/constants";

export default class ReportFilter extends Component
{
    constructor(props)
    {
        super(props);
        this.helper = new helper();
    }
    render()
    {
        const reportTypeOptions = this.helper.enumToObject(reportTypeEnum);
        const { reportType, dateSelection, dateRangeSelection, monthSelection, onDateSelection, onReportTypeChange, onShowSummary, data, showSummary } = this.props;
        return (
            <>
                <h4>Report Type</h4>
                <div className="row">
                    <div className="col-md-5">
                        <div className="form-group">
                            {
                                reportTypeOptions.map((item, i) =>
                                {
                                    return (
                                        <label className="radio-inline" key={i}>
                                            <RadioButton inputId={`reportType${ i }`} name="reportType" value={item.value} onChange={onReportTypeChange} checked={reportType === item.value} />
                                            <label htmlFor={`reportType${ i }`} className="p-radiobutton-label">{item.label}</label>
                                        </label>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="p-inputgroup pull-right">
                            <div className="form-group">
                                <Button icon="pi pi-info" className="p-button-primary" onClick={onShowSummary} tooltip="Click to show summary" tooltipOptions={{ position: 'bottom' }} style={{ display: data && data.length && showSummary !== false ? "" : "none" }} />
                                <Calendar name="dateSelection" value={dateSelection} onChange={onDateSelection} readOnlyInput={true} style={{ display: reportType === reportTypeEnum.DAILY.value ? "" : "none" }} dateFormat="dd/mm/yy" monthNavigator={true} yearNavigator={true} yearRange={TEN_YEAR_RANGE} />
                                <Calendar name="dateRangeSelection" value={dateRangeSelection} onChange={onDateSelection} selectionMode="range" readonlyInput={true} readOnlyInput={true} style={{ display: reportType === reportTypeEnum.DATERANGE.value ? "" : "none" }} dateFormat="dd/mm/yy" monthNavigator={true} yearNavigator={true} yearRange={TEN_YEAR_RANGE} />
                                <Calendar name="monthSelection" value={monthSelection} onChange={onDateSelection} view="month" dateFormat="mm/yy" yearNavigator={true} yearRange={TEN_YEAR_RANGE} readOnlyInput={true} style={{ display: reportType === reportTypeEnum.MONTHLY.value ? "" : "none" }} />
                                <Button icon="pi pi-print" className="p-button-primary" label="Print" style={{ display: data && data.length ? "" : "none" }} />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}