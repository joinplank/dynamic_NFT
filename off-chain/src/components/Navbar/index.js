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
            Manteinance
          </NavLink>
          <NavLink to="/newOwner" activeStyle>
            New Owner
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
