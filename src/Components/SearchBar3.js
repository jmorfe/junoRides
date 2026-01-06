import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import navigationStrings from '../navigation/navigationStrings';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import { getColorSchema } from '../utils/utils';

const SearchBar3 = ({
  navigation,
  placeHolderTxt = strings.SEARCH_HERE,
  containerStyle,
  onPress = null
}) => {
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        ...styles.mainContainer,
        ...containerStyle,
      }}
      onPress={() =>
       !!onPress? onPress(): navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
      }>
      <Image source={imagePath.search2} />
      <View style={{flex: 1}}>
        <Text style={styles.placeHolderTxt}>{placeHolderTxt}</Text>
      </View>
    </TouchableOpacity>
  );
};

export function stylesFunc({fontFamily}) {
  const styles = StyleSheet.create({
    mainContainer: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      borderRadius: moderateScale(8),
      paddingHorizontal: moderateScale(15),
      marginHorizontal: moderateScale(15),
      marginVertical: moderateScale(12),
      height: moderateScaleVertical(42),
      alignItems: 'center',
    },
    placeHolderTxt: {
      fontFamily: fontFamily.regular,
      color: colors.textGreyB,
      marginLeft: moderateScale(10),
      fontSize: textScale(14),
      // textAlign: 'left',
    },
  });
  return styles;
}
export default React.memo(SearchBar3);
