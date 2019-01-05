import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Interactable from 'react-native-interactable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { appleBlue, honeyYellow, appleRed, disabledButtonGrey } from '../../assets';

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};

const offsetToHide = Screen.height - 100;
const offsetRolled = Screen.height - 175;
const offsetUnrolled = 250;

export default class DetailsPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            unrolled: false,
        };
    }

    onAlert = (event) => {
        if (event.nativeEvent.hidden === 'enter') {
            this.setState({ unrolled: false });
            this.props.stateChanged('hidden', 0);
        }
    }

    onSnap = (event) => {
        if (event.nativeEvent.id === 'unrolled') {
            this.setState({ unrolled: true });
            this.props.stateChanged('unrolled', offsetUnrolled);
        } else if (event.nativeEvent.id === 'rolled') {
            this.setState({ unrolled: false });
            this.props.stateChanged('rolled', offsetRolled);
        } else {
            this.setState({ unrolled: false });
        }
    }

    unroll = () => {
        setTimeout(() => {
            this._interactable.snapTo({ id: 'unrolled' });
        }, 0);
    }

    renderActionButton = () => {
        const { job, acceptOffer, markFinished, loading } = this.props;
        if (job.active) {
            return (
                <TouchableOpacity
                    onPress={() => acceptOffer(job)}
                    disabled={loading}
                >
                    <View style={styles.panelButton}>
                        {
                            loading
                                ? <ActivityIndicator color="white" />
                                : <Text style={styles.panelButtonTitle}>Accept offer</Text>
                        }
                    </View>
                </TouchableOpacity>
            );
        }
        if (job.status === 'Progress') {
            return (
                <TouchableOpacity
                    onPress={() => markFinished(job)}
                    disabled={loading}
                >
                    <View style={{ ...styles.panelButton, backgroundColor: appleRed }}>
                        {
                            loading
                                ? <ActivityIndicator color="white" />
                                : <Text style={styles.panelButtonTitle}>Mark finished</Text>
                        }
                    </View>
                </TouchableOpacity>
            );
        }
        if (job.status === 'Marked finished') {
            return (
                <TouchableOpacity
                    disabled
                >
                    <View style={{ ...styles.panelButton, backgroundColor: disabledButtonGrey }}>
                        <Text style={styles.panelButtonTitle}>Waiting for acceptance</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity
                disabled
            >
                <View style={{ ...styles.panelButton, backgroundColor: disabledButtonGrey }}>
                    {
                        loading
                            ? <ActivityIndicator color="white" />
                            : <Text style={styles.panelButtonTitle}>Finished</Text>
                    }
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const { job, mapPadding } = this.props;
        return (
            <View style={styles.panelContainer} pointerEvents={'box-none'}>
                <Interactable.View
                    ref={(component) => { this._interactable = component; }}
                    verticalOnly
                    snapPoints={[{ id: 'unrolled', y: offsetUnrolled }, { id: 'rolled', y: offsetRolled }]}
                    alertAreas={[
                        { id: 'hidden', influenceArea: { top: offsetToHide } },
                        { id: 'unrolled', influenceArea: { top: Screen.height - 300 } },
                    ]}
                    onAlert={this.onAlert}
                    onSnap={this.onSnap}
                    boundaries={{ top: 20 }}
                    initialPosition={{ y: offsetRolled }}
                    animatedValueY={mapPadding}
                >
                    <View style={styles.panel} pointerEvents={this.state.unrolled ? 'auto' : 'none'}>
                        <View style={styles.panelHeader}>
                            <View style={styles.panelHandle} />
                        </View>
                        <ScrollView>
                            <Text style={styles.panelTitle}>{job.title}</Text>
                            <Text>
                                <FontAwesome name="dollar" color={honeyYellow} size={13} />
                                <Text style={{ color: honeyYellow }}> {job.initial_fee} zł</Text>
                            </Text>
                            <Text
                                style={styles.panelSubtitle}
                                numberOfLines={null}
                            >
                                {job.description}
                            </Text>
                            {
                                this.renderActionButton()
                            }
                        </ScrollView>
                    </View>
                </Interactable.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#efefef',
    },
    panelContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    panel: {
        height: Screen.height + 300,
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 5,
        shadowOpacity: 0.4,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 10,
    },
    panelButton: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: appleBlue,
        alignItems: 'center',
        marginVertical: 10,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    photo: {
        width: Screen.width - 40,
        height: 225,
        marginTop: 30,
    },
    map: {
        height: Screen.height,
        width: Screen.width,
    },
});
