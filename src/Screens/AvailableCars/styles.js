import { StyleSheet } from "react-native";
import { moderateScale, moderateScaleVertical, textScale } from "../../styles/responsiveSize";
import fontFamily from "../../styles/fontFamily";

const styles = StyleSheet.create({
    flallistheaderview: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: moderateScale(22),
      alignItems: 'center',
      marginTop: moderateScaleVertical(16),
      // backgroundColor:'pink'
    },
    headertext: {
      fontFamily: fontFamily.bold,
      marginTop: moderateScaleVertical(10),
      fontSize: textScale(16),
    },
    headerimage: {
      alignItems: 'center',
      height: moderateScaleVertical(18),
      // width: moderateScaleVertical(18),
      marginTop: moderateScaleVertical(10),
    },
  });
  export default styles