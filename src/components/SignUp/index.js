import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from "../Firebase";
import * as ROUTES from '../../constants/routes';

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

      event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <form onSubmit={ this.onSubmit }>
        <input
          name="username"
          value={ username }
          onChange={ this.onChange }
          type="text"
          placeholder="Nome Completo"
        />
        <input
          name="email"
          value={ email }
          onChange={ this.onChange }
          type="text"
          placeholder="E-mail"
        />
        <input
          name="passwordOne"
          value={ passwordOne }
          onChange={ this.onChange }
          type="password"
          placeholder="Senha"
        />
        <input
          name="passwordTwo"
          value={ passwordTwo }
          onChange={ this.onChange }
          type="password"
          placeholder="Confirme a senha"
        />
        <button 
          disabled={ isInvalid } 
          type="submit"
        >
          Criar Conta
        </button>

        { error && <p>{ error.message }</p> }

      </form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Não tem uma conta? <Link to={ ROUTES.SIGN_UP }>Criar Conta</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };