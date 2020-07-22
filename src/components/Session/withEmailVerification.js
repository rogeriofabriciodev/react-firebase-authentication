import React, { Component } from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const needsEmailVerification = authUser => 
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes('password');

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState( { isSent: true }));
    };

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUSer => 
            needsEmailVerification(authUSer) ? (
              <div>
                {this.state.isSent ? (
                  <p>
                    E-mail confirmation sent: Check you E-mails (Spam
                    folder included) for a confirmation E-mail.
                    Refresh this page once you confirmed your E-mail.
                  </p>
                ) : (
                  <p>
                    Verify your E-mail: Check you E-mails (Spam folder
                    included) form a confirmation E-mail or send another
                    confirmation E-mail.
                  </p>
                )}
                
                <button
                  type="button"
                  onClick={this.onSendEmailVerification}
                  disabled={this.state.isSent}
                >
                  Send confirmation e-mail
                </button>
              </div>
            ) : (
              <Component { ...this.props } />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;