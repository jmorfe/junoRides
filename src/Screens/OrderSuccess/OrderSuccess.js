import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, Image, Text, View } from 'react-native';
import { getBuildId } from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import OoryksHeader from '../../Components/OoryksHeader';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import { getImageUrl, showError } from '../../utils/helperFunctions';
import socketServices from '../../utils/scoketService';
import { getColorSchema } from '../../utils/utils';
import stylesFunc from './styles';

export default function OrderSuccess({navigation, route}) {
  const paramData = route?.params?.data;

  const {
    appStyle,
    themeColors,
    themeColor,
    themeToggle,
    appData,
    currencies,
    languages,
  } = useSelector(state => state?.initBoot);
  const {dineInType} = useSelector(state => state?.home || {});

  const {userData} = useSelector(state => state?.auth);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});
  const [isLoadingChat, setLoadingChat] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true,
      );
      return () => backHandler.remove();
    }, []),
  );

  useEffect(() => {
    if (dineInType === 'p2p') {
      createRoom('onFocus');
    }
  }, []);

  const createRoom = async (type = '') => {
    if (!userData?.auth_token) {
      actions.setAppSessionData('on_login');
      return;
    }

    if (dineInType !== 'p2p') {
      navigation.navigate(navigationStrings.ORDER_DETAIL, {
        orderId: paramData?.orderDetail?.id,
        selected_vendor_id: paramData?.orderDetail?.vendors[0]?.vendor?.id,
        fromActive: true, // this value use for useInterval
        from: 'cart',
      });

      return;
    }

    setLoadingChat(true);
    try {
      const apiData = {
        sub_domain: '192.168.101.88', //this is static value
        client_id: String(appData?.profile.id),
        db_name: appData?.profile?.database_name,
        user_id: String(userData?.id),
        type: 'user_to_user',
        product_id: String(paramData?.product_id),
        vendor_id: String(paramData?.orderDetail?.vendors[0]?.vendor_id),
        order_number: paramData?.orderDetail?.order_number,
      };

      console.log('sending api data', apiData);
      const res = await actions.onStartChat(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      });

      if (!!res?.roomData) {
        onChat(res.roomData, type);
      }
      setLoadingChat(false);
    } catch (error) {
      setLoadingChat(false);
      console.log('error raised in start chat api', error);
      showError(error?.message);
    }
  };

  const onChat = (item, type) => {
    let dataToSend = {
      ...item,
      vendor_id_order: paramData?.orderDetail?.vendors[0]?.id,
      isFromOrder: true,
      order: paramData?.orderDetail,
    };
    onSend(dataToSend, type);
  };

  const checkToMessage = data => {
    let userType = data?.type;
    if (!!userData?.is_superadmin && userType == 'agent_to_user') {
      return 'to_user_agent';
    }
    if (!!userData?.is_superadmin && userType == 'vendor_to_user') {
      return 'to_user_vendor';
    }
    if (userType == 'agent_to_user') {
      return 'to_agent';
    }
    if (userType == 'vendor_to_user') {
      return 'to_vendor';
    }
  };

  const onSend = useCallback(async (data = {}, type) => {
    let phoneNumber = !!userData.phone_number
      ? `+${userData?.dial_code} ${userData.phone_number}`
      : null;
    let userImage = !!userData?.source
      ? getImageUrl(
          userData?.source?.proxy_url,
          userData?.source?.image_path,
          '200/200',
        )
      : null;

    try {
      let apiData = {
        room_id: data?._id,
        message: 'Hello',
        user_type: !!userData?.is_superadmin ? 'admin' : 'user',
        to_message: checkToMessage(data),
        from_message: !!userData?.is_superadmin ? 'from_admin' : 'from_user',
        user_id: userData?.id,
        email: userData?.email,
        username: userData?.name,
        phone_num: phoneNumber,
        display_image: userImage,
        sub_domain: '192.168.101.88', //this is static value
        //'room_name' =>$data->name,
        chat_type: data?.type,
      };

      if (type == 'onFocus') {
        console.log(apiData, '<====data sending sendMessage');
        const res = await actions.sendMessage(apiData, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        });
        console.log('on send message res', res);
        socketServices.emit('save-message', res);
      }
      type !== 'onFocus' &&
        navigation.navigate(navigationStrings.CHAT_SCREEN, {
          data: {
            ...data,
          },
        });
    } catch (error) {
      console.log('error raised in fetchAllMessages api', error);
    }
  }, []);

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}>
      <OoryksHeader
        isCustomLeftPress
        onPressLeft={() =>
          navigation.reset({
            index: 0,
            routes: [{name: navigationStrings.TAB_ROUTES}],
          })
        }
        leftTitle=""
      />
      <KeyboardAwareScrollView
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: moderateScaleVertical(20)}}>
        {/* <TouchableOpacity
          onPress={() => {
            navigation?.popToTop();
          }}>
          <Image
            style={isDarkMode && { tintColor: MyDarkTheme.colors.text }}
            source={imagePath.cross}
          />
        </TouchableOpacity> */}
        <View style={styles.doneIconView}>
          <Image
            source={imagePath.successfulIcon}
            style={{
              marginBottom: moderateScaleVertical(30),
              tintColor: 'green',
              opacity: 0.5,
            }}
          />
          <Text
            style={
              isDarkMode
                ? [styles.requestSubmitText, {color: MyDarkTheme.colors.text}]
                : styles.requestSubmitText
            }>
            {strings.YOUR_ORDER_HAS_BEEN_SUBMITTED} {''}
            {/* <Text style={
              isDarkMode
                ? [styles.thanksForyourPurchase, { color: MyDarkTheme.colors.text }]
                : styles.thanksForyourPurchase
            } >{ strings.THANKS_FOR_YOUR_PURCHASE}</Text> */}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.successfully, {color: MyDarkTheme.colors.text}]
                : styles.successfully
            }>
            {appIds.qdelo === getBuildId()
              ? strings.THANKS_FOR_ORDERING_WITH_US
              : strings.THANKS_FOR_YOUR_PURCHASE}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginVertical: moderateScaleVertical(50),
          }}>
          <Text
            style={
              isDarkMode
                ? [styles.yourAWBText, {color: MyDarkTheme.colors.text}]
                : styles.yourAWBText
            }>
            {`${strings.YOUR_ORDER_NUMBER} ${
              paramData && paramData?.orderDetail
                ? paramData?.orderDetail?.order_number
                : ''
            }`}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginBottom: moderateScaleVertical(90),
          }}>
          <ButtonWithLoader
            isLoading={isLoadingChat}
            btnText={dineInType == 'p2p' ? 'Start Chat' : 'View Detail'}
            onPress={createRoom}
            textStyle={{color: themeColors.secondary_color}}
            borderRadius={moderateScale(13)}
            btnStyle={{
              backgroundColor: themeColors.primary_color,
              width: width / 1.2,
              borderWidth: 0,
            }}
          />
        </View>
      </KeyboardAwareScrollView>

      {/* */}
    </WrapperContainer>
  );
}
