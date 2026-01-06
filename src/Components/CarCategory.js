//import liraries
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical, textScale } from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getImageUrl, getScaleTransformationStyle, pressInAnimation, pressOutAnimation } from '../utils/helperFunctions';
import { getColorSchema } from '../utils/utils';




// create a component
const CarCategory = (
    { data, onPress = () => { } }
) => {
    const { appStyle, themeColors, appData, currencies, themeColor, themeToggle } = useSelector((state) => state?.initBoot || {});

    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const imageUrl =

        getImageUrl(
            data?.image.image_fit,
            data?.image.image_path,
            '150/150'
        );
    console.log(imageUrl, 'dataKyaa',data?.image)
    const scaleInAnimated = new Animated.Value(0);

    return (
        <TouchableOpacity style={{
            ...styles.mainView,
            ...getScaleTransformationStyle(scaleInAnimated),
            backgroundColor: isDarkMode ? MyDarkTheme?.colors.lightDark : colors.white

        }} onPress={onPress}
        onPressIn={() => pressInAnimation(scaleInAnimated)}
        onPressOut={() => pressOutAnimation(scaleInAnimated)}
        activeOpacity={1}
        >
            <FastImage
                style={styles.imageStyle}
                source={{
                    uri: imageUrl,
                    cache: FastImage.cacheControl.immutable,
                    priority: FastImage.priority.high,
                }}
                resizeMode="contain"

            />
            <Text numberOfLines={1}
                style={{ ...styles.titleStyle, 
                color: isDarkMode ? colors.white : colors.black }}>{data?.name}</Text>

        </TouchableOpacity>
    );
};

// define your styles
const styles = StyleSheet.create({
    mainView: {
        paddingVertical: moderateScaleVertical(10),
        elevation: 2,
        marginRight: moderateScale(5),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        padding: moderateScaleVertical(14),
        margin:3
    }, imageStyle: {
        height: moderateScale(60),
        width: moderateScale(60)
    },
    titleStyle: {
        fontSize: textScale(12),
        textAlign: 'center',
        maxWidth: moderateScale(60),
        marginTop: moderateScaleVertical(6)
    }
});

//make this component available to the app
export default CarCategory;

