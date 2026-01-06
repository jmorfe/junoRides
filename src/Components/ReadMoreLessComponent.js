import React, { memo } from 'react';
import { Text } from 'react-native';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';

const ReadMoreLessComponent = ({
  maxLength = 100,
  text,
  readMore,
  toggleExpanded = () => {},
}) => {

  const truncatedText =
    text.length > maxLength ? text.substring(0, maxLength) : text;
  return (
    <>
      <Text
        style={{
          marginTop: moderateScaleVertical(8),
          color: colors.textColor,
          marginHorizontal: moderateScale(2),
        }}>
        {readMore ? text : truncatedText}
        <Text style={{   color: colors.black}}
        onPress={toggleExpanded}>
          ...{readMore ? 'Read Less' : 'Read more'}
        </Text>
      </Text>
      {/* )} */}
    </>
  );
};

export default memo(ReadMoreLessComponent);
