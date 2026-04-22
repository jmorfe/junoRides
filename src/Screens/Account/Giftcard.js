import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { getImageUrl, showError } from '../../utils/helperFunctions';
import { getColorSchema } from '../../utils/utils';

export default function Giftcard({ navigation }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appData, themeColors, appStyle, currencies, languages } = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;

  const [isLoading, setIsLoading] = useState(false);
  const [userGiftCards, setUserGiftCards] = useState([]);

  const fetchGiftCards = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      };
      const res = await actions.getGiftCards({}, headers);
      if (res?.data) {
        setUserGiftCards(res.data?.user_gift_cards || []);
      }
    } catch (error) {
      showError(error?.message);
    } finally {
      setIsLoading(false);
    }
  }, [appData, currencies, languages]);

  useFocusEffect(fetchGiftCards);

  const textColor = isDarkMode ? MyDarkTheme.colors.text : colors.textGrey;
  const cardBg = isDarkMode ? MyDarkTheme.colors.lightDark : colors.white;
  const sectionBg = isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey;

  const renderUserCard = (item) => {
    const imageUri = item?.gift_card?.image?.image_path
      ? getImageUrl(
          item?.gift_card?.image?.proxy_url,
          item?.gift_card?.image?.image_path,
          '400/200',
        )
      : null;

    return (
      <View
        style={{
          backgroundColor: cardBg,
          borderRadius: moderateScale(12),
          marginBottom: moderateScaleVertical(12),
          marginHorizontal: moderateScale(16),
          overflow: 'hidden',
          elevation: 2,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
        }}>
        {imageUri ? (
          <FastImage
            source={{ uri: imageUri }}
            style={{ width: '100%', height: moderateScale(120) }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: moderateScale(120),
              backgroundColor: themeColors?.primary_color || colors.themeColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: colors.white,
                fontSize: textScale(20),
                fontFamily: fontFamily?.bold || fontFamily?.medium,
              }}>
              {item?.gift_card?.name || strings.GIFT_CARD}
            </Text>
          </View>
        )}
        <View style={{ padding: moderateScale(12) }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: moderateScaleVertical(6),
            }}>
            <Text
              style={{
                fontSize: textScale(13),
                fontFamily: fontFamily?.medium,
                color: textColor,
              }}>
              {item?.gift_card?.name || strings.GIFT_CARD}
            </Text>
            <View
              style={{
                backgroundColor: (themeColors?.primary_color || colors.themeColor) + '20',
                borderRadius: moderateScale(6),
                paddingHorizontal: moderateScale(8),
                paddingVertical: moderateScaleVertical(3),
              }}>
              <Text
                style={{
                  fontSize: textScale(12),
                  fontFamily: fontFamily?.medium,
                  color: themeColors?.primary_color || colors.themeColor,
                }}>
                {currencies?.primary_currency?.symbol}{item?.balance ?? item?.amount}
              </Text>
            </View>
          </View>
          {!!item?.gift_card_code && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                Clipboard.setString(item.gift_card_code);
                Toast.show(strings.COPIED);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: sectionBg,
                borderRadius: moderateScale(6),
                paddingHorizontal: moderateScale(10),
                paddingVertical: moderateScaleVertical(8),
                marginBottom: moderateScaleVertical(6),
              }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: textScale(13),
                  fontFamily: fontFamily?.regular,
                  color: textColor,
                  letterSpacing: 2,
                }}>
                {item.gift_card_code}
              </Text>
              <Image
                source={require('../../assets/images/p2p/ic_tap_to_copy.png')}
                style={{
                  height: moderateScale(16),
                  width: moderateScale(16),
                  tintColor: themeColors?.primary_color || colors.themeColor,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          {!!item?.expiry_date && (
            <Text
              style={{
                fontSize: textScale(11),
                fontFamily: fontFamily?.regular,
                color: colors.textGreyLight,
              }}>
              {strings.EXPIRY}: {item?.expiry_date}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <WrapperContainer
      bgColor={sectionBg}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        centerTitle={strings.GIFT_CARD}
        isRightText
        rightTxt={strings.BUY_GIFT_CARD}
        rightTxtStyle={{
          color: themeColors?.primary_color || colors.themeColor,
          fontSize: textScale(13),
          fontFamily: fontFamily?.medium,
        }}
        onPressRightTxt={() => navigation.navigate(navigationStrings.BUY_GIFT_CARD)}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: moderateScaleVertical(30) }}>

        <Text
          style={{
            fontSize: textScale(15),
            fontFamily: fontFamily?.semiBold || fontFamily?.medium,
            color: textColor,
            marginHorizontal: moderateScale(16),
            marginTop: moderateScaleVertical(20),
            marginBottom: moderateScaleVertical(10),
          }}>
          {strings.MY_GIFT_CARDS}
        </Text>

        {userGiftCards.length === 0 && !isLoading ? (
          <View
            style={{
              alignItems: 'center',
              paddingVertical: moderateScaleVertical(24),
              marginHorizontal: moderateScale(16),
              backgroundColor: cardBg,
              borderRadius: moderateScale(12),
            }}>
            <Text
              style={{
                fontSize: textScale(13),
                fontFamily: fontFamily?.regular,
                color: colors.textGreyLight,
              }}>
              {strings.NO_GIFT_CARDS}
            </Text>
          </View>
        ) : (
          userGiftCards.map((item, index) => (
            <View key={String(item?.id ?? index)}>
              {renderUserCard(item)}
            </View>
          ))
        )}
      </ScrollView>
    </WrapperContainer>
  );
}
