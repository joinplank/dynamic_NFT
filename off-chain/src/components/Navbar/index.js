import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";

const Navbar = () => {
  return (
    <>
      <Nav>
        <NavMenu>
          <NavLink to="/ARA" activeStyle>
            ARA
          </NavLink>
          <NavLink to="/manteinance" activeStyle>
            Maintenance
          </NavLink>
          <NavLink to="/newOwner" activeStyle>
            Buyer
          </NavLink>
          <NavLink to="/owner" activeStyle>
            Owner
          </NavLink>
          <NavLink to="/viewer" activeStyle>
            Viewer
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;
