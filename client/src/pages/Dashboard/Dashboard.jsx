import React from 'react';
import { connect } from 'react-redux';
import CONSTANTS from '../../constants';
import CustomerDashboard from '../../components/CustomerDashboard/CustomerDashboard';
import CreatorDashboard from '../../components/CreatorDashboard/CreatorDashboard';
import ModeratorDashboard from '../../components/ModeratorDashboard/ModeratorDashboard';
import Header from '../../components/Header/Header';

const Dashboard = props => {
  const { role, history } = props;

  let dashboardContent = null;
  if (role === CONSTANTS.CUSTOMER) {
    dashboardContent = (
      <CustomerDashboard history={history} match={props.match} />
    );
  }
  if (role === CONSTANTS.CREATOR) {
    dashboardContent = (
      <CreatorDashboard history={history} match={props.match} />
    );
  }
  if (role === CONSTANTS.MODERATOR) {
    dashboardContent = (
      <ModeratorDashboard history={history} match={props.match} />
    );
  }

  return (
    <div>
      <Header />
      {dashboardContent}
    </div>
  );
};

const mapStateToProps = state => state.userStore.data;

export default connect(mapStateToProps)(Dashboard);
