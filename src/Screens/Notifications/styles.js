import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';

export default ({ fontFamily }) => {
  const commonStyles = commonStylesFunc({ fontFamily });
  const styles = StyleSheet.create({
    backTextWhite: {
      color: '#FFF',
    },
    rowFront: {
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderBottomColor: 'black',
      borderBottomWidth: 1,
      justifyContent: 'center',
      height: 50,
    },
    rowBack: {
      alignItems: 'center',
      backgroundColor: 'transparent',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      // paddingLeft: 15,
    },
    backRightBtn: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      width: 75,
    },
    backRightBtnLeft: {
      backgroundColor: 'transparent',
      right: 38,
    },
    backRightBtnRight: {
      backgroundColor: 'transparent',
      right: 0,
    },

    container: {
      backgroundColor: colors.white,
      marginHorizontal: moderateScale(16),
      padding: moderateScale(8),
      borderRadius: moderateScale(6)
    },
    status: {
      color: colors.yellowText,
      textTransform: 'uppercase',
      fontFamily: fontFamily.bold,
      fontSize: textScale(12),
    },
    mesasge: {
      ...commonStyles.mediumFont14Normal,
      color: colors.buyBgDark,
    },
    time: {
      color: colors.buyBgDark,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      opacity: 0.5,
    },
    headerLine: {
      ...commonStyles.headerTopLine,
    },
    cardView: {
      flex: 0.13,
      justifyContent: 'center',
      marginBottom: moderateScaleVertical(30),
    },
    descText: {
      color: colors.buyBgDark,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      opacity: 0.5,
      marginTop: moderateScaleVertical(6),
    },
    cardView2: { flex: 0.15, justifyContent: 'center' },
    cardView3: {
      padding: 5,
      alignItems: 'center',
      backgroundColor: colors.yellowB,
      borderRadius: moderateScale(5),
    },
    containerStyle: {
      flexGrow: 1,
      marginTop: moderateScaleVertical(20),
      paddingBottom: moderateScaleVertical(80),
    }
  });
  return styles;
};
