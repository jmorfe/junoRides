import React from 'react';
import { Image } from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import { moderateScale } from '../styles/responsiveSize';
import { getColorSchema } from '../utils/utils';
const RoundImg = ({imgStyle = {}, img = {}, size = 76}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  return (
    <Image
      style={{
        width: moderateScale(size),
        height: moderateScale(size),
        borderRadius: moderateScale(size / 2),
        backgroundColor: isDarkMode
          ? colors.whiteOpacity15
          : colors.blackOpacity10,
        ...imgStyle,
      }}
      source={{uri: img}}
    />
  );
};

export default React.memo(RoundImg);
