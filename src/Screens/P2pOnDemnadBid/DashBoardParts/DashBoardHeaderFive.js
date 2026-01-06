import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale
} from '../../../styles/responsiveSize';
import { getImageUrl } from '../../../utils/helperFunctions';
import stylesFunc from '../styles';

import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import ButtonImage from '../../../Components/ImageComp';
import actions from '../../../redux/actions';
import { MyDarkTheme } from '../../../styles/theme';
import { getColorSchema } from '../../../utils/utils';

export default function DashBoardHeaderFive({
  // navigation = {},
  location = [],
  selcetedToggle,
  toggleData,
  isLoading = false,
  isLoadingB = false,
  _onVoiceListen = () => { },
  isVoiceRecord = false,
  onPressCenterIcon = () => { },
  _onVoiceStop = () => { },
  showAboveView = true,
  currentLocation,
  nearestLoc,
  currentLoc,
  onPressAddress = () => { }
}) {
  const navigation = useNavigation();
  const { appData, themeColors, appStyle, themeColor, themeToggle } = useSelector(
    state => state?.initBoot,
  );
  const { userData } = useSelector(state => state?.auth);


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



  return (
    <View
      style={{
        paddingHorizontal: moderateScale(16),
      }}>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

      }}>
        {!!(
          profileInfo &&
          (profileInfo?.logo || profileInfo?.dark_logo)
        ) ? (
          <FastImage
            style={{
              width: moderateScale(70),
              height: moderateScale(45),
            }}
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: imageURI,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
          />
        ) : null}
        <TouchableOpacity
          onPress={onPressAddress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',

          }}>
          <Image
            style={styles.locationIcon}
            source={imagePath.ic_map}
            resizeMode="contain"
          />
          <Text
            numberOfLines={1}
            style={

              {
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.black,
                fontFamily: fontFamily.regular,
                maxWidth: moderateScale(180),
                fontSize: textScale(12)
              }
            }>
            {currentLocation?.address || location?.address}

            {/* {!!nearestLoc  ? currentLocation?.address : nearestLoc?.address || location?.address} */}
          </Text>

          <Image source={imagePath.ic_down_arrow} />
        </TouchableOpacity>

        <ButtonImage
          onPress={() => !!userData?.auth_token ? navigation.navigate(navigationStrings.NOTIFICATION) : actions.setAppSessionData('on_login')}
          image={imagePath.ic_notification}
          imgStyle={{ tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: moderateScaleVertical(12),

        }}>
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
            height: moderateScale(48),
            borderRadius: moderateScale(8),
            backgroundColor: isDarkMode ? MyDarkTheme.colors.lightDark : colors.white,
            borderWidth: moderateScale(1),
            borderColor: isDarkMode ? MyDarkTheme.colors.lightDark : colors.borderColor
          }}>
          <TouchableOpacity
            style={{ marginHorizontal: moderateScale(8), flexDirection: "row", alignItems: "center" }}
            onPress={() =>
              navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
            }>
            <Image
              style={{
                tintColor: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.textGreyH,
              }}
              source={imagePath.icSearchNew}
            />

          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}
