import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import {
    moderateScale,
    moderateScaleVertical,
    textScale
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getImageUrl } from '../utils/helperFunctions';
import { getColorSchema } from '../utils/utils';

const HomeCategoryCard5 = ({
    data = {},
    onPress = () => { },
    isLoading = false,
}) => {
    const theme = useSelector(state => state?.initBoot?.themeColor);
    const toggleTheme = useSelector(state => state?.initBoot?.themeToggle);
    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
    const { appStyle } = useSelector(state => state?.initBoot);
    const fontFamily = appStyle?.fontSizeData;

    const imageURI = getImageUrl(
        data?.icon?.image_fit,
        data?.icon?.image_path,
        '160/160',
    );

    const isSVG = imageURI ? imageURI.includes('.svg') : null;

    const onLoad = evl => { };

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View
                style={{

                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: colors.textGreyLight,
                }}>
                {isSVG ? (
                    <SvgUri
                        height={moderateScale(60)}
                        width={moderateScale(60)}
                        uri={imageURI}
                        style={{}}
                    />
                ) : (
                    <View>
                        <FastImage
                            style={{
                                height: moderateScale(50),
                                width: moderateScale(50),
                                borderRadius: moderateScale(12),
                            }}
                            source={{
                                uri: imageURI,
                                cache: FastImage.cacheControl.immutable,
                                priority: FastImage.priority.high,
                            }}
                            resizeMode="cover"
                            onLoad={onLoad}
                        />
                    </View>
                )}
            </View>
            <View>
                <Text
                    // numberOfLines={1}
                    style={{
                        color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity70,
                        fontFamily: fontFamily?.medium,
                        fontSize: textScale(11),
                        textAlign: 'center',
                        marginTop: moderateScaleVertical(12)
                    }}>
                    {data.name}
                </Text>
            </View>
        </TouchableOpacity>
    );
};
export default React.memo(HomeCategoryCard5);
const styles = StyleSheet.create({});
