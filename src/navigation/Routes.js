import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';

import {useSelector} from 'react-redux';
import {
  ChatRoom,
  ChatRoomForVendor,
  ChatScreen,
  ChatScreenForVendor,
  DeveloperMode,
  P2pChatRoom,
  P2pChatScreen,
  P2pOndemandProductDetail,
  P2pOndemandProducts,
  P2pPayment,
  P2pWishlist,
  ProductDetail,
  ProductDetail2,
  ProductDetail3,
  ProductList,
  ProductList2,
  ProductList3,
  ProductListEcom,
  SearchProductVendorItem,
  SearchProductVendorItem3V2,
  ViewAllSearchItems,
  Wishlist,
  Wishlist2,
} from '../Screens';
import AppIntro from '../Screens/AppIntro';
import ShortCode from '../Screens/ShortCode/ShortCode';
import AuthStack from './AuthStack';
import CourierStack from './CourierStack';
import DrawerRoutes from './DrawerRoutes';
import {navigationRef} from './NavigationService';
import TabRoutes from './TabRoutes';
import TabRoutesEcommerce from './TabRoutesEcommerce';
import TabRoutesVendor from './TabRoutesVendor';
import TaxiAppStack from './TaxiAppStack';
import TaxiTabRoutes from './TaxiTabRoutes';
import TabRoutesVendorNewTemplate from './VendorApp/TabRoutesVendor';
import navigationStrings from './navigationStrings';
import TabRoutesP2pOnDemand from './TabRoutesP2pOnDemand';
import ProductListOnDemand from '../Screens/ProductList/ProductListOnDemand';

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
      case 11: 
       switch(dineInType){
        case 'on_demand':
         return ProductListOnDemand;
         default:
          return ProductList3;
       }
      default:
        return ProductList3;
    }
  };
  const checkSearchProductVendorItemLayout = (layout) => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return SearchProductVendorItem;
      case 8:
        return SearchProductVendorItem3V2;
      default:
        return SearchProductVendorItem3V2;
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
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {appSessionInfo == 'shortcode' || appSessionInfo == 'show_shortcode' ? (
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
        <Stack.Screen
          name={navigationStrings.DEVELOPER_MODE}
          component={DeveloperMode}
        />
          <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={checkSearchProductVendorItemLayout()}
      />
        <Stack.Screen
        name={navigationStrings.VIEW_ALL_SEARCH_ITEM}
        component={ViewAllSearchItems}
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
