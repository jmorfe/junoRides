import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import strings from '../constants/lang';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical, textScale } from '../styles/responsiveSize';
import ButtonWithLoader from './ButtonWithLoader';


export default function ProductRatingModal({
  isVisible = false,
  onSubmit = () => { },
  onChangeText = () => { },
  isLoading = false,
  onCloseModal = () => { }

}) {

  const { appData, currencies, languages, appStyle, themeColors, themeColor, themeToggle } = useSelector(
    state => state?.initBoot,
  );
  const { additional_preferences, digit_after_decimal } = appData?.profile?.preferences || {};

  const fontFamily = appStyle?.fontSizeData;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCloseModal}
      avoidKeyboard={true}
      style={{
        margin: 0,
        justifyContent: "flex-end"
      }}>
      <View style={styles.container}>
        <Text style={{
          fontFamily: fontFamily?.bold,
          fontSize: textScale(14)
        }}>{strings.PLEASE_GIVE_RATING}</Text>
        <TextInput
          onChangeText={onChangeText}
          placeholder={strings.ENTER_REVIEW}
          style={styles.txtInput} />
        <ButtonWithLoader
          isLoading={isLoading}
          onPress={onSubmit}
          btnText={strings.SUBMIT}
          btnStyle={{
            backgroundColor: themeColors?.primary_color,
            borderWidth: 0,
            borderRadius: moderateScale(8)
          }}

        />
      </View>

    </Modal>
  )
}

const styles = StyleSheet.create({
  txtInput: {
    height: moderateScaleVertical(100),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginTop: moderateScaleVertical(12),
    marginBottom: moderateScaleVertical(24),
    padding: moderateScale(8)
  },
  container: {
    backgroundColor: colors.white,
    minHeight: moderateScale(100),
    borderTopLeftRadius: moderateScale(8),
    borderTopRightRadius: moderateScale(8),
    padding: moderateScale(8)
  }
})