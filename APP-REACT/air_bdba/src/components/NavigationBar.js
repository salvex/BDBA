import React, { Component } from 'react';
import {Nav, Navbar, NavDropdown, Form, FormControl, Button} from 'react-bootstrap';
import styled from 'styled-components';

/* Stile custom modificabile tramite sass gestito tramite la libreria
"Styled-Components". */
const Styles = styled.div`
    .navbar {
        background-color: #222;
    }

    .navbar-brand, .navbar-nav .nav-link{
        color: #bbb;

        &:hover {
            color: white;
        }
    }
`;

const NavigationBar = (props) => (
    <>
    <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">
        <img
            alt=""
            src="/../logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
        />{' '}
        React Bootstrap
        </Navbar.Brand>
    </Navbar>
    </>
)

export default NavigationBar;