import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { helper } from "../../common/helpers";
import { Calendar } from 'primereact/calendar';
import { reportTypeEnum } from "../../common/enums";
import { TEN_YEAR_RANGE } from "../../common/constants";
import jquery from 'jquery';
window.jQuery = jquery;
require('jQuery.print');

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
        const { reportType, dateSelection, dateRangeSelection, monthSelection, onDateSelection, onReportTypeChange, onShowSummary, data, showSummary, exportReport } = this.props;
        return (
            <>
                <div className="p-panel-title">Report Type</div>
                <div className="row">
                    <div className="col-md-5">
                        <div className="d-flex">
                            {
                                reportTypeOptions.map((item, i) =>
                                {
                                    return (
                                        <div key={i} className="p-2">
                                            <RadioButton inputId={`reportType${ i }`} name="reportType" value={item.value} onChange={onReportTypeChange} checked={reportType === item.value} />
                                            <label htmlFor={`reportType${ i }`} className="p-radiobutton-label">{item.label}</label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="p-inputgroup float-right">
                            <div className="form-group">
                                {
                                    data && data.length && showSummary !== false &&
                                    <Button icon="pi pi-info" className="p-button-primary" onClick={onShowSummary} tooltip="Show summary" tooltipOptions={{ position: 'bottom' }} />
                                }
                                {
                                    reportType === reportTypeEnum.DAILY.value &&
                                    <Calendar name="dateSelection" value={dateSelection} onChange={onDateSelection} readOnlyInput={true} dateFormat="dd/mm/yy" monthNavigator={true} yearNavigator={true} yearRange={TEN_YEAR_RANGE} />
                                }
                                {
                                    reportType === reportTypeEnum.DATERANGE.value &&
                                    <Calendar name="dateRangeSelection" value={dateRangeSelection} onChange={onDateSelection} selectionMode="range" readonlyInput={true} readOnlyInput={true} dateFormat="dd/mm/yy" monthNavigator={true} yearNavigator={true} yearRange={TEN_YEAR_RANGE} />
                                }
                                {
                                    reportType === reportTypeEnum.MONTHLY.value &&
                                    <Calendar name="monthSelection" value={monthSelection} onChange={onDateSelection} view="month" dateFormat="mm/yy" yearNavigator={true} yearRange={TEN_YEAR_RANGE} readOnlyInput={true} />
                                }
                                {
                                    data && data.length &&
                                    <Button icon="pi pi-print" className="p-button-primary" tooltip="Print" onClick={() => jquery("#print-div").print()} />
                                }
                                {
                                    data && data.length && showSummary !== false &&
                                    <Button icon="pi pi-file-excel" className="p-button-primary" onClick={exportReport} tooltip="Export to excel" />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}