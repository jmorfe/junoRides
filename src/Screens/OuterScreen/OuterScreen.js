import React, { useEffect, useState } from 'react';
import {
  Alert,
  I18nManager,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RNRestart from 'react-native-restart';
import { useSelector } from 'react-redux';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import GradientButton from '../../Components/GradientButton';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings, { changeLaguage } from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import { hitSlopProp } from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import { showError } from '../../utils/helperFunctions';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { isEmpty } from 'lodash';
import DeviceInfo from 'react-native-device-info';
import { enableFreeze } from "react-native-screens";
import TransparentButtonWithTxtAndIcon from '../../Components/ButtonComponent';
import Header from '../../Components/Header';
import LanguageModal from '../../Components/LanguageModal';
import { MyDarkTheme } from '../../styles/theme';
import { getValuebyKeyInArray } from '../../utils/commonFunction';
import {
  fbLogin,
  googleLogin,
  handleAppleLogin
} from '../../utils/socialLogin';
import { getColorSchema, setItem, setUserData } from '../../utils/utils';
import stylesFunc from './styles';
enableFreeze(true);


export default function OuterScreen({ navigation }) {
  const {
    appData,
    currencies,
    themeColors,
    languages,
    shortCodeStatus,
    appStyle,
    themeToggle,
    themeColor,
    redirectedFrom,
  } = useSelector((state) => state?.initBoot || {});

  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const [state, setState] = useState({
    getLanguage: '',
    isLoading: false,
    isSelectLanguageModal: false,
    isLangSelected: false,
    allLangs: [],
  });

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily, themeColors });

  const {
    getLanguage,
    isLoading,
    isSelectLanguageModal,
    isLangSelected,
    allLangs,
  } = state;
  const {
    apple_login,
    fb_login,
    google_login,
    additional_preferences,
  } = appData?.profile?.preferences || {};

  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };
  //Saving login user to backend



  const _saveSocailLogin = async (socialLoginData, type) => {
    let userStaticName = DeviceInfo.getBundleId();
    userStaticName = userStaticName.split('.');

    let fcmToken = await AsyncStorage.getItem('fcmToken');
    let data = {};
    data['name'] =
      socialLoginData?.name ||
      socialLoginData?.userName ||
      socialLoginData?.fullName?.givenName ||
      `${userStaticName[userStaticName.length - 1]} user`;
    data['auth_id'] =
      socialLoginData?.id ||
      socialLoginData?.userID ||
      socialLoginData?.identityToken;
    data['phone_number'] = '';
    data['email'] = socialLoginData?.email;
    data['device_type'] = Platform.OS;
    data['device_token'] = DeviceInfo.getUniqueId();
    data['fcm_token'] = !!fcmToken ? fcmToken : DeviceInfo.getUniqueId();

    let query = '';
    if (
      type == 'facebook' ||
      type == 'google' ||
      type == 'apple'
    ) {
      query = type;
    }
    actions
      .socailLogin(`/${query}`, data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        updateState({ isLoading: false });
        if (!!res.data) {
          successLogin(res?.data);
          getCartDetail();
        }
      })
      .catch(errorMethod);
  };

  const checkEmailPhoneVerified = (data) => {
    if (
      !!(
        !!data?.client_preference?.verify_email &&
        !data?.verify_details?.is_email_verified
      ) ||
      !!(
        !!data?.client_preference?.verify_phone &&
        !data?.verify_details?.is_phone_verified
      )
    ) {
      moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, data)();
    } else {
      successLogin(data);
    }
  };

  const successLogin = (data) => {
    console.log('callllled');
    if (!!data) {
      setUserData(data).then((suc) => {
        actions.saveUserData(data);
      });
    }
  };

  //error handling
  const errorMethod = (error) => {
    updateState({ isLoading: false });
    showError(error?.error || error?.message);
  };

  const getCartDetail = () => {
    actions
      .getCartDetail(
        '',
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        actions.cartItemQty(res);
      })
      .catch((error) => { });
  };

  //Apple Login Support
  const openAppleLogin = () => {
    updateState({ isLoading: false });
    handleAppleLogin()
      .then((res) => {
        _saveSocailLogin(res, 'apple');
        // updateState({isLoading: false});

        console.log(res, 'appleappleappleappleappleapple');
      })
      .catch((err) => {
        console.log(err, 'error');
        updateState({ isLoading: false });
      });
  };

  //Gmail Login Support
  const openGmailLogin = () => {
    updateState({ isLoading: true });
    googleLogin()
      .then((res) => {
        if (res?.user) {
          console.log(res, 'googlegooogle');
          _saveSocailLogin(res.user, 'google');
        } else {
          updateState({ isLoading: false });
        }
      })
      .catch((err) => {
        updateState({ isLoading: false });
      });
  };

  const _responseInfoCallback = (error, result) => {
    updateState({ isLoading: true });
    if (error) {
      updateState({ isLoading: false });
    } else {
      if (result && result?.id) {
        _saveSocailLogin(result, 'facebook');
      } else {
        updateState({ isLoading: false });
      }
    }
  };
  //FacebookLogin
  const openFacebookLogin = () => {
    fbLogin(_responseInfoCallback);
  };


  const onGuestLogin = () => {
    actions.userLogout();
    getCartDetail();
    actions.setAppSessionData('guest_login');
  };

  const _selectLang = () => {
    updateState({ isSelectLanguageModal: true });
  };

  const _onBackdropPress = () => {
    updateState({ isSelectLanguageModal: false });
  };

  useEffect(() => {
    if (!isEmpty(languages)) {
      const all_languages = [...languages?.all_languages];

      all_languages?.forEach((itm, indx) => {
        if (languages?.primary_language?.id === itm?.id) {
          all_languages[indx].isActive = true;
          updateState({
            allLangs: [...all_languages],
          });
        } else {
          all_languages[indx].isActive = false;
          updateState({
            allLangs: [...all_languages],
          });
        }
      });
    }
  }, []);

  const _onLangSelect = (item, indx) => {
    const langs = [...allLangs];
    langs.forEach((item, index) => {
      if (index === indx) {
        langs[index].isActive = true;
        updateState({
          allLangs: [...langs],
        });
      } else {
        langs[index].isActive = false;
        updateState({
          allLangs: [...langs],
        });
      }
    });
  };

  const selectedLangTitle = allLangs.find((itm) => itm.isActive === true);

  //Update language
  const updateLanguage = (item) => {
    const data = languages?.all_languages?.filter((x) => x.id == item.id)[0];

    if (data.sort_code !== languages?.primary_language.sort_code) {
      let languagesData = {
        ...languages,
        primary_language: data,
      };

      // updateState({isLoading: true});
      setItem('setPrimaryLanguage', languagesData);
      setTimeout(() => {
        actions.updateLanguage(data);
        onSubmitLang(data.sort_code, languagesData);
      }, 1000);
    }
  };

  //update language all over the app
  const onSubmitLang = async (lang, languagesData) => {
    if (lang == '') {
      showAlertMessageError(strings.SELECT);
      return;
    } else {
      if (lang === 'ar' || lang === 'he') {
        I18nManager.forceRTL(true);
        setItem('language', lang);
        changeLaguage(lang);
        RNRestart.Restart();
      } else {
        I18nManager.forceRTL(false);
        setItem('language', lang);
        changeLaguage(lang);
        RNRestart.Restart();
      }
    }
  };

  const _updateLang = (selectedLangTitle) => {
    updateState({ isSelectLanguageModal: false });
    updateLanguage(selectedLangTitle);
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      isLoading={isLoading}
    >
      {console.log(shortCodeStatus, 'shortCodeStatus>>')}
      {shortCodeStatus ? (
        <Header
          leftIcon={
            appStyle?.homePageLayout === 2
              ? imagePath.backArrow
              : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                ? imagePath.icBackb
                : imagePath.back
          }
          onPressLeft={() => actions.setAppSessionData('guest_login')}
          isRightText
          rightTxt={
            !!selectedLangTitle
              ? selectedLangTitle.sort_code
              : languages?.primary_language?.sort_code
          }
          rightTxtContainerStyle={{
            backgroundColor: isDarkMode? themeColors.primary_color:colors.grey1,
            height: moderateScale(30),
            width: moderateScale(30),
            borderRadius: moderateScale(30),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPressRightTxt={_selectLang}
          rightTxtStyle={{ color: colors.white, textTransform: 'uppercase' }}
          headerStyle={
            isDarkMode
              ? { backgroundColor: MyDarkTheme.colors.background }
              : { backgroundColor: colors.white }
          }
        />
      ) : (
        <Header
          noLeftIcon
          isRightText
          rightTxt={
            !!selectedLangTitle
              ? selectedLangTitle.sort_code
              : languages?.primary_language?.sort_code
          }
          rightTxtContainerStyle={{
            backgroundColor: themeColors.primary_color,
            height: moderateScale(30),
            width: moderateScale(30),
            borderRadius: moderateScale(30),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPressRightTxt={_selectLang}
          rightTxtStyle={{ color: colors.white, textTransform: 'uppercase' }}
          headerStyle={
            isDarkMode
              ? { backgroundColor: MyDarkTheme.colors.background }
              : { backgroundColor: colors.white }
          }
        />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: moderateScaleVertical(70),
          flexGrow: 1,
        }}>
        {getValuebyKeyInArray('is_phone_signup', additional_preferences) ? (
          <Text
            style={
              isDarkMode
                ? [
                  styles.header,
                  {
                    color: MyDarkTheme.colors.text,
                    backgroundColor: MyDarkTheme.colors.background,
                  },
                ]
                : styles.header
            }>
            Login Your Account
          </Text>
        ) : (
          <Text
            style={
              isDarkMode
                ? [
                  styles.header,
                  {
                    color: MyDarkTheme.colors.text,
                    backgroundColor: MyDarkTheme.colors.background,
                  },
                ]
                : styles.header
            }>
            {strings.CREATE_YOUR_ACCOUNT}
          </Text>
        )}
        <View style={{ marginHorizontal: moderateScale(24) }}>
          {appData?.profile?.preferences?.home_tag_line ? (
            <View style={{ marginHorizontal: moderateScaleVertical(30) }}>
              <Text
                numberOfLines={2}
                style={
                  isDarkMode
                    ? [styles.txtSmall, { color: MyDarkTheme.colors.text }]
                    : styles.txtSmall
                }>
                {appData?.profile?.preferences?.home_tag_line
                  ? appData?.profile?.preferences?.home_tag_line
                  : ''}
              </Text>
            </View>
          ) : null}

          <GradientButton
            containerStyle={{ marginTop: moderateScaleVertical(50) }}
            btnText={
              getValuebyKeyInArray('is_phone_signup', additional_preferences)
                ? 'Login to Your Account'
                : strings.SIGNUP_AN_ACCOUNT
            }
            onPress={moveToNewScreen(
              getValuebyKeyInArray('is_phone_signup', additional_preferences)
                ? navigationStrings.LOGIN
                : navigationStrings.SIGN_UP,
            )}
          />
          <ButtonWithLoader
            btnStyle={styles.guestBtn}
            btnTextStyle={{
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : themeColors.primary_color,
            }}
            onPress={() => onGuestLogin()}
            btnText={strings.GUEST_LOGIN}
          />
          <View style={{ marginTop: moderateScaleVertical(50) }}>
            {!!google_login ||
              !!fb_login ||
              !!apple_login ? (
              <View style={styles.socialRow}>
                <View style={styles.hyphen} />
                <Text
                  style={
                    isDarkMode
                      ? [styles.orText, { color: MyDarkTheme.colors.text }]
                      : styles.orText
                  }>
                  {strings.OR_SIGNUP_WITH}
                </Text>
                <View style={styles.hyphen} />
              </View>
            ) : null}

            <View
              style={{
                flexDirection: 'column',
              }}>
              {!!google_login && (
                <View style={{ marginTop: moderateScaleVertical(15) }}>
                  <TransparentButtonWithTxtAndIcon
                    icon={imagePath.ic_google2}
                    btnText={strings.CONTINUE_GOOGLE}
                    containerStyle={{
                      backgroundColor: isDarkMode
                        ? MyDarkTheme.colors.lightDark
                        : colors.white,
                      borderColor: colors.borderColorD,
                      borderWidth: 1,
                    }}
                    textStyle={{
                      color: isDarkMode ? colors.white : colors.textGreyB,
                      marginHorizontal: moderateScale(15),
                    }}
                    onPress={() => openGmailLogin()}
                  />
                </View>
              )}
              {!!fb_login && (
                <View style={{ marginTop: moderateScaleVertical(15) }}>
                  <TransparentButtonWithTxtAndIcon
                    icon={imagePath.ic_fb2}
                    btnText={strings.CONTINUE_FACEBOOK}
                    containerStyle={{
                      backgroundColor: isDarkMode
                        ? MyDarkTheme.colors.lightDark
                        : colors.white,
                      borderColor: colors.borderColorD,
                      borderWidth: 1,
                    }}
                    textStyle={{
                      color: isDarkMode ? colors.white : colors.textGreyB,
                      marginHorizontal: moderateScale(5),
                    }}
                    onPress={() => openFacebookLogin()}
                  />
                </View>
              )}

              {!!apple_login && Platform.OS == 'ios' && (
                <View style={{ marginTop: moderateScaleVertical(15) }}>
                  <TransparentButtonWithTxtAndIcon
                    icon={isDarkMode ? imagePath.ic_apple : imagePath.ic_apple2}
                    btnText={strings.CONTINUE_APPLE}
                    containerStyle={{
                      backgroundColor: isDarkMode
                        ? MyDarkTheme.colors.lightDark
                        : colors.white,
                      borderColor: colors.borderColorD,
                      borderWidth: 1,
                    }}
                    textStyle={{
                      color: isDarkMode ? colors.white : colors.textGreyB,
                      marginHorizontal: moderateScale(17),
                      fontSize: textScale(14),
                    }}
                    onPress={() => openAppleLogin()}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
        {getValuebyKeyInArray(
          'is_phone_signup',
          additional_preferences,
        ) ? null : (
          <View style={styles.bottomContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  ...styles.txtSmall,
                  color: colors.textGreyLight,
                  marginTop: 0,
                }}>
                {strings.ALREADY_HAVE_AN_ACCOUNT}
              </Text>
              <TouchableOpacity
                hitSlop={hitSlopProp}
                onPress={moveToNewScreen(navigationStrings.LOGIN)}>
                <Text
                  style={{
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : themeColors?.primary_color,
                    fontFamily: fontFamily.bold,
                    fontSize: textScale(14),
                    lineHeight: 24,
                  }}>
                  {strings.LOGIN}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      {isSelectLanguageModal && (
        <LanguageModal
          isSelectLanguageModal={isSelectLanguageModal}
          onBackdropPress={_onBackdropPress}
          _onLangSelect={_onLangSelect}
          isLangSelected={isLangSelected}
          allLangs={allLangs}
          _updateLang={(id)=>{
            Alert.alert(
              'Confirmation',
              'Are you sure you want to update the language?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                  onPress: () => {
                    navigation.goBack();
                  },
                },
                {
                  text: 'Yes',
                  onPress:()=> _updateLang(id),
                },
              ],
            );

          }}
        />
      )}
    </WrapperContainer>
  );
}
