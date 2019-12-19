import React, { Component } from 'react';
export default class PatientForm extends Component {
    render() {
        return (
            <div className="panel" data-collapsed="0">
                <div className="panel-heading">
                    <div className="panel-title">
                        Patient Registration
                        <span className="tools pull-right">
                            <a href="{}"><i className="fa fa-chevron-down" /></a>
                            <a href="{}"><i className="fa fa-cog" /></a>
                            <a href="{}"><i className="fa fa-times" /></a>
                        </span>
                    </div>
                </div>
                <div className="panel-body">
                    <form>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="field-4" className="control-label">Firstname</label>
                                    <input className="form-control Capitalize" placeholder="Enter Firstname" type="text" />
                                    {/* <span className="field-validation-valid" data-valmsg-htmlFor="Firstname" data-valmsg-replace="true"></span> */}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="field-5" className="control-label">Middlename</label>
                                    <input className="form-control Capitalize" placeholder="Enter Middlename" type="text" />
                                    {/* <span className="field-validation-valid" data-valmsg-htmlFor="Middlename" data-valmsg-replace="true"></span> */}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="field-6" className="control-label">Lastname</label>
                                    <input className="form-control Capitalize" placeholder="Enter Lastname" type="text" />
                                    {/* <span className="field-validation-valid" data-valmsg-htmlFor="Lastname" data-valmsg-replace="true"></span> */}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="field-1" className="control-label">Age</label>
                                    <input className="form-control" placeholder="Enter Age" type="text" />
                                    {/* <span className="field-validation-valid" data-valmsg-htmlFor="Age" data-valmsg-replace="true"></span> */}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="field-2" className="control-label">Mobile</label>
                                    <input className="form-control" placeholder="Enter Mobile" type="text" />
                                    {/* <span className="field-validation-valid" data-valmsg-htmlFor="Mobile" data-valmsg-replace="true"></span> */}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="field-3" className="control-label">Address</label>
                                    <input className="form-control typeahead Capitalize" placeholder="Enter Address" type="text" />
                                    {/* <span className="field-validation-valid" data-valmsg-htmlFor="Address" data-valmsg-replace="true"></span> */}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="reset" className="btn btn-default" id="btnreset">Reset</button>
                            <button type="submit" className="btn btn-info">Save changes</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}