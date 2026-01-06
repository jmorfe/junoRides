import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {Suspense, lazy} from 'react';

import {useSelector} from 'react-redux';

const ProductDetail = React.lazy(() =>
  import('../Screens/ProductDetail/ProductDetail'),
);
const ProductDetail2 = React.lazy(() =>
  import('../Screens/ProductDetail/ProductDetail2'),
);
const ProductDetail3 = React.lazy(() =>
  import('../Screens/ProductDetail/ProductDetail3'),
);

const ChatRoom = React.lazy(() => import('../Screens/ChatRoom/ChatRoom'));
const ChatRoomForVendor = React.lazy(() =>
  import('../Screens/ChatRoom/ChatRoomForVendor'),
);
const ChatScreen = React.lazy(() => import('../Screens/ChatScreen/ChatScreen'));

const ChatScreenForVendor = React.lazy(() =>
  import('../Screens/ChatScreen/ChatScreenForVendor'),
);
const P2pChatRoom = React.lazy(() =>
  import('../Screens/P2pOnDemnadBid/P2pChat/ChatRoom/ChatRoom'),
);
const P2pChatScreen = React.lazy(() =>
  import('../Screens/P2pOnDemnadBid/P2pChat/ChatScreen/ChatScreen'),
);
const P2pOndemandProductDetail = React.lazy(() =>
  import(
    '../Screens/P2pOnDemnadBid/P2pOndemandProductDetail/P2pOndemandProductDetail'
  ),
);
const P2pOndemandProducts = React.lazy(() =>
  import(
    '../Screens/P2pOnDemnadBid/P2pOndemandProductDetail/P2pOndemandProductDetail'
  ),
);
const P2pPayment = React.lazy(() =>
  import('../Screens/P2pOnDemnadBid/P2pPayments/P2pPayment'),
);
const P2pWishlist = React.lazy(() =>
  import('../Screens/P2pOnDemnadBid/P2pWishlist/P2pWishlist'),
);
const ProductListEcom = React.lazy(() =>
  import('../Screens/ProductList/ProductListEcom'),
);
const Wishlist = React.lazy(() => import('../Screens/Wishlist/Wishlist'));
const Wishlist2 = React.lazy(() => import('../Screens/Wishlist/Wishlist2'));

const ProductList = React.lazy(() =>
  import('../Screens/ProductList/ProductList'),
);
const ProductList2 = React.lazy(() =>
  import('../Screens/ProductList/ProductList2'),
);
const ProductList3 = React.lazy(() =>
  import('../Screens/ProductList/ProductList3'),
);

import AppIntro from '../Screens/AppIntro';
import ShortCode from '../Screens/ShortCode/ShortCode';
import AuthStack from './AuthStack';

import {navigationRef} from './NavigationService';
import TabRoutesVendorNewTemplate from './VendorApp/TabRoutesVendor';
import navigationStrings from './navigationStrings';

import {ActivityIndicator} from 'react-native';

import TabRoutesP2pOnDemand from './TabRoutesP2pOnDemand';
import DrawerRoutes from './DrawerRoutes';
import TabRoutes from './TabRoutes';
import TabRoutesEcommerce from './TabRoutesEcommerce';
import TabRoutesVendor from './TabRoutesVendor';
import TaxiAppStack from './TaxiAppStack';
import TaxiTabRoutes from './TaxiTabRoutes';
import CourierStack from './CourierStack';

// const TabRoutes = React.lazy(() => import('./TabRoutes'));

const Stack = createNativeStackNavigator();

export default function Routes() {
  const {userData, appSessionInfo} = useSelector(state => state?.auth || {});
  const {appStyle, themeColors, appData} = useSelector(
    state => state?.initBoot || {},
  );
  const {dineInType} = useSelector(state => state?.home);
  const checkProductListLayout = () => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return ProductList;
      case 2:
        return ProductList2;
      case 10:
        return ProductListEcom;
      default:
        return ProductList3;
    }
  };

  const renderProductDetailsScreens = () => {
    if (dineInType == 'car_rental') {
      return ProductDetail3;
    }
    switch (appStyle?.homePageLayout) {
      case 2:
        return ProductDetail2;
      default:
        return ProductDetail;
    }
  };

  const businessType = appStyle?.homePageLayout;
  return (
    <NavigationContainer ref={navigationRef}>
      <Suspense fallback={<ActivityIndicator />}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {appSessionInfo == 'shortcode' ||
          appSessionInfo == 'show_shortcode' ? (
            <Stack.Screen
              name={navigationStrings.SHORT_CODE}
              component={ShortCode}
            />
          ) : appSessionInfo == 'app_intro' ? (
            <Stack.Screen
              name={navigationStrings.APP_INTRO}
              component={AppIntro}
              options={{gestureEnabled: false}}
            />
          ) : appSessionInfo == 'guest_login' || !!userData?.auth_token ? (
            <React.Fragment>
              {businessType === 10 ? (
                <Stack.Screen
                  name={navigationStrings.DRAWER_ROUTES}
                  component={DrawerRoutes}
                  options={{gestureEnabled: false}}
                />
              ) : (
                <Stack.Screen
                  name={navigationStrings.TAB_ROUTES}
                  component={
                    // !!appData?.profile?.preferences?.is_rental_weekly_monthly_price ? TabRoutesP2pOnDemand :
                    businessType === 4 || dineInType == 'pick_drop'
                      ? TaxiTabRoutes
                      : businessType === 8
                      ? TabRoutesP2pOnDemand
                      : businessType === 10
                      ? TabRoutesEcommerce
                      : TabRoutes
                  }
                  options={{gestureEnabled: false}}
                />
              )}
            </React.Fragment>
          ) : (
            AuthStack(Stack, appStyle, appData)
          )}

          {CourierStack(Stack)}

          {TaxiAppStack(Stack)}

          <Stack.Screen
            name={navigationStrings.CHAT_SCREEN}
            component={dineInType === 'p2p' ? P2pChatScreen : ChatScreen}
          />
          <Stack.Screen
            name={navigationStrings.CHAT_SCREEN_FOR_VENDOR}
            component={ChatScreenForVendor}
          />
          <Stack.Screen
            name={navigationStrings.CHAT_ROOM}
            component={dineInType === 8 ? P2pChatRoom : ChatRoom}
          />
          <Stack.Screen
            name={navigationStrings.CHAT_ROOM_FOR_VENDOR}
            component={ChatRoomForVendor}
          />

          <Stack.Screen
            name={navigationStrings.TABROUTESVENDOR}
            component={TabRoutesVendor}
            options={{gestureEnabled: false}}
          />
          <Stack.Screen
            name={navigationStrings.TABROUTESVENDORNEW}
            component={TabRoutesVendorNewTemplate}
            options={{gestureEnabled: false}}
          />
          <Stack.Screen
            name={navigationStrings.WISHLIST}
            component={
              dineInType == 'p2p'
                ? P2pWishlist
                : appStyle?.homePageLayout === 3 ||
                  appStyle?.homePageLayout === 5 ||
                  appStyle?.homePageLayout === 8
                ? Wishlist2
                : Wishlist
            }
          />
          <Stack.Screen
            name={navigationStrings.P2P_PRODUCT_DETAIL}
            component={P2pOndemandProductDetail}
          />
          <Stack.Screen
            name={navigationStrings.P2P_PRODUCTS}
            component={P2pOndemandProducts}
          />
          <Stack.Screen
            name={navigationStrings.PAYMENT_SCREEN}
            component={P2pPayment}
          />
          <Stack.Screen
            name={navigationStrings.PRODUCT_LIST}
            component={checkProductListLayout()}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={navigationStrings.PRODUCTDETAIL}
            component={renderProductDetailsScreens()}
          />
        </Stack.Navigator>
      </Suspense>
    </NavigationContainer>
  );
}
