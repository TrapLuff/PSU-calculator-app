import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ROUTES, ROUTE_LABELS } from "../../routes";
import "./Navbar.css";

export const NavbarComponent: React.FC = () => {
  return (
    <Navbar className="custom-navbar" variant="dark">
      <Nav className="nav-inline">

        <Nav.Link as={Link} to={ROUTES.COMPONENTS}>
          {ROUTE_LABELS.COMPONENTS}
        </Nav.Link>

        <Nav.Link as={Link} to={ROUTES.POWERS}>
          {ROUTE_LABELS.POWERS}
        </Nav.Link>

      </Nav>
    </Navbar>
  );
};

/*<Nav.Link as={Link} to={ROUTES.HOME}>
          {ROUTE_LABELS.HOME}
        </Nav.Link> */