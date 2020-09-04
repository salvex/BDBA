import React from 'react';
import Grid from '@material-ui/core/Grid';

class Header extends React.Component {
    
    constructor(props) {
        super(props);

        // Stato
        this.state = {
            email: '',
            password: ''
        };

        // Bind
        this.onValueChange = this.onValueChange.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    // Metodi
    onValueChange = (e) => {
        this.setState({
            [e.target.id]: [e.target.value] 
        });
    }

    /* LOGIN */
    login = (e) => {
        const { email, password } = this.state;
        e.preventDefault();

        if (!email) {
            return alert("Inserisci una mail");
        } else if (!password) {
            return alert("Inserisci una password");
        } else {
            this.props.doLogin( email, password );
            
            // Resetto il form
            this.setState({
                email: '',
                password: ''
            });
        }
    }

    /* LOGOUT */
    logout = () => this.props.doLogout;



    render() {
        const auth = this.props.auth;

        if (auth.isLoggedIn) {
            return (
                <Grid item container>
                    <span>{`Hi, ${auth.email}, you're logged in`}</span>
                    <button onClick={this.logout}>Logout</button>
                </Grid>
            );
        } else {
            return (
                <Grid item container>
                    <form onSubmit={this.login}>
                        <input
                            id="emailField"
                            value={this.state.email}
                            placeholder="E-mail"
                            onChange={this.onValueChange}
                        />
                        <input
                            id="passwordField"
                            value={this.state.password}
                            placeholder="Password"
                            onChange={this.onValueChange}
                        />
                        <button>login</button>
                    </form>
                </Grid>
            );
        }
    }
}

export default Header;