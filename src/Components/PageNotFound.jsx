import React from 'react';
import { Link } from 'react-router-dom';
import NotFound from '../Images/Error-404-Page-Not-Found.png';

export default function PageNotFound() {
  return (
    <main className="container-fluid vh-100 d-flex align-items-center bg-white">
      <div className="container">
        <div className="row justify-content-center align-items-center gy-4">
          {/* Text column: stacks above image on small screens */}
          <div className="col-12 col-md-6 order-2 order-md-1 text-center text-md-start">
            <h1 className="h3 mb-2">Page not found</h1>
            <p className="text-muted mb-3">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary btn-lg">
              Go Home
            </Link>
          </div>

          {/* Image column: stacks below text on small screens */}
          <div className="col-10 col-sm-8 col-md-6 order-1 order-md-2 d-flex justify-content-center">
            <img
              src={NotFound}
              alt="404 - Page not found"
              className="img-fluid"
              loading="lazy"
              style={{ maxWidth: 600 }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
