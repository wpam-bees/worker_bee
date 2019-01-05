import { Component } from 'react';
import { connect } from 'react-redux';

import { setLocation } from '../redux/user';

const LOCATION_SETTINGS = {
    maximumAge: 1000,
};

class LocationWatcher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            locationWatcher: null,
        };
    }

    componentDidMount() {
        this.watchLocation();
    }

    componentWillUnmount() {
        if (this.state.locationWatcher !== null) {
            navigator.geolocation.clearWatch(this.state.locationWatcher);
        }
    }

    updateLocation = (newLocation) => {
        this.props.setLocation(newLocation.coords);
    }

    watchLocation() {
        const watcherId = navigator.geolocation.watchPosition(
            this.updateLocation,
            () => { console.warn('Error getting current location'); },
            LOCATION_SETTINGS,
        );
        this.setState({ locationWatcher: watcherId });
    }

    render() {
        return null;
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
    setLocation,
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationWatcher);
