import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'

const Layout = (props) => (
    <Container>
        {props.children}
    </Container>
)

export default Layout;