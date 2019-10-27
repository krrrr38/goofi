import React from 'react';
import App from 'next/app';
import Head from 'next/head'
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ApolloProvider } from 'react-apollo';

import JssProvider from 'react-jss/lib/JssProvider';
import getPageContext from '../helpers/getPageContext';

import withApolloClient from '../helpers/with-apollo';
import { ApolloClient } from "apollo-client";

type Props = {
  apolloClient: ApolloClient<any>;
}

class MyApp extends App<Props> {
  pageContext;

  constructor(props) {
    super(props);
    this.pageContext = getPageContext();
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const nowUrl = `https://${ctx.req.headers['x-now-deployment-url']}`

    return { pageProps, nowUrl }
  }

  render () {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <>
        <Head>
          <title>Good First Issues</title>
        </Head>
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          <ApolloProvider client={apolloClient}>
            <MuiThemeProvider
              theme={this.pageContext.theme}
              sheetsManager={this.pageContext.sheetsManager}
            >
              <CssBaseline />
              <Component pageContext={this.pageContext} {...pageProps} />
            </MuiThemeProvider>
          </ApolloProvider>
        </JssProvider>
        </>
    )
  }
}

export default withApolloClient(MyApp);
