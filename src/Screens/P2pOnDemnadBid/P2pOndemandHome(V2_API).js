import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import Voice from '@react-native-voice/voice';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  Linking,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AppLink from 'react-native-app-link';
import DeviceInfo from 'react-native-device-info';
import Geocoder from 'react-native-geocoding';
import { enableFreeze } from 'react-native-screens';
import { useSelector } from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import IconTextRow from '../../Components/IconTextRow';
import OoryksHeader from '../../Components/OoryksHeader';
import SelectSearchFromMap from '../../Components/SelectSearchFromMap';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { shortCodes } from '../../utils/constants/DynamicAppKeys';
import {
  androidBackButtonHandler,
  getCurrentLocation,
  showError
} from '../../utils/helperFunctions';
import { openAppSetting } from '../../utils/openNativeApp';
import {
  chekLocationPermission,
  onlyCheckLocationPermission,
} from '../../utils/permissions';
import socketServices from '../../utils/scoketService';
import { getColorSchema } from '../../utils/utils';
import DashBoardFiveV2Api from './DashBoardParts/DashBoardFiveV2Api';
import DashBoardHeaderFive from './DashBoardParts/DashBoardHeaderFive';

enableFreeze(true);

export default function Home({ route, navigation }) {
  const paramData = route?.params;
  const {
    appData,
    currencies,
    languages,
    appStyle,
    isDineInSelected,
    themeColor,
    themeToggle,

  } = useSelector(state => state?.initBoot);
  const { location, appMainData, dineInType, isLocationSearched, refreshType,isSubscription } =
    useSelector(state => state?.home);

  const fontFamily = appStyle?.fontSizeData;

  const isFocused = useIsFocused();
  const { cartItemCount } = useSelector(state => state?.cart);


  const { userData } = useSelector(state => state?.auth);
  const { pendingNotifications } = useSelector(
    state => state?.pendingNotifications,
  );

  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const [isLaundryAddonModal, setLaundryAddonModal] = useState(false);
  const [isLoadingAddons, setLoadingAddons] = useState(true);
  const [selectedLaundryCategory, setSelectedLaundryCategory] = useState({});
  const [esitmatedLaundryProducts, setEsitmatedLaundryProducts] = useState([]);
  const [minMaxError, setMinMaxError] = useState([]);
  const [isOnPressed, setIsOnPressed] = useState(false);
  const [selectedHomeCategory, setSelectedHomeCategory] = useState({});
  const [isLocationModal, setisLocationModal] = useState(false);
  const [isSelectViaMap, setisSelectViaMap] = useState(false);

  const [state, setState] = useState({
    isLoading: true,
    isRefreshing: false,
    selectedTabType: '',
    updateTime: 0,
    isDineInSelected: false,
    pageActive: 1,
    currentLocation: '',
    saveAllUserAddress: null,
    isLoadingB: false,
    searchDataLoader: false,
    openVendor: 0,
    closeVendor: 0,
    bestSeller: 0,
    tempCartData: null,
    isVoiceRecord: false,
    singleVendor: false,
    selectedAddonSet: [],
    unPresentAry: [],
    stopOrderModalVisible: true,
    curLatLong: null,
    selectedFilterType: {},
  });

  const {
    tempCartData,
    updateTime,
    isLoading,
    isRefreshing,
    selectedTabType,
    pageActive,
    currentLocation,
    saveAllUserAddress,
    isLoadingB,
    searchDataLoader,
    openVendor,
    closeVendor,
    bestSeller,
    selectedFilterType,
    isVoiceRecord,
    singleVendor,
    selectedAddonSet,
    unPresentAry,
    stopOrderModalVisible,
    curLatLong,
  } = state;

  const { profile } = appData;

  useEffect(() => {
    if (!!userData?.auth_token && !!appData?.profile?.socket_url) {
      socketServices.initializeSocket(appData?.profile?.socket_url);
    }
  }, [appData]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        androidBackButtonHandler,
      );
      return () => backHandler.remove();
    }, []),
  );
  useEffect(() => {
    updateState({ updatedData: appMainData?.categories });
  }, [appMainData]);

  useEffect(() => {
    if (
      paramData?.details &&
      paramData?.details?.formatted_address != location?.address
    ) {
      _getLocationFromParams();
      updateState({
        selectedFilterType: {},
      });
    }
  }, [paramData?.details]);

  useFocusEffect(
    useCallback(() => {
      Voice.onSpeechStart = onSpeechStartHandler;
      Voice.onSpeechEnd = onSpeechEndHandler;
      Voice.onSpeechResults = onSpeechResultsHandler;
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (!!userData?.auth_token) {
        getAllTempOrders();
        getUserProfileData();
      }
    }, []),
  );

  const getUserProfileData = () => {
    actions
      .getUserProfile(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then(res => {
        console.log('get user profile', res);

        actions.updateProfile({ ...userData, ...res?.data });
      })
      .catch(errorMethod);
  };

  useEffect(() => {
    getLocationPermissionStatus();
  }, []);

  useEffect(() => {
    if (refreshType == 'Y') {
      homeData();
    }
  }, [refreshType]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getLocationPermissionStatus()
  //   }, []),
  // );

  const getLocationPermissionStatus = () => {
    if (location?.latitude === '') {
      onlyCheckLocationPermission()
        .then(res => {
          setisLocationModal(false);
          onGetCurrentLoc();
        })
        .catch(err => {
          setisLocationModal(true);
          homeData();
        });
    } else {
      homeData();
    }
  };

  const checkAndGetLocation = (isOpen = false) => {
    chekLocationPermission(true)
      .then(result => {
        if (result !== 'goback' && result == 'granted') {
          onGetCurrentLoc();
        } else if (result === 'blocked') {
          Alert.alert(
            '',
            'Location Permission disabled, allow it from settings',
            [
              {
                text: strings.CANCEL,
                onPress: () => console.log('Cancel Pressed'),
              },
              {
                text: strings.CONFIRM,
                onPress: openAppSetting,
              },
            ],
          );
        } else {
          homeData(null);
        }
      })
      .catch(error => {
        console.log('error while accessing location', error);
        console.log('api hit without lat lng');
        homeData();
        return;
      });
  };

  const onGetCurrentLoc = () => {
    getCurrentLocation('home')
      .then(curLoc => {
        setisLocationModal(false);
        updateState({
          curLatLong: curLoc,
        });
        actions.locationData(curLoc);
        homeData(curLoc);
        return;
      })
      .catch(err => {
        homeData();
        return;
      });
  };

  useEffect(() => {
    Geocoder.init(Platform.OS=='ios'?profile?.preferences?.map_key_for_ios_app||profile?.preferences?.map_key:profile?.preferences?.map_key_for_app|| profile?.preferences?.map_key, { language: 'en' }); // set the language
  }, []);

  const _getLocationFromParams = () => {
    actions.isLocationSearched(true);
    const address = paramData?.details?.formatted_address;
    const res = {
      address: address,
      latitude: paramData?.details?.geometry?.location.lat,
      longitude: paramData?.details?.geometry?.location.lng,
    };
    if (
      res?.latitude != location?.latitude &&
      res?.longitude != location?.longitude
    ) {
      if (cartItemCount?.data?.item_count) {
        checkCartWithLatLang(res);
      } else {
        updateLatLang(res);
      }
    } else {
      updateLatLang(res);
    }
  };

  const checkCartWithLatLang = res => {
    Alert.alert('', strings.THIS_WILL_REMOVE_CART, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        // style: 'destructive',
      },
      { text: strings.CLEAR_CART2, onPress: () => clearCart(res) },
    ]);
  };

  const clearCart = location => {
    updateLatLang(location);
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then(res => {
        actions.cartItemQty(res);
        homeData(location);
      })
      .catch(errorMethod);
  };

  const updateLatLang = res => {
    actions.locationData(res);
    homeData(res);
  };



  const getAllTempOrders = () => {
    actions
      .getAllTempOrders(
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then(res => {
        if (res && res?.data) {
          updateState({
            tempCartData: res?.data,
          });
        }
      })
      .catch(errorMethod);
  };

  //Home data
  const homeData = (locationData = null, selectedFilter = null) => {
    if (!isFocused) {
      return;
    }
    if (!!paramData) {
      updateState({ searchDataLoader: true });
    }
    let latlongObj = {};

    if (!!locationData || !isEmpty(location)) {
      latlongObj = {
        address: locationData?.address || location?.address || '',
        latitude: locationData?.latitude || location?.latitude || '',
        longitude: locationData?.longitude || location?.longitude || '',
      };
    }

    let vendorFilterData = {
      open_vendor: selectedFilter?.id == 1 ? 1 : 0,
      close_vendor: selectedFilter?.id == 2 ? 1 : 0,
      best_vendor: selectedFilter?.id == 3 ? 1 : 0,
    };
    if (closeVendor == 0 && openVendor == 0 && bestSeller == 0) {
      updateState({ singleVendor: true });
    } else {
      updateState({ singleVendor: false });
    }

    {
      var selectedVendorType = null;
      var defaultVendorType = null;

      if (!!appData?.profile && appData?.profile?.preferences?.vendorMode) {
        defaultVendorType = appData?.profile?.preferences?.vendorMode[0]?.type; //
        appData?.profile?.preferences?.vendorMode.forEach((val, i) => {
          if (val?.type == dineInType) {
            selectedVendorType = val.type;
          }
        });
      }
      if (!selectedVendorType) {
        actions.dineInData(defaultVendorType);
      }
      let apiData = {
        type: !!selectedVendorType ? selectedVendorType : defaultVendorType,
        ...latlongObj,
        ...vendorFilterData,
        category_limit: 4,
      };

      let apiHeader = {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      };
      console.log('sending api data header', apiData, apiHeader);
      console.log(JSON.stringify({ ...apiData, action: 2 }), "fasjdgjfikh")

      actions
        .homeDataV2({ ...apiData, action: 2 }, apiHeader)
        .then(async res => {
          console.log('Home data++++++', res);

          updateState({ searchDataLoader: false });
          if (
            appData?.profile?.preferences?.is_hyperlocal &&
            location?.latitude == '' &&
            location?.longitude == ''
          ) {
            if (
              typeof res?.data?.reqData == 'object' &&
              res?.data?.reqData?.latitude &&
              res?.data?.reqData?.longitude
            ) {
              const data = {
                address: res?.data?.reqData?.address,
                latitude: res?.data?.reqData?.latitude,
                longitude: res?.data?.reqData?.longitude,
              };
              actions.locationData(data);
            }
          }
          setTimeout(() => {
            updateState({
              isLoading: false,
              isLoadingB: false,
              searchDataLoader: false,
            });
          }, 1500);
        })
        .catch(errorMethod);
    }
  };

  //Error handling in screen
  const errorMethod = error => {
    console.log(error, 'erro>>>>>>errorerrorr');
    setLoadingAddons(false);
    updateState({
      isLoading: false,
      isRefreshing: false,
      acceptLoader: false,
      rejectLoader: false,
      selectedOrder: null,
      isLoadingB: false,
      searchDataLoader: false,
    });
    showError(error?.message || error?.error);
  };


  //update state
  const updateState = data => setState(state => ({ ...state, ...data }));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  const openUber = () => {
    let appName = 'Uber - Easy affordable trips';
    let appStoreLocale = '';
    let playStoreId = 'com.ubercab';
    let appStoreId = '368677368';
    AppLink.maybeOpenURL('uber://', {
      appName: appName,
      appStoreId: appStoreId,
      appStoreLocale: appStoreLocale,
      playStoreId: playStoreId,
    })
      .then(res => { })
      .catch(err => {
        Linking.openURL('https://www.uber.com/in/en/');
        console.log('errro raised', err);
        // handle error
      });
  };

  const onPressVendor = item => {
    if (item?.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        if (shortCodes.arenagrub == appData?.profile?.code) {
          openUber();
        } else {
          item['pickup_taxi'] = true;
          moveToNewScreen(navigationStrings.ADDADDRESS, item)();
        }
      } else {
        actions.setAppSessionData('on_login');
      }
    } else if (!!item?.is_show_category) {
      moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
        item,
        rootProducts: true,
        // categoryData: data,
      })();
    } else {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, {
        id: item?.id,
        vendor: true,
        name: item?.name,
        isVendorList: true,
        fetchOffers: true,
      })();
    }
  };

  //onPress Category
  const onPressCategory = item => {
    if (
      item?.redirect_to == staticStrings.P2P ||
      item?.redirect_to == staticStrings.RENTAL_SERVICE
    ) {
      moveToNewScreen(navigationStrings.P2P_PRODUCTS, item)();
      return;
    }
    if (item?.redirect_to == staticStrings.FOOD_TEMPLATE) {
      moveToNewScreen(navigationStrings.SUBCATEGORY_VENDORS, item)();

      return;
    }
    if (item.redirect_to == staticStrings.VENDOR) {
      moveToNewScreen(navigationStrings.VENDOR, item)();
    } else if (
      item.redirect_to == staticStrings.PRODUCT ||
      item.redirect_to == staticStrings.CATEGORY ||
      item.redirect_to == staticStrings.ONDEMANDSERVICE ||
      item?.redirect_to == staticStrings.LAUNDRY
    ) {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, {
        fetchOffers: true,
        id: item.id,
        vendor:
          item.redirect_to == staticStrings.ONDEMANDSERVICE ||
            item.redirect_to == staticStrings.PRODUCT ||
            item?.redirect_to == staticStrings.LAUNDRY
            ? false
            : true,
        name: item.name,
        isVendorList: false,
      })();
    } else if (item.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        if (shortCodes.arenagrub == appData?.profile?.code) {
          openUber();
        } else {
          item['pickup_taxi'] = true;
          // moveToNewScreen(navigationStrings.MULTISELECTCATEGORY, item)();
          moveToNewScreen(navigationStrings.ADDADDRESS, item)();
        }
      } else {
        actions.setAppSessionData('on_login');
      }
    } else if (item.redirect_to == staticStrings.DISPATCHER) {
      // moveToNewScreen(navigationStrings.DELIVERY, item)();
    } else if (item.redirect_to == staticStrings.CELEBRITY) {
      moveToNewScreen(navigationStrings.CELEBRITY)();
    } else if (item.redirect_to == staticStrings.BRAND) {
      moveToNewScreen(navigationStrings.CATEGORY_BRANDS, item)();
    } else if (item.redirect_to == staticStrings.SUBCATEGORY) {
      // moveToNewScreen(navigationStrings.PRODUCT_LIST, item)();
      moveToNewScreen(navigationStrings.VENDOR_DETAIL, { item })();
    } else if (!item.is_show_category || item.is_show_category) {
      item?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
          item,
          rootProducts: true,
          // categoryData: data,
        })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
          id: item?.id,
          vendor: true,
          name: item?.name,
          isVendorList: true,
          fetchOffers: true,
        })();

      // moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };

  //On Press banner
  const bannerPress = data => {
    let item = {};
    if (data?.redirect_id) {
      if (data?.redirect_to == staticStrings.VENDOR && data?.is_show_category) {
        moveToNewScreen(navigationStrings.PRODUCT_LIST, {
          id: data.redirect_id,
          vendor: true,
          name: data.redirect_name,
          fetchOffers: true,
        })();
        return;
      }
      if (data?.redirect_to == staticStrings.VENDOR) {
        item = {
          ...data?.vendor,
          redirect_to: data.redirect_to,
        };
      } else {
        item = {
          id: data.redirect_id,
          redirect_to: data.redirect_to,
          name: data.redirect_name,
        };
      }

      if (data.redirect_to == staticStrings.VENDOR) {
        data?.is_show_category
          ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
            // categoryData: data,
          })()
          : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
            id: data.redirect_id,
            vendor: true,
            name: data.redirect_name,
            fetchOffers: true,
          })();
      } else if (data.redirect_to == staticStrings.CATEGORY) {
        if (data?.category?.type?.title == staticStrings.VENDOR) {
          let dat2 = data;
          dat2['id'] = data?.redirect_id;
          moveToNewScreen(navigationStrings.VENDOR, dat2)();
          return;
        } else {
          if (data?.category?.type?.title == staticStrings.PRODUCT) {
            moveToNewScreen(navigationStrings.PRODUCT_LIST, {
              id: data.redirect_id,
              // vendor: true,
              name: data.redirect_name,
              fetchOffers: true,
            })();
            return;
            // let dat2 = data;
            // dat2['id'] = data?.redirect_id;
            // moveToNewScreen(navigationStrings.VENDOR, dat2)();
          }
          if (data.redirect_to == staticStrings.CATEGORY) {
            moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
              item,
              rootProducts: true,
              // categoryData: data,
            })();
            return;
          } else {
            moveToNewScreen(navigationStrings.PRODUCT_LIST, {
              id: data.redirect_id,
              // vendor: true,
              name: data.redirect_name,
              fetchOffers: true,
            })();
          }
        }
        if (data.redirect_to == staticStrings.CATEGORY) {
          moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
            // categoryData: data,
          })();
          return;
        }
      }
    }
  };

  //Reloads the screen
  const initApiHit = () => {
    let header = {};
    header = {
      code: appData?.profile?.code,
      language: languages?.primary_language?.id,
    };

    actions

      .initApp(
        {},
        header,
        true,
        currencies?.primary_currency,
        languages?.primary_language,
      )
      .then(res => {
        console.log(res, 'initApp');
        updateState({ isRefreshing: false });
      })
      .catch(error => {
        updateState({ isRefreshing: false });
      });
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ isRefreshing: true });
    initApiHit();
    homeData();
  };

  const selcetedToggle = type => {
    actions.dineInData(type);

    updateState({
      selectedFilterType: {},
    });

    if (dineInType != type) {
      {
        updateState({
          selectedTabType: type,
          isLoadingB: true,
        });
      }
    } else {
      updateState({
        selectedTabType: type,
      });
    }
  };

  const onVendorFilterSeletion = selectedFilter => {
    updateState({
      isLoadingB: true,
      openVendor: selectedFilter?.id == 1 ? 1 : 0,
      closeVendor: selectedFilter?.id == 2 ? 1 : 0,
      bestSeller: selectedFilter?.id == 3 ? 1 : 0,
      selectedFilterType: selectedFilter,
    });
    homeData(location, selectedFilter);
  };

  const onSpeechStartHandler = e => { };
  const onSpeechEndHandler = e => {
    updateState({
      isVoiceRecord: false,
    });
  };

  const onSpeechResultsHandler = e => {
    let text = e.value[0];
    moveToNewScreen(navigationStrings.SEARCHPRODUCTOVENDOR, {
      voiceInput: text,
    })();
    _onVoiceStop();
  };

  const _onVoiceListen = async () => {
    const langType = languages?.primary_language?.sort_code;
    updateState({
      isVoiceRecord: true,
    });
    try {
      await Voice.start(langType);
    } catch (error) { }
  };

  const _onVoiceStop = async () => {
    updateState({
      isVoiceRecord: false,
    });
    try {
      await Voice.stop();
    } catch (error) {
      console.log('error raised', error);
    }
  };



  const showAllProducts = item => {
    moveToNewScreen(navigationStrings.PRODUCT_LIST, {
      id: item?.data?.category_detail?.id,
      vendor: false,
      name:
        item?.data?.category_detail?.title || item?.data?.category_detail?.slug,
      isVendorList: false,
      fetchOffers: false,
      productWithSingleCategory: true,
    })();
  };

  const showAllSpotDealAndSelectedProducts = item => {
    console.log(item, 'selected product for spoatdeals');
    moveToNewScreen(
      navigationStrings.SPOTDEALPRODUCTSANDSELECTEDPRODUCTS,
      item,
    )();
  };



  const _closeModal = () => {
    updateState({
      isSubscription: false,
    });
  };


  const addressDone = async data_ => {
    setisLocationModal(false);
    actions.locationData(data_);
    setisSelectViaMap(false);

    homeData(data_);
  };

  const renderHomeScreen = () => {
    return (
      <>
        <DashBoardHeaderFive
          showToggles={false}
          navigation={navigation}
          location={location}
          selcetedToggle={selcetedToggle}
          toggleData={appData}
          isLoading={isLoading}
          currentLocation={currentLocation}
          isLoadingB={isLoadingB}
          _onVoiceListen={_onVoiceListen}
          isVoiceRecord={isVoiceRecord}
          _onVoiceStop={_onVoiceStop}
          onPressAddress={() => setisSelectViaMap(true)}
        />
        <DashBoardFiveV2Api
          handleRefresh={() => handleRefresh()}
          bannerPress={item => bannerPress(item)}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          appMainData={appMainData}
          onPressCategory={item => {
            onPressCategory(item);
          }}
          onPressVendor={item => {
            onPressVendor(item);
          }}
          isDineInSelected={isDineInSelected}
          selcetedToggle={selcetedToggle}
          tempCartData={tempCartData}
          toggleData={appData}
          navigation={navigation}
          onVendorFilterSeletion={onVendorFilterSeletion}
          singleVendor={singleVendor}
          isLoadingAddons={isLoadingAddons}
          selectedHomeCategory={selectedHomeCategory}
          onClose={_closeModal}
          onPressSubscribe={_onPressSubscribe}
          isSubscription={isSubscription}
          selectedFilterType={selectedFilterType}
          showAllProducts={showAllProducts}
          showAllSpotDealAndSelectedProducts={
            showAllSpotDealAndSelectedProducts
          }
        />
      </>
    );
  };

  useEffect(() => {
    if (!!userData?.auth_token) {
      (async () => {
        try {
          const res = await actions.allPendingOrders(
            `?limit=${10}&page=${pageActive}`,
            {},
            {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
              // systemuser: DeviceInfo.getUniqueId(),
            },
          );
          console.log('pending res==>>>', res.data.order_list);
          let orders =
            pageActive == 1
              ? res.data.order_list.data
              : [...pendingNotifications, ...res.data.order_list.data];
          actions.pendingNotifications(orders);
        } catch (error) {
          console.log('erro rirased', error);
        }
      })();
    }
  }, []);

  const _onPressSubscribe = () => {
    actions.changeSubscriptionModal(false)
    moveToNewScreen(navigationStrings.SUBSCRIPTION)();
  };

  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      isLoading={searchDataLoader}>
      <>{renderHomeScreen()}</>
      <Modal
        visible={isLocationModal}
        onDismiss={() => {
          setisSelectViaMap(false);
        }}
        transparent={true}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            width: WINDOW_WIDTH,
            height: WINDOW_HEIGHT,
          }}>
          <View
            style={{
              alignSelf: 'center',
              marginTop: moderateScaleVertical(106),
              height: moderateScaleVertical(167),
              backgroundColor: colors.white,
              width: moderateScale(312),
            }}>
            <View style={{ marginHorizontal: moderateScale(21) }}>
              <IconTextRow
                icon={imagePath.ic_map}
                containerStyle={{ marginTop: moderateScaleVertical(26) }}
                textStyle={{
                  color: colors.black,
                  marginLeft: moderateScale(12),
                }}
                text="Please provide your location."
              />
              <GradientButton
                onPress={checkAndGetLocation}
                leftImgSrc={imagePath.ic_map}
                leftImgStyle={{
                  resizeMode: 'contain',
                  height: moderateScaleVertical(20),
                  width: moderateScale(20),
                }}
                btnText="Allow to track Current Location"
                textStyle={{ color: colors.white, fontSize: textScale(12) }}
                containerStyle={{
                  backgroundColor: colors.orangeBtn,
                  marginTop: moderateScaleVertical(14),
                  borderRadius: 4,
                  height: moderateScaleVertical(36),
                }}
              />
              <TouchableOpacity
                style={{
                  marginTop: moderateScaleVertical(11),
                  height: moderateScaleVertical(36),
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: colors.profileInputborder,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: moderateScaleVertical(12),
                }}
                onPress={() => {
                  setisLocationModal(false);
                  setTimeout(() => {
                    setisSelectViaMap(true);
                  }, 500);
                }}>
                <Image source={imagePath.icoSearch} />
                <Text
                  style={{
                    marginLeft: moderateScale(8),
                    color: colors.blackOpacity66,
                    fontSize: textScale(12),
                    fontFamily: fontFamily?.medium,
                  }}>
                  Add Location Manually
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isSelectViaMap}>
        <WrapperContainer>
          <OoryksHeader
            titleStyle={{
              color: colors.black
            }}
            onPressLeft={() => {
              setisSelectViaMap(false);
              if (
                isEmpty(currentLocation?.address) &&
                isEmpty(location?.address)
              ) {
                setTimeout(() => {
                  setisLocationModal(true);
                }, 500);
              }
            }}
            leftTitle="Add Your Location"
            isCustomLeftPress
          />

          <View
            style={{
              flex: 1,
              marginHorizontal: moderateScale(12),
              overflow: 'hidden',
              borderRadius: moderateScale(12),
            }}>
            <SelectSearchFromMap
              addressDone={addressDone}
              currentLocation={currentLocation}
              location={location}
            />
          </View>
        </WrapperContainer>
      </Modal>
    </WrapperContainer>
  );
}
