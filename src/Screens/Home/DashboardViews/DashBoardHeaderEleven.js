import React from 'react';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import { height, moderateScale, moderateScaleVertical, textScale, width } from '../../../styles/responsiveSize';
import { getImageUrl } from '../../../utils/helperFunctions';
import stylesFunc from '../styles';

import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import DeliveryTypeComp from '../../../Components/DeliveryTypeComp';
import strings from '../../../constants/lang';
import { MyDarkTheme } from '../../../styles/theme';
import { getColorSchema } from '../../../utils/utils';


function DashBoardHeaderEleven({
    location = [],
    selcetedToggle,
    animation

}) {
    const navigation = useNavigation();
    const { appData, themeColors, appStyle, themeColor, themeToggle } = useSelector((state) => state?.initBoot);
    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

    const profileInfo = appData?.profile;
    const fontFamily = appStyle?.fontSizeData;
    const styles = stylesFunc({ themeColors, fontFamily });

    const imageURI = getImageUrl(
        isDarkMode
            ? profileInfo?.dark_logo?.image_fit
            : profileInfo?.logo?.image_fit,
        isDarkMode
            ? profileInfo?.dark_logo?.image_path
            : profileInfo?.logo?.image_path,
        '200/400',
    );

    const headerUperView = useAnimatedStyle(() => {
        const heightv = interpolate(animation.value,
            [0, 100, 0],
            [height / 14, 0, height / 14],
            Extrapolate.CLAMP
        )
        const opacity = interpolate(animation.value,
            [0, 100, 0],
            [1, 0, 1],
            Extrapolate.CLAMP
        )
        console.log("heightvheightv", heightv)
        return {
            height: heightv,
            opacity
        }
    })


    return (
        <View
            style={{
                borderBottomColor: isDarkMode
                    ? colors.whiteOpacity22
                    : colors.white,
                backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white
            }}>

            <Animated.View
                // style={[{
                
                // }, headerUperView]}
                >
                <View
                    style={{
                        ...styles.headerContainer,
                        borderBottomColor: isDarkMode
                            ? colors.whiteOpacity22
                            : colors.borderColorD,
                        // borderBottomWidth: 0,
                    }}>

                    {appStyle?.homePageLayout == 10 ? <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => navigation.openDrawer()}
                        style={{ alignItems: 'center', }}>
                        <Image
                            style={{
                                tintColor: themeColors.primary_color,
                                marginRight: moderateScale(16),
                                height: moderateScale(20),
                                width: moderateScale(20),
                            }}
                            source={imagePath.icMenuIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity> : null}
                    <View
                        style={{
                            flexDirection: 'row',
                            flex: 1,
                            alignItems: 'center',
                        }}>
                        {!!(
                            profileInfo &&
                            (profileInfo?.logo || profileInfo?.dark_logo)
                        ) ? (
                            <FastImage
                                style={{
                                    width: moderateScale(width / 6),
                                    height: moderateScale(40),
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                                source={{
                                    uri: imageURI,
                                    priority: FastImage.priority.high,
                                    cache: FastImage.cacheControl.immutable,
                                }}
                            />
                        ) : null}
                        {!!appData?.profile?.preferences?.is_hyperlocal && (
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() =>
                                    navigation.navigate(navigationStrings.LOCATION, {
                                        type: 'Home1',
                                    })
                                }
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    flex: 0.85,
                                    marginLeft: moderateScale(8),
                                }}>
                                <View>
                                    {!!location?.type && (
                                        <Text numberOfLines={1} style={[styles.locationTypeTxt, {
                                            color: isDarkMode
                                                ? MyDarkTheme.colors.text
                                                : colors.black,
                                            fontFamily: fontFamily.medium,
                                        }]}>
                                            {location?.type === 3
                                                ? !!(
                                                    location?.type_name != 0 &&
                                                    location?.type != '0' &&
                                                    location?.type_name !== null
                                                )
                                                    ? location?.type_name
                                                    : strings.UNKNOWN
                                                : location?.type === 2
                                                    ? strings.WORK
                                                    : strings.HOME}
                                        </Text>
                                    )}

                                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                ...styles.locationTxt,
                                                color: isDarkMode
                                                    ? MyDarkTheme.colors.text
                                                    : colors.blackOpacity43,
                                                fontFamily: fontFamily.medium,
                                                marginRight: moderateScale(4)
                                            }}>
                                            {location?.address}
                                        </Text>
                                        <Image source={imagePath.icDropdown4} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Animated.View>
            <Pressable
                onPress={() =>
                    navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
                }
                style={{
                    ...styles.searchStyle,
                    borderColor: isDarkMode ? 'transparent' : colors.grayLight,
                    backgroundColor: isDarkMode
                        ? colors.whiteOpacity15
                        : colors.white,
                    marginBottom: moderateScaleVertical(8)
                }}
            >
                <Image
                    style={{
                        tintColor: isDarkMode ? MyDarkTheme.colors.text : colors. black,
                    }}
                    source={imagePath.search4}
                />

                <Text style={{
                    fontFamily: fontFamily.regular,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity40,
                    fontSize: textScale(12),
                    marginLeft: moderateScale(8)

                }}>{'Type what you are looking for....'}</Text>

            </Pressable>


            <DeliveryTypeComp
                selectedToggle={selcetedToggle}
                tabMainStyle={{
                    marginBottom: 0,
                }}
            />


        </View>
    );
}


export default React.memo(DashBoardHeaderEleven)