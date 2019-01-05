import React from 'react';
import { Marker, Callout } from 'react-native-maps';

export default (props) => {
    const { location, job, onPress, color } = props;
    if (location) {
        const coords = {
            latitude: location.coordinates[0],
            longitude: location.coordinates[1],
        };
        return (
            <Marker
                coordinate={coords}
                onPress={() => onPress(job)}
                pinColor={color}
            />
        );
    }
    return null;
};
