//import liraries
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { hitSlopProp } from '../styles/commonStyles';

// create a component
const ButtonImage = ({
    image = '',
    imgStyle = {},
    onPress = () => { },
    btnStyle = {}
}) => {
    return (
        <TouchableOpacity
            hitSlop={hitSlopProp}
            style={{ ...btnStyle }}
            onPress={onPress}
        >
            <Image
                source={image}
                style={{ ...imgStyle }}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );
};


export default ButtonImage;
