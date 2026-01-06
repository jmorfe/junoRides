import moment from 'moment';
import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import { hitSlopProp } from '../styles/commonStyles';
import {
    moderateScale,
    moderateScaleVertical,
    textScale,
} from '../styles/responsiveSize';
import { getColorSchema } from '../utils/utils';
import VideoPlayer from './VideoPlayer';

const ChatMedia = ({
    currentMessage = {},
    isRight = false,
    onPressMedia = () => { },
    containerStyle = {},
}) => {
    const { themeColor, themeToggle, themeColors, appStyle } = useSelector(
        state => state?.initBoot || {},
    );
    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const fontFamily = appStyle?.fontSizeData;
    const styles = styleFunc({ fontFamily, themeColors, isDarkMode });

    let docName =
        ((currentMessage?.mediaType == 'application/pdf' ||
            currentMessage?.mediaType == 'docs') &&
            currentMessage?.name) ||
        decodeURIComponent(currentMessage?.mediaUrl).substring(
            decodeURIComponent(currentMessage?.mediaUrl).lastIndexOf('/') + 1,
        );

    const getImgSrc = () => {
        return docName?.includes('.pdf')
            ? imagePath.icPdf
            : docName?.includes('.zip')
                ? imagePath.icZip
                : docName?.includes('.xls') ?
                    imagePath.icXls
                    : docName?.includes('.ppt')
                        ? imagePath.icPpt
                        : imagePath.icDocx
    };

    return (
        <View
            style={{
                marginBottom: moderateScale(10),
                alignSelf: isRight ? 'flex-end' : 'flex-start',
                marginHorizontal: moderateScale(8),
            }}>

            <TouchableOpacity
                hitSlop={hitSlopProp}
                disabled={!!currentMessage?.isLoading}
                activeOpacity={0.7}
                onPress={onPressMedia}
                style={{
                    ...styles.mainContainer,
                    backgroundColor:
                        isRight
                            ? isDarkMode
                                ? '#005246'
                                : themeColors?.primary_color
                            : isDarkMode
                                ? '#363638'
                                : colors.whiteSmokeColor,
                    borderTopLeftRadius: moderateScale(12),
                    borderTopRightRadius: moderateScale(12),
                    borderBottomRightRadius: !isRight ? moderateScale(16) : 0,
                    borderBottomLeftRadius: isRight ? moderateScale(16) : 0,
                    zIndex: 2,

                    ...containerStyle,
                }}>
                {!isRight && (currentMessage?.username || currentMessage?.phone_num) ? (
                    <Text
                        style={styles.userName}>
                        {currentMessage?.username || currentMessage?.phone_num}{' '}

                    </Text>
                ) : null}

                {currentMessage?.mediaType == 'application/pdf' ||
                    currentMessage?.mediaType == 'docs' ? (
                    <View
                        style={{
                            ...styles.chatMsgStyle,
                            height: moderateScaleVertical(80),
                        }}>
                        <Image
                            source={getImgSrc()}
                            style={styles.docTypeImg}
                        />

                        <Text
                            numberOfLines={1}
                            style={styles.docTypeTxt}>
                            {docName}
                        </Text>


                    </View>
                ) : currentMessage?.mediaType == 'video/mp4' ? (
                    <View
                        containerStyle={{
                            ...styles.chatMsgStyle,

                        }}>
                        <VideoPlayer
                            onPress={onPressMedia}
                            disabled
                            currentMessage={currentMessage}
                            containerStyle={{
                                ...styles.chatMsgStyle,
                                backgroundColor: colors.blackOpacity05,
                                borderRadius: moderateScale(4)
                            }}
                            source={{ uri: currentMessage?.mediaUrl }}
                            videoStyle={{
                                ...styles.chatMsgStyle,
                            }}
                            resizeMode="contain"
                        />
                    </View>
                ) : (
                    <View
                        style={{
                            ...styles.chatMsgStyle,
                        }}>
                        <FastImage
                            source={{ uri: currentMessage?.mediaUrl }}
                            style={styles.imgStyle}
                        />
                    </View>
                )}
                <Text
                    style={{
                        ...styles.dateTxt,
                        color: isDarkMode
                            ? '#84acaa'
                            : colors.whiteOpacity77,
                    }}>
                    {moment(currentMessage?.created_date).format('LT')}
                </Text>
            </TouchableOpacity>
            {!!currentMessage?.isLoading && (
                <Text
                    style={styles.sending}>
                    sending...
                </Text>
            )}
        </View>
    );
};

export default memo(ChatMedia);

const styleFunc = ({ fontFamily, themeColors, isDarkMode }) => {
    const styles = StyleSheet.create({
        mainContainer: {
            padding: 6,
            borderBottomLeftRadius: moderateScale(12),
            borderBottomRightRadius: moderateScale(12),
        },
        imgStyle: {
            height: moderateScale(140),
            width: moderateScale(250),
            borderRadius: moderateScale(4),
        },
        chatMsgStyle: {
            height: moderateScale(140),
            width: moderateScale(250),
            alignItems: 'center',
            justifyContent: 'center',
        },
        dateTxt: {
            fontSize: textScale(10),
            fontFamily: fontFamily.regular,
            textTransform: 'uppercase',
            color: colors.whiteOpacity77,
            marginLeft: moderateScale(12),
            marginTop: moderateScaleVertical(6),
            alignSelf: 'flex-end',
        },
        userName: {
            fontSize: textScale(12),
            fontFamily: fontFamily.medium,
            textTransform: 'capitalize',
            color: isDarkMode ? colors.white : colors.black,
            marginBottom: moderateScaleVertical(4)
        },
        docTypeImg: {
            height: moderateScale(35),
            width: moderateScale(35),
            resizeMode: "contain"
        },
        docTypeTxt: {
            fontFamily: fontFamily?.regular,
            fontSize: textScale(14),
            textAlign: "center",
            marginTop: moderateScaleVertical(4),
            color: colors.white
        },
        sending: {
            textAlign: 'right',
            fontSize: textScale(12),
            color: colors.textGreyB,
        }
    });
    return styles;
};
