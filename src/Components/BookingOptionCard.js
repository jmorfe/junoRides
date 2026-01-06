import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import commonFum from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getColorSchema } from '../utils/utils';
const BookingOptionCard = ({item, index, onPress = () => {}, data}) => {
  const darkthemeusingDevice = getColorSchema();
  const {themeColors, appStyle, themeColor, themeToggle} = useSelector(
    state => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const commonStyles = commonFum({
    fontFamily,
    themeColors,
    isDarkMode,
    MyDarkTheme,
  });
  console.log(data?.cart_booking_options?.booking_option?.id
    , 'datadatadatadatadatadata',item?.booking_option?.id    );
  return (
    <TouchableOpacity
      style={{
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.greyColor,
        ...styles.flatview,
        borderWidth: 1,
        borderColor: !!data?.cart_booking_options?.booking_option?.id == item?.booking_option?.id  ? themeColors?.primary_color: colors.greyColor
      }}
      onPress={onPress}>
      <Image source={imagePath.pricecard} />
      <View style={styles.bottomspaceview}>
        <Text
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            ...styles.pricetxt,
          }}>
          {!!data?.cart_booking_options?.title
            ? data?.cart_booking_options?.title
            : item?.booking_option?.title}
        </Text>
        <Text
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            ...styles.savemoneytxt,
            maxWidth:width/1.3
          }}>
          {!!data?.cart_booking_options?.description
            ? data?.cart_booking_options?.description
            : item?.booking_option?.description}
        </Text>
        {/* {[1, 2].map(() => {
        return (
          <View style={styles.descview}>
            <Image source={imagePath.tickrental} />
            <Text
              style={{
                fontSize: textScale(12),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.black,
              }}>
              {item?.booking_option?.description}
            </Text>
          </View>
        );
      })} */}
        {/* <Text
        style={{
          fontSize: textScale(14),
          color: isDarkMode
            ? MyDarkTheme.colors.text
            : colors.atlanticgreen,
          fontFamily: fontFamily.semiBold,
        }}>
        {strings.included}
      </Text> */}
      </View>
    </TouchableOpacity>
  );
};

export default memo(BookingOptionCard);

const styles = StyleSheet.create({
  flatview: {
    marginBottom: moderateScaleVertical(18),
    flexDirection: 'row',
    padding: moderateScale(12),
    borderRadius: moderateScale(4),
  },
  pricetxt: {
    fontSize: textScale(14),
    fontFamily: fontFamily.bold,
  },
  bottomspaceview: {marginLeft: moderateScale(20)},
  savemoneytxt: {
    fontSize: textScale(12),
    marginVertical: moderateScaleVertical(10),
  },
});
