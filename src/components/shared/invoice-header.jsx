import React from "react";
import invoice_header from "../../assets/images/invoice_header.jpg";

export default class InvoiceHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showLogo: true };
  }
  render() {
    const { removeLogoButton } = this.props;
    const { showLogo } = this.state;
    return (
      <>
        {showLogo && (
          <img
            src={invoice_header}
            className="img-fluid"
            alt="Invoice Header"
          />
        )}
        {removeLogoButton && (
          <div className="text-right no-print">
            <button
              onClick={() => this.setState({ showLogo: !showLogo })}
              className="link-button"
            >
              {showLogo ? "Hide Logo" : "Show Logo"}
            </button>
          </div>
        )}
      </>
    );
  }
}
