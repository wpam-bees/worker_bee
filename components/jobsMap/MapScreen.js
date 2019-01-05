import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { connect } from 'react-redux';

import { markAccepted, markFinished } from '../../redux/jobs';

import JobMarker from './JobMarker';
import DetailsPanel from './DetailsPanel';
import { api } from '../../App';

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 75,
};

class MapScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedJob: null,
            isLoading: false,
            mapPadding: { bottom: 0 },
        };
    }

    componentDidMount() {
        this._navParamListener = this.props.navigation.addListener(
            'didFocus',
            () => this.parseNavigatorParams(),
        );
    }

    componentWillUnmount() {
        if (this._navParamListener) {
            this._navParamListener.remove();
        }
    }

    async getJobLocationOffset(originalLocation) {
        const originalPoint = await this._map.pointForCoordinate(originalLocation);
        const newPoint = {
            x: originalPoint.x,
            y: originalPoint.y + (Screen.height - 250) / 2,
        };
        return this._map.coordinateForPoint(newPoint);
    }

    enlargeJob = async (job) => {
        const originalCoordinates = job.location ? {
            latitude: job.location.coordinates[0],
            longitude: job.location.coordinates[1],
        } : this.props.location;
        this._map.animateToCoordinate(
            await this.getJobLocationOffset(originalCoordinates),
            200,
        );
    }

    parseNavigatorParams = () => {
        const { navigation } = this.props;
        const job = navigation.getParam('job', null);
        if (job) {
            this.setState({ selectedJob: job });
            navigation.setParams({ ...navigation.state.params, job: null });
            setTimeout(() => {
                this._detailsPanel.unroll();
            }, 0);
        }
    }

    detailsStateChange = (newState, offset) => {
        if (newState === 'unrolled') {
            this.enlargeJob(this.state.selectedJob);
        } else if (newState === 'hidden') {
            this.setState({ selectedJob: null });
        }
    }

    acceptOffer = async (job) => {
        const { markAccepted } = this.props;
        this.setState({ isLoading: true });
        const respData = await markAccepted(job);
        if (respData) {
            this.setState({ selectedJob: respData });
        }
        this.setState({ isLoading: false });
    }

    markFinished = async (job) => {
        const { markFinished } = this.props;
        this.setState({ isLoading: true });
        const respData = await markFinished(job);
        if (respData) {
            this.setState({ selectedJob: respData });
        }
        this.setState({ isLoading: false });
    }

    render() {
        const { location, jobs, activeJobs } = this.props;
        let initialRegion;
        if (location) {
            const { latitude, longitude } = location;
            initialRegion = {
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };
        } else {
            initialRegion = null;
        }
        return (
            <View style={styles.container}>
                <MapView
                    ref={(map) => { this._map = map; }}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={initialRegion}
                    showsUserLocation
                    showsMyLocationButton
                    mapPadding={this.state.mapPadding}
                >
                    {
                        jobs.map(job => (
                            <JobMarker
                                key={job.id}
                                location={job.location}
                                job={job}
                                onPress={selectedJob => this.setState({ selectedJob })}
                                color='red'
                            />
                        ))
                    }
                    {
                        activeJobs.map(job => (
                            <JobMarker
                                key={job.id}
                                location={job.location}
                                job={job}
                                onPress={selectedJob => this.setState({ selectedJob })}
                                color='green'
                            />
                        ))
                    }
                </MapView>
                {
                    this.state.selectedJob && (
                        <DetailsPanel
                            ref={(component) => { this._detailsPanel = component; }}
                            job={this.state.selectedJob}
                            stateChanged={this.detailsStateChange}
                            acceptOffer={this.acceptOffer}
                            markFinished={this.markFinished}
                            loading={this.state.isLoading}
                        />
                    )

                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});

const mapStateToProps = state => ({
    jobs: state.jobs.available,
    activeJobs: state.jobs.active,
    location: state.user.location,
});

const mapDispatchToProps = {
    markAccepted,
    markFinished,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
