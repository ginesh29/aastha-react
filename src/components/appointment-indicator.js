import React, { Component } from 'react';
export default class AppointmentTypeIndicator extends Component
{
    render()
    {
        const { options } = this.props;
        return (
            <>
                {
                    options && options.map(item =>
                    {
                        console.log(item)
                        return (
                            <div className="event-indicator" style={{ background: item.color }}>{item.label}</div>
                        )
                    })
                }
            </>
        );
    }
}