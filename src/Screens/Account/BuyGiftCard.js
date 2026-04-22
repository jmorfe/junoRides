import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

export default function BuyGiftCard({ navigation }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appData, themeColors, appStyle, currencies, languages } = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;

  const [isLoading, setIsLoading] = useState(false);
  const [giftCardStore, setGiftCardStore] = useState([]);

  const fetchGiftCardStore = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      };
      const res = await actions.getGiftCards({}, headers);
      if (res?.data) {
        setGiftCardStore(res.data?.gift_card_store || []);
      }
    } catch (error) {
      showError(error?.message);
    } finally {
      setIsLoading(false);
    }
  }, [appData, currencies, languages]);

  useFocusEffect(fetchGiftCardStore);

  const textColor = isDarkMode ? MyDarkTheme.colors.text : colors.textGrey;
  const cardBg = isDarkMode ? MyDarkTheme.colors.lightDark : colors.white;
  const sectionBg = isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey;

  const renderStoreCard = (item) => {
    const imageUri = item?.image?.image_path
      ? getImageUrl(item?.image?.proxy_url, item?.image?.image_path, '400/200')
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
            style={{ width: '100%', height: moderateScale(160) }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: moderateScale(160),
              backgroundColor: (themeColors?.primary_color || colors.themeColor) + '33',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: themeColors?.primary_color || colors.themeColor,
                fontSize: textScale(18),
                fontFamily: fontFamily?.medium,
              }}>
              {item?.name || strings.GIFT_CARD}
            </Text>
          </View>
        )}
        <View
          style={{
            padding: moderateScale(12),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{ flex: 1, marginRight: moderateScale(10) }}>
            <Text
              style={{
                fontSize: textScale(14),
                fontFamily: fontFamily?.medium,
                color: textColor,
                marginBottom: moderateScaleVertical(2),
              }}>
              {item?.name}
            </Text>
            {!!item?.description && (
              <Text
                style={{
                  fontSize: textScale(11),
                  fontFamily: fontFamily?.regular,
                  color: colors.textGreyLight,
                }}
                numberOfLines={2}>
                {item?.description}
              </Text>
            )}
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate(navigationStrings.BUY_GIFT_CARD_PAYMENT, { giftCard: item })}
            style={{
              backgroundColor: themeColors?.primary_color || colors.themeColor,
              borderRadius: moderateScale(8),
              paddingHorizontal: moderateScale(14),
              paddingVertical: moderateScaleVertical(8),
              alignItems: 'center',
              minWidth: moderateScale(70),
            }}>
            <Text
              style={{
                color: colors.white,
                fontSize: textScale(13),
                fontFamily: fontFamily?.medium,
              }}>
              {currencies?.primary_currency?.symbol}
              {item?.amount ?? item?.price}
            </Text>
            <Text
              style={{
                color: colors.white,
                fontSize: textScale(10),
                fontFamily: fontFamily?.regular,
                marginTop: moderateScaleVertical(1),
              }}>
              {strings.BUY}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <WrapperContainer
      bgColor={sectionBg}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header centerTitle={strings.BUY_GIFT_CARD} />
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
          {strings.BUY_GIFT_CARD}
        </Text>

        {giftCardStore.length === 0 && !isLoading ? (
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
              {strings.NO_GIFT_CARDS_AVAILABLE}
            </Text>
          </View>
        ) : (
          giftCardStore.map((item, index) => (
            <View key={String(item?.id ?? index)}>
              {renderStoreCard(item)}
            </View>
          ))
        )}
      </ScrollView>
    </WrapperContainer>
  );
}
