import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical, textScale, width } from '../styles/responsiveSize';
import { getImageUrl } from '../utils/helperFunctions';
import { getColorSchema } from '../utils/utils';

export default function CategoriesCard({ item = {}, onPress = () => { } }) {
    const {
        appStyle,
        themeToggle,
        themeColor
    } = useSelector(state => state?.initBoot);
    const fontFamily = appStyle?.fontSizeData;
    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

    let imageURI = getImageUrl(
        item?.icon?.image_fit,
        item?.icon?.image_path,
        '1000/1000',
    );
    return (
        <TouchableOpacity style={{
            borderRadius: moderateScale(16),

        }} onPress={onPress}>
            <View style={{
                borderRadius: moderateScale(16),
                height: moderateScaleVertical(149),
                width: ((width - moderateScale(48)) / 2),
                position: "absolute",
                backgroundColor: colors.blackOpacity30,
                zIndex: 1
            }} />
            <FastImage
                style={{
                    borderRadius: moderateScale(16),
                    height: moderateScaleVertical(149),
                    width: ((width - moderateScale(48)) / 2),
                }}
                // onError={() => {
                //     setisValidImg(false)
                // }}
                source={{
                    uri: imageURI, cache: FastImage.cacheControl.immutable,
                    priority: FastImage.priority.high,
                }} />
            <Text
                numberOfLines={2}
                style={{
                    position: 'absolute', bottom: 10, left: 10, color: colors.white,
                    fontFamily: fontFamily?.medium, fontSize: textScale(16), zIndex: 2,
                    paddingRight: moderateScale(6)
                }}>{item?.name}</Text>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})