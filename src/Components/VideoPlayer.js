import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React, { useRef, useState } from 'react';
import Video from 'react-native-video';
import imagePath from '../constants/imagePath';
import FastImage from 'react-native-fast-image';
import { moderateScale } from '../styles/responsiveSize';
import colors from '../styles/colors';
import { useSelector } from 'react-redux';
import { UIActivityIndicator } from 'react-native-indicators';

export default function VideoComp({
    source = '',
    resizeMode = 'contain',
    containerStyle = {},
    videoStyle = {},
    currentMessage = '',
    pause = true,
    disabled = false,
}) {
    const { themeColors, appStyle } = useSelector(state => state?.initBoot || {});
    const videoRef = useRef(null);
    const styles = styleFunc({ themeColors });

    const [paused, setPaused] = useState(pause);
    const [isVideoLoaded, setisVideoLoaded] = useState(false);
    const [buffering, setBuffering] = useState(false);

    return (
        <View style={{ ...containerStyle }}>
            {!!currentMessage?.isLoading ? (
                <FastImage
                    source={{ uri: currentMessage?.mediaUrl }}
                    style={styles.thumbnail}
                />
            ) : (
                <Video
                    ref={videoRef}
                    source={source}
                    onLoad={evnt => setisVideoLoaded(true)}
                    onBuffer={isBuffering => setBuffering(isBuffering)}
                    onEnd={() => videoRef?.current.seek(0)}
                    paused={paused}
                    style={{ ...videoStyle, height: '100%', width: '100%' }}
                    resizeMode={resizeMode}
                />
            )}
            <View style={styles.controlsContainer}>
                {!paused && (!!buffering || !isVideoLoaded) ? (
                    <View style={styles.bufferingView}>
                        <UIActivityIndicator size={40} color={themeColors?.primary_color} />
                    </View>
                ) : (
                    <TouchableOpacity
                        disabled={disabled}
                        onPress={() => setPaused(!paused)}>
                        <Image
                            source={paused ? imagePath.icPlayVideo : imagePath.icPauseVideo}
                            style={styles.playPauseImg}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styleFunc = themeColors => {
    const styles = StyleSheet.create({
        thumbnail: {
            height: moderateScale(140),
            width: moderateScale(250),
            borderRadius: moderateScale(4),
        },
        controlsContainer: {
            position: 'absolute',
            alignSelf: 'center',
            height: 50,
            width: 50,
            zIndex: 1,
        },
        bufferingView: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
        },
        playPauseImg: {
            width: 50,
            height: 50,
            tintColor: colors.whiteOpacity50,
        },
    });

    return styles;
};
