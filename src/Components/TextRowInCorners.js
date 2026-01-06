import React from 'react';
import { Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import { textScale } from '../styles/responsiveSize';
import { TouchableOpacity } from 'react-native-gesture-handler';

const TextRowInCorners = ({ leftText, rightTextonPress, rightText, containerStyle = {}, lefttextStyle = {}, righttextStyle = {} }) => {
  const { appStyle } = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({ fontFamily });
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...containerStyle }}>
      <Text
        style={{
          ...commonStyles.mediumFont14,
          fontSize: textScale(14),
          color: colors.white,
          marginLeft: 2,
          opacity: 1,
          fontWeight: '600',
          ...lefttextStyle,
        }}>
        {leftText}
      </Text>
      <TouchableOpacity onPress={rightTextonPress} activeOpacity={0.3}>
        <Text
          style={{
            ...commonStyles.mediumFont14,
            fontSize: textScale(12),
            color: colors.white,
            marginLeft: 2,
            opacity: 1,
            fontWeight: '600',
            ...righttextStyle,
          }}>
          {rightText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default React.memo(TextRowInCorners);
