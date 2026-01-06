import { StyleSheet } from "react-native";
import colors from "../../styles/colors";
import fontFamily from "../../styles/fontFamily";
import { moderateScale, moderateScaleVertical, textScale, width } from "../../styles/responsiveSize";

const styles = StyleSheet.create({
    mainView: {
      marginHorizontal: moderateScale(16),
    marginTop: moderateScaleVertical(20),
      flex:1
    },
    imgStyle: {
      width: moderateScale(128),
      height: moderateScaleVertical(78),
      borderRadius: moderateScale(6),
    },
    dotStyle: {
      height: 6,
      width: 6,
      backgroundColor: colors.black,
      borderRadius: 8,
      margin: 6,
    },
    texiBookView: {
      flexDirection: 'row',
      paddingHorizontal: moderateScale(8),
      paddingTop: moderateScale(38),
    },
    locationHadingText: {
      fontSize: textScale(12),
      fontFamily: fontFamily.regular,
      color: colors.textGreyLight,
      textTransform: 'uppercase',
    },
    sepratorView: {
      height: moderateScale(1),
      width: width / 1.6,
      borderColor: colors.lightGray,
      borderWidth: 1,
      marginTop: moderateScale(13),
      borderRadius: 1,
    },
    locationText: {
      paddingTop: moderateScale(10),
      fontSize: moderateScale(14),
      fontFamily: fontFamily.regular,
    },
    txtStyle: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
    },
  
    bookView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: moderateScaleVertical(10),
    },
    lineStyle: {
      borderWidth: 0.5,
      borderColor: '#B3B3B3',
      marginTop: moderateScaleVertical(16),
    },
    dottedView: {
      position: 'absolute',
      zIndex: -10,
      height: '100%',
      alignItems: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 9,
    },
    secView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    locationView: {
      flex: 0.7,
      borderBottomWidth: 1,
      borderColor: colors.textColor,
    },
    textbooking:{marginVertical:moderateScaleVertical(16),fontSize:textScale(16),fontFamily:fontFamily.semiBold,},
    flatview:{marginBottom:moderateScaleVertical(18),flexDirection:'row',padding:moderateScale(12),borderRadius:moderateScale(4)},
    bottomspaceview:{marginLeft:moderateScale(20)},
    pricetxt:{fontSize:textScale(14),fontFamily:fontFamily.bold},
    savemoneytxt:{fontSize:textScale(12),marginVertical:moderateScaleVertical(10)},
    descview:{flexDirection:'row',alignItems:'center',marginBottom:moderateScaleVertical(8)}
    
  
});
  
export default styles