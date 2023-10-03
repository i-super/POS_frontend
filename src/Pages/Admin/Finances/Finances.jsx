import React from "react";

const Finances = () => {
  return (
    <main>
      <div className="container-fluid">
        <h3>Finances</h3>

        <div className="row">
          <div className="col-md-4">
            <h6>Collected Tax</h6>
            <p>$ 220.00</p>
          </div>
          <div className="col-md-4">
            <h6>Payout Account</h6>
            <p>123456789</p>
          </div>
          <div className="col-md-4">
            <h6>Next Billing Date</h6>
            <p>Dec 20, 2022</p>
          </div>
        </div>

        <h6>Earning Chart</h6>
        <div className="row">

          <div className="col-md-6">
            PIE Chart
          </div>
          <div className="col-md-6">
            
          </div>
        </div>
      </div>
    </main>
  );
};

export default Finances;
