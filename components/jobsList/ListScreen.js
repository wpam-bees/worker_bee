import React, { Component } from 'react';
import { View, StyleSheet, SectionList, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { List, ListItem, Divider } from 'react-native-elements';
import { connect } from 'react-redux';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { fetchNearbyJobs, fetchActiveJobs } from '../../redux/jobs';

import { headerGrey, backgroundColor, dividerGrey, honeyYellow } from '../../assets';

class ListScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    listItemHandler = (job) => {
        const { navigation } = this.props;
        navigation.navigate('Map', { job });
    };

    update = async () => {
        const { fetchNearbyJobs, fetchActiveJobs } = this.props;
        this.setState({ isLoading: true });
        await Promise.all([
            fetchNearbyJobs(),
            fetchActiveJobs(),
        ]);
        this.setState({ isLoading: false });
    }

    renderRow = ({ item }) => (
        <ListItem
            key={item.id}
            title={item.title}
            containerStyle={styles.listItem}
            subtitle={(
                <View style={styles.subtitleView}>
                    <FontAwesome name="dollar" style={styles.icon} color={honeyYellow} size={13} />
                    <Text style={styles.subtitleInfo}>{item.initial_fee ? `${item.initial_fee} zł` : '-'}</Text>
                    <FontAwesome name="compass" style={styles.icon} color={honeyYellow} size={13} />
                    <Text style={styles.subtitleInfo}>{item.distance ? `${item.distance.toFixed(3)}km` : '-'}</Text>
                </View>
            )}
            onPress={() => this.listItemHandler(item)}
            underlayColor="#F2F2F2"
        />
    );

    renderSectionHeader = ({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    renderDivider = () => (
        <Divider style={{ backgroundColor: dividerGrey }} />
    );

    listEmpty = ({ section }) => {
        if (section.data.length == 0) {
            return (
                <ListItem
                    title={`No ${section.title.toLowerCase()}`}
                    containerStyle={styles.emptyItem}
                    titleStyle={styles.emptyItemText}
                    hideChevron
                />
            );
        }
        return null;
    };

    render() {
        return (
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <List containerStyle={styles.list}>
                    <SectionList
                        sections={[
                            { title: 'Active Jobs', data: this.props.activeJobs },
                            { title: 'Available Jobs', data: this.props.jobs },
                        ]}
                        ItemSeparatorComponent={this.renderDivider}
                        renderSectionFooter={this.listEmpty}
                        renderSectionHeader={this.renderSectionHeader}
                        renderItem={this.renderRow}
                        stickySectionHeadersEnabled={false}
                        keyExtractor={job => `job-${job.id}`}
                        onRefresh={this.update}
                        refreshing={this.state.isLoading}
                    />
                </List>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
        marginTop: 20,
        backgroundColor,
    },
    subtitleView: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5,
    },
    listItem: {
        backgroundColor: 'white',
        borderBottomWidth: 0,
    },
    emptyItem: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderBottomWidth: 0,
    },
    emptyItemText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitleInfo: {
        marginRight: 10,
        fontSize: 13,
        color: honeyYellow,
    },
    sectionHeader: {
        color: headerGrey,
        backgroundColor,
        width: '100%',
        marginTop: 10,
        paddingLeft: 5,
        paddingBottom: 3,
        textTransform: 'uppercase',
    },
    icon: {
        paddingRight: 2,
    },
});

const mapStateToProps = state => ({
    jobs: state.jobs.available,
    activeJobs: state.jobs.active,
});

const mapDispatchToProps = {
    fetchNearbyJobs,
    fetchActiveJobs,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListScreen);
