import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical
} from '../../../styles/responsiveSize';

import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import CustomAnimatedLoader from '../../../Components/CustomAnimatedLoader';
import DeliveryTypeComp from '../../../Components/DeliveryTypeComp';
import {
  loaderOne
} from '../../../Components/Loaders/AnimatedLoaderFiles';
import strings from '../../../constants/lang';
import { MyDarkTheme } from '../../../styles/theme';
import { getColorSchema } from '../../../utils/utils';

export default function DashBoardHeaderSeven({
  // navigation = {},
  location = [],
  selcetedToggle,
  toggleData,
  isLoading = false,
  isLoadingB = false,
  _onVoiceListen = () => { },
  isVoiceRecord = false,
  _onVoiceStop = () => { },
  showAboveView = true,
  curLatLong = {},
}) {
  const navigation = useNavigation();
  const { appData, themeColors, appStyle, themeColor, themeToggle } = useSelector(
    (state) => state?.initBoot,
  );
  const { dineInType } = useSelector(
    (state) => state?.home,
  );
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;

  return (
    <View
      style={{
        marginHorizontal: moderateScale(15),
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: moderateScaleVertical(15),
          marginBottom: moderateScaleVertical(5),
        }}>

        {appStyle?.homePageLayout == 10 ? <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.openDrawer()}
          style={{ alignItems: 'center', }}>
          <Image
            style={{
              tintColor: themeColors.primary_color,
              marginRight: moderateScale(16),
              height: moderateScale(24),
              width: moderateScale(24),
            }}
            source={imagePath.icHamburger}
            resizeMode="contain"
          />
        </TouchableOpacity> : null}

        <TouchableOpacity
          style={{ flexDirection: 'row' }}
          activeOpacity={0.7}
          disabled={dineInType !== "p2p" && !appData?.profile?.preferences?.is_hyperlocal}
          onPress={() =>
            navigation.navigate(navigationStrings.LOCATION, {
              type: 'Home1',
            })
          }>
          <Image source={imagePath.location1} />
          {(!appData?.profile?.preferences?.is_hyperlocal && dineInType !== "p2p") ? (
            <Text
              numberOfLines={1}
              style={{
                marginLeft: 8,
                fontFamily: fontFamily?.regular,
                color: isDarkMode ? MyDarkTheme?.colors?.text : colors.black,
              }}>
              {!isEmpty(curLatLong)
                ? `${curLatLong?.address?.substring(0, 30)} ${curLatLong?.address?.length >= 30 ? '...' : ''
                }`
                : ''}
            </Text>
          ) : (
            <Text
              numberOfLines={1}
              style={{
                marginLeft: 8,
                fontFamily: fontFamily?.regular,
                color: isDarkMode ? MyDarkTheme?.colors?.text : colors.black,
              }}>
              {location?.address?.substring(0, 30)}{' '}
              {location?.address?.length >= 30 ? '...' : ''}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <DeliveryTypeComp
        selectedToggle={selcetedToggle}
        tabMainStyle={{
          marginBottom: 0,
        }}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
        style={{
          backgroundColor: isDarkMode
            ? colors.whiteOpacity22
            : colors.blackOpacity05,
          borderRadius: moderateScale(12),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: moderateScaleVertical(14),
          paddingHorizontal: moderateScale(10),
          marginVertical: moderateScaleVertical(15),
        }}>
        <Text
          style={{
            fontFamily: fontFamily.regular,
            color: isDarkMode
              ? MyDarkTheme?.colors?.text
              : colors.blackOpacity66,
          }}>
          Search here.....
        </Text>
        <Image
          style={{
            tintColor: isDarkMode
              ? MyDarkTheme.colors.text
              : colors.blackOpacity43,
          }}
          source={imagePath.search3}
        />
      </TouchableOpacity>

      <CustomAnimatedLoader
        source={loaderOne}
        loaderTitle={strings.LOADING}
        containerColor={
          isDarkMode ? MyDarkTheme.colors.lightDark : colors.white
        }
        loadercolor={themeColors.primary_color}
        animationStyle={[
          {
            height: moderateScaleVertical(40),
            width: moderateScale(40),
          },
        ]}
        visible={isLoadingB}
      />
    </View>
  );
}
