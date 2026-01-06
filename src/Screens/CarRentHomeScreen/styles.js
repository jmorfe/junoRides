import { StyleSheet } from "react-native"
import { moderateScale, moderateScaleVertical, textScale, width } from "../../styles/responsiveSize";
import fontFamily from "../../styles/fontFamily";
import colors from "../../styles/colors";


export default ({  themeColors, isDarkMode, MyDarkTheme }) => {
  const styles = StyleSheet.create({
    secondContainer: {
      borderTopEndRadius: moderateScale(24),
      borderTopStartRadius: moderateScale(24),
      width: width,
      position: 'absolute',
      bottom: 0,
    },
    taxiBookContainer: {
      marginHorizontal: moderateScale(16),
      // position: 'absolute',
      flex:1,
      bottom: 0,
      width: width,
      alignSelf: 'center',
    },
    texiBookView: {
      flexDirection: 'row',
      // justifyContent: 'center',
      paddingHorizontal: moderateScale(18),
      paddingTop: moderateScale(15),
    },
    locationHadingText: {
      fontSize: textScale(12),
      fontFamily: fontFamily.regular,
      color: colors.textGreyLight,
      textTransform: 'uppercase',
      // marginTop:moderateScaleVertical(20)
    },
    locationText: {
      paddingVertical: moderateScale(10),
      fontSize: moderateScale(14),
      fontFamily: fontFamily.regular,
    },
    sepratorView: {
      height: moderateScale(1),
      width: width / 1.4,
      borderColor: colors.lightGray,
      borderWidth: 1,
      marginBottom: moderateScale(8),
      borderRadius: 1,
    },
    showCarButtonStyle: {
      height: moderateScaleVertical(40),
      color: colors.atlanticgreen,
      borderWidth: 1,
      borderRadius: moderateScale(4),
      // marginTop:moderateScale(4),
      marginBottom: moderateScaleVertical(10),
      width: width - moderateScale(32),
      alignSelf: 'center',
      borderColor: colors.atlanticgreen,
    },
    checkboxview: {
      flexDirection: 'row',
      marginVertical: moderateScaleVertical(10),
      alignItems: 'center',
    },
    imageview: {
      borderWidth: moderateScale(0.8),
      height: moderateScaleVertical(17.5),
      width: moderateScale(16.7),
      borderRadius: moderateScale(2),
      // color: isDarkMode ? MyDarkTheme : colors.atlanticgreen,
    },
    image: {
      height: moderateScaleVertical(15.5),
      borderRadius: moderateScale(2),
      width: moderateScale(15),
      resizeMode: 'center',
      tintColor: colors.atlanticgreen,
    },
    checkboxtext: {
      marginLeft: moderateScale(10),
      fontWeight: '500',
    },
    datepickerview: {
      // paddingHorizontal: moderateScale(16),
      // paddingVertical: moderateScale(6),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center',
      width: width - moderateScale(32),
      borderRadius: moderateScale(8),
      height:moderateScale(100),
      marginTop:moderateScale(10),
      paddingHorizontal:moderateScale(10)
      // borderRadius:moderateScale(8)
      // padding: moderateScale(16),
    },
    addressViewStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: moderateScale(10),
      borderBottomWidth: 0.5,
      marginBottom: moderateScaleVertical(4),
    },
    modalview: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: colors.grey1,
      borderBottomWidth: 1,
      paddingHorizontal: moderateScale(20),
      paddingVertical: moderateScaleVertical(12),
    },
    crossimg: {height: moderateScaleVertical(18), width: moderateScale(18)},
    headertext: {
      fontSize: textScale(16),
      fontFamily: fontFamily.bold,
      marginLeft: moderateScale(20),
    },
    text1: {
      fontSize: textScale(14),
      fontFamily: fontFamily.medium,
      marginVertical: moderateScaleVertical(15),
    },
    greyview: {
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScaleVertical(15),
      width: width - 36,
      borderRadius: moderateScale(6),
      height: moderateScaleVertical(160),
      alignSelf: 'center',
    },
    view1: {flexDirection: 'row', justifyContent: 'space-between'},
    view2: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(20),
    },
    view3: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: moderateScaleVertical(20),
    },
    innertext: {fontSize: textScale(12), fontFamily: fontFamily.semiBold},
    infoimage: {
      resizeMode: 'contain',
      height: moderateScaleVertical(15),
      width: moderateScale(15),
      marginLeft: moderateScale(10),
    },
    notetext: {
      width: width - 30,
      marginVertical: moderateScaleVertical(18),
      fontSize: textScale(12),
    },
    texthead: {fontFamily: fontFamily.semiBold, fontSize: textScale(12)},
    desctext: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(10),
      marginTop: moderateScaleVertical(8),
      marginBottom: moderateScaleVertical(20),
    },
    lowerview: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      height: moderateScaleVertical(58),
      width: width,
    },
    dateTitleText:{
      fontSize: moderateScale(14),
      fontFamily: fontFamily.bold,
      color: isDarkMode ? colors.white : colors.black,
      textTransform: 'uppercase',
    },
    dateText: {
      marginRight: moderateScale(6),
      fontSize: textScale(12),
      color: isDarkMode ? colors.white : colors.black,
      // marginTop: moderateScaleVertical(8),
      fontFamily: fontFamily.regular,

    },
    dropDownIcon:{
      height: moderateScaleVertical(6),
      width: moderateScale(6),
      tintColor: isDarkMode ? MyDarkTheme.colors.white : colors.black,
      opacity: 0.8,
      alignItems: 'center',
    },
    dateView:{
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: moderateScaleVertical(8),
    }
  });
  return styles
}
