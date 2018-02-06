// @flow
import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { Router } from 'react-router-dom';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import history from 'utils/history';

import Localization from 'components/localization';
import Layout from 'components/layout/layout';

import * as themes from 'constants/themes.constants';

const Home = () => <div>TODO: remove this component</div>;

class App extends React.Component<{}> {
  render() {
    return (
      <Provider store={store}>
        <Localization>
          <ThemeProvider theme={themes.main}>
            <Router history={history}>
              <Layout>
                <Route path="/" name="home" component={Home} />
              </Layout>
            </Router>
          </ThemeProvider>
        </Localization>
      </Provider>
    );
  }
}

export default App;
