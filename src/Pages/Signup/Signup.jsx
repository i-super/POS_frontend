import React from "react";

const Signup = () => {
  return (
    <main>
      <div className="container-fluid">
        <div className="container">
          <h3>Sign up</h3>

          <form className="row g-3">
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input type="text" className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-control" />
            </div>
            <div className="col-6">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="" />
            </div>
            <div className="col-6">
              <label htmlFor="inputAddress2" className="form-label">
                Password
              </label>
              <input type="password" className="form-control" />
            </div>

            <p>Bank Account Info</p>

            <div className="col-md-6">
              <label className="form-label">Account Title</label>
              <input type="text" className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Account Number</label>
              <input type="text" className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Bank Name</label>
              <input type="text" className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Store Name</label>
              <input type="text" className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Address</label>
              <input type="text" className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-control" />
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Signup;
