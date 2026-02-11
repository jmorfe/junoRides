
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useRef, useState } from 'react';
// import { Linking, Platform } from 'react-native';
import { getBundleId } from 'react-native-device-info';
import FlashMessage from 'react-native-flash-message';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import NoInternetModal from './src/Components/NoInternetModal';
import NotificationModal from './src/Components/NotificationModal';
import strings from './src/constants/lang';
import Routes from './src/navigation/Routes';
import actions from './src/redux/actions';
import { updateInternetConnection } from './src/redux/actions/auth';
import store from './src/redux/store';
import types from './src/redux/types';
import PrinterScreen from './src/Screens/PrinterConnection/PrinterScreen';

import { appIds } from './src/utils/constants/DynamicAppKeys';
import ForegroundHandler from './src/utils/ForegroundHandler';

import {
  notificationListener,
  requestUserPermission,
} from './src/utils/notificationService';
import { getItem, getLastBidInfo, getUserData } from './src/utils/utils';


import { Platform, Text, View } from 'react-native';

import Modal from 'react-native-modal';
import { clearLastBidData } from './src/redux/actions/home';
import colors from './src/styles/colors';
import { moderateScale, moderateScaleVertical, textScale, width } from './src/styles/responsiveSize';


if (__DEV__ && Platform.OS == 'ios') {
  require("./ReactotronConfig");
}



const App = () => {
  const [internetConnection, setInternet] = useState(true);
  const [progress, setProgress] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('red');

  const ConnectBTFunction = async () => {
    await AsyncStorage.removeItem('autoConnectEnabled');

    const temp = new PrinterScreen();

    AsyncStorage.getItem('BleDevice2').then((res) => {
      const tt = JSON.parse(res);
      temp.connectBTFunc({
        address: tt.boundAddress,
        name: tt.name,
      });
    });
    AsyncStorage.removeItem('BleDevice2');
  };


  if (!__DEV__) {
    console.log = () => null
  }



  //open screens based on deep link url
  const openSpecificScreenByDeeplink = async (deepLinkUrl) => {
    const userData = await getUserData();
    if (userData?.auth_token && deepLinkUrl) {

      actions.setRedirection('from_deepLinking');
      actions.setAppSessionData('shortcode');

    } else {
      setTimeout(() => {
        actions.setAppSessionData('on_login');
      }, 1000);
    }
  };


  useEffect(() => {
    //stop splashs screen from loading
    if (
      getBundleId() == appIds.masa // we hide splash immediate in case of video component
    ) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 200);
    } else {
      setTimeout(() => {
        SplashScreen.hide();
      }, 3000);
    }
    if (Platform.OS == 'android') {
      AsyncStorage.getItem('autoConnectEnabled').then((res) => {
        if (res !== null) {
          ConnectBTFunction();
        }
      });
    }
  }, []);

  useEffect(() => {
    const notificationConfig = async () => {
      await notificationListener();
      setTimeout(() => {
        requestUserPermission()
      }, 1000);
    };
    notificationConfig()
  }, [])

  useEffect(() => {
    (async () => {
      const userData = await getUserData();
      const { dispatch } = store;
      if (userData && !!userData?.auth_token) {
        let lastBidData = await getLastBidInfo()
        if (!!lastBidData && !!lastBidData?.expiryTime) {
          let expiryDate = new Date(lastBidData?.expiryTime)
          let currentDate = new Date()
          if (currentDate >= expiryDate) {
            clearLastBidData()
          }
          else {
            dispatch({
              type: types.LAST_BID_INFO,
              payload: lastBidData,
            });
          }

        }

        dispatch({
          type: types.LOGIN,
          payload: userData,
        });

      }
      const getAppData = await getItem('appData');
      if (!!getAppData) {
        dispatch({
          type: types.APP_INIT,
          payload: getAppData,
        });
      }

      const locationData = await getItem('location');
      if (!!locationData) {
        dispatch({
          type: types.LOCATION_DATA,
          payload: locationData,
        });
      }

      const profileAddress = await getItem('profileAddress');

      if (!!profileAddress) {
        dispatch({
          type: types.PROFILE_ADDRESS,
          payload: profileAddress,
        });
      }

      const cartItemCount = await getItem('cartItemCount');

      if (!!cartItemCount) {
        dispatch({
          type: types.CART_ITEM_COUNT,
          payload: cartItemCount,
        });
      }

      const allUserAddress = await getItem('saveUserAddress');

      if (!!allUserAddress) {
        dispatch({
          type: types.SAVE_ALL_ADDRESS,
          payload: allUserAddress,
        });
      }

      const walletData = await getItem('walletData');
      if (!!walletData) {
        dispatch({
          type: types.WALLET_DATA,
          payload: walletData,
        });
      }

      const selectedAddress = await getItem('saveSelectedAddress');
      if (!!selectedAddress) {
        dispatch({
          type: types.SELECTED_ADDRESS,
          payload: selectedAddress,
        });
      }

      const dine_in_type = await getItem('dine_in_type');
      if (!!dine_in_type) {
        dispatch({
          type: types.DINE_IN_DATA,
          payload: dine_in_type,
        });
      }
      const theme = await getItem('theme');
      const themeToggle = await getItem('istoggle');
      if (JSON.parse(themeToggle)) {
        dispatch({
          type: types.THEME,
          payload: false,
        });
        dispatch({
          type: types.THEME_TOGGLE,
          payload: !!themeToggle ? JSON.parse(themeToggle) : false,
        });
      } else {
        dispatch({
          type: types.THEME_TOGGLE,
          payload: !!themeToggle ? JSON.parse(themeToggle) : false,
        });
        if (JSON.parse(theme)) {
          dispatch({
            type: types.THEME,
            payload: true,
          });
        } else {
          dispatch({
            type: types.THEME,
            payload: false,
          });
        }
      }

      const searchResult = await getItem('searchResult');

      if (!!searchResult) {
        dispatch({
          type: types.ALL_RECENT_SEARCH,
          payload: searchResult,
        });
      }

      //Language
      const getLanguage = await getItem('language');

      if (!!getLanguage) {
        console.log(getLanguage, "getLanguagegetLanguagegetLanguagegetLanguage");
        strings.setLanguage(getLanguage);
      }

      //saveShortCode
      const saveShortCode = await getItem('saveShortCode');
      if (!!saveShortCode) {
        dispatch({
          type: types.SAVE_SHORT_CODE,
          payload: saveShortCode,
        });
      }
      //Gamil configure
      GoogleSignin.configure();

    })();
    return () => { };
  }, []);

  // Check internet connection
  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const netStatus = state.isConnected;
      setInternet(netStatus);
      updateInternetConnection(netStatus);
    });
    return () => removeNetInfoSubscription();
  }, []);

  const { blurRef } = useRef();


  useEffect(() => {

  }, []);






  return (
    <SafeAreaProvider>
      <MenuProvider>
        <Provider ref={blurRef} store={store}>
          <ForegroundHandler />
          <Routes />
          <NotificationModal />
        </Provider>
      </MenuProvider>
      <FlashMessage position="top" />
      <NoInternetModal show={!internetConnection} />
    </SafeAreaProvider>
  );
};


export default App;