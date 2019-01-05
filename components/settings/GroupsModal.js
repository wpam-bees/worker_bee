import React, { Component } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Divider, ListItem } from 'react-native-elements';

import { connect } from 'react-redux';

import { fetchGroups, toggleGroup } from '../../redux/groups';
import { api } from '../../App';

import InputRow from '../basicUI/InputRow';

import { appleBlue, dividerGrey } from '../../assets';


class GroupsModal extends Component {
    static navigationOptions = () => ({
        title: 'Choose Groups',
    })

    constructor(props) {
        super(props);

        this.state = {
            query: '',
            isLoading: false,
        };

        props.fetchGroups();
    }

    onRefresh = async () => {
        const { fetchGroups } = this.props;
        await this.setState({isLoading: true});
        await fetchGroups();
        await this.setState({isLoading: false});
    }

    filterGroups = (groups, query = '') => groups.filter(
        group => group.name.toLowerCase().startsWith(query.toLowerCase()),
    );

    renderSearch = () => (
        <InputRow
            containerStyle={styles.searchContainer}
            inputStyle={styles.searchInput}
            placeholder="Search"
            onChangeText={query => this.setState({ query })}
        />
    )

    renderRow = row => (
        <ListItem
            title={row.item.name}
            containerStyle={styles.listItem}
            hideChevron
            switchButton
            switched={row.item.active}
            onSwitch={value => this.props.toggleGroup(row.item, value)}
        />
    )

    renderEmpty = () => {
        return (
            <ListItem
                title="No groups found"
                containerStyle={styles.emptyItem}
                titleStyle={styles.emptyItemText}
                hideChevron
            />
        );
    }

    render() {
        const { groups } = this.props;
        const { query, isLoading } = this.state;
        return (
            <FlatList
                data={this.filterGroups(groups, query)}
                ListHeaderComponent={this.renderSearch}
                ListEmptyComponent={this.renderEmpty}
                ItemSeparatorComponent={() => (<Divider style={styles.divider} />)}
                renderItem={this.renderRow}
                keyExtractor={item => String(item.id)}
                onRefresh={this.onRefresh}
                refreshing={isLoading}
            />
        );
    }
}

const styles = StyleSheet.create({
    searchInput: {
        backgroundColor: 'rgb(223, 226, 232)',
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    divider: {
        backgroundColor: dividerGrey,
    },
    searchContainer: {
        backgroundColor: 'white',
        borderTopWidth: 0,
        borderBottomColor: dividerGrey,
        borderBottomWidth: StyleSheet.hairlineWidth,
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
});

const mapStateToProps = state => ({
    groups: state.groups,
});


const mapDispatchToProps = {
    fetchGroups,
    toggleGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsModal);
