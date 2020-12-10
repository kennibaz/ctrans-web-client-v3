import React, { Component, useEffect, useState } from "react";
import {
  FirebaseAuthProvider,
  IfFirebaseAuthed,
  FirebaseAuthConsumer,
} from "@react-firebase/auth";
import Router from "next/router";

import firebaseWeb from "../firebase/firebase-web";

const loginCheck = () => {
  firebaseWeb.auth().onAuthStateChanged((user) => {
    if (user) {
      return user;
    } else {
      return;
    }
  });
};

function withAuth(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        user: null,
        checking: true,
        carrierId: "",
        userId: "",
        token: "",
      };
    }
    componentDidMount() {
      firebaseWeb.auth().onAuthStateChanged((user) => {
        if (user) {
          firebaseWeb
            .auth()
            .currentUser.getIdToken(/* forceRefresh */ true)
            .then(function (idToken) {
              this.setState({ token: idToken });
            })
            .catch(function (error) {});

          firebaseWeb
            .auth()
            .currentUser.getIdTokenResult()
            .then((idTokenResult) => {
              this.setState({
                carrierId: idTokenResult.claims.carrier_id,
                userId: idTokenResult.claims.user_id,
                token: idTokenResult.token
              });
            })
            .catch((error) => {});
          this.setState({ user: user });
          this.setState({ checking: false });
        } else {
          Router.push("/signin");
        }
      });
    }
    render() {
      if (this.state.checking || !this.state.carrierId) {
        return null;
      }
      return (
        <WrappedComponent
          {...this.props}
          carrierId={this.state.carrierId}
          token={this.state.token}
          userId={this.state.userId}
        />
      );
    }
  };
}

export { withAuth };
