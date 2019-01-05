import { Component } from 'react';
import { connect } from 'react-redux';

import { fetchNearbyJobs, fetchActiveJobs } from '../redux/jobs';

class JobsWatcher extends Component {
    componentDidUpdate(prevProps) {
        const { radius, fetchNearbyJobs, fetchActiveJobs } = this.props;
        if (prevProps.location !== this.props.location) {
            fetchNearbyJobs();
        }
        if (!prevProps.location && this.props.location) {
            fetchActiveJobs();
        }
    }

    render() {
        return null;
    }
}

const mapStateToProps = state => ({
    location: state.user.location,
    radius: state.settings.radius,
    minPrice: state.settings.minPrice,
    activeGroups: state.groups.active,
});


const mapDispatchToProps = {
    fetchNearbyJobs,
    fetchActiveJobs,
};

export default connect(mapStateToProps, mapDispatchToProps)(JobsWatcher);
