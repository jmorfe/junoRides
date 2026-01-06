import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  Addaddress2,
  AllCategories,
  AvailableCars,
  AvailableTechnicians,
  BrandProducts,
  BrandProducts2,
  BuyProduct,
  CarRentalScreen,
  Category,
  CategoryBrands,
  ChatRoom,
  ChatRoomForVendor,
  ChatScreen,
  ConfirmDetailsBuy,
  Delivery,
  EcomOrderAgain,
  Filter,
  FreelancerService,
  HomeTemplate3,
  HomeV2Api,
  LaundryAvailableVendors,
  Location,
  Notifications,
  P2pChatRoom,
  P2pChatScreen,
  P2pOndemandProductDetail,
  P2pOndemandProducts,
  Payment,
  PaymentSuccess,
  ProductPowerConumption,
  ProductPriceDetails,
  ScrollableCategory,
  SendProduct,
  ShippingDetails,
  SpotdealProductAndSelectedProducts,
  SubCategoryItems,
  SubcategoryVendor,
  Subscriptions2,
  SuperMarket,
  TaxiHomeScreen,
  TechnicianProfile,
  TrackDetail,
  Tracking,
  VendorDetail,
  VendorDetail2,
  VendorDetail3,
  Vendors,
  Vendors2,
  Vendors3,
  ViewAllData,
  Wishlist2
} from '../Screens';
import AddVehicleDetails from '../Screens/AddVehicleDetails/AddVehicleDetails';
import BidingDriversList from '../Screens/TaxiApp/BidingDriversList/BidingDriversList';

import navigationStrings from './navigationStrings';

const Stack = createNativeStackNavigator();

export default function () {
  const { appStyle, appData } = useSelector((state) => state?.initBoot);
  const { lastBidInfo, dineInType } = useSelector((state) => state?.home);


  const rendervendorScreen = () => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return Vendors;
      case 2:
        return Vendors2;
      default:
        return Vendors3;
    }
  };

  const renderVendorDetailsScreens = () => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return VendorDetail;
      case 2:
        return VendorDetail2;
      default:
        return VendorDetail3;
    }
  };


  const renderBrandProductsScreens = () => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return BrandProducts;
      default:
        return BrandProducts2;
    }
  };

  // const checkSearchProductVendorItemLayout = (layout) => {
  //   switch (appStyle?.homePageLayout) {
  //     case 1:
  //       return SearchProductVendorItem;
  //     case 8:
  //       return SearchProductVendorItem3V2;
  //     case 10:
  //       return SearchProductVendorItem3V2;
  //     default:
  //       return SearchProductVendorItem3V2;
  //   }
  // };

  const getHomeScreen = (homeScreen) => {
    switch (appStyle?.homePageLayout) {
      case 4:
        return TaxiHomeScreen;
      case 8:
        return HomeV2Api;
      case 10:
        return HomeV2Api;
      default:
        return HomeV2Api;
    }
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>

      {!!lastBidInfo && <Stack.Screen
        name={navigationStrings.BIDINGDRIVERSLIST}
        component={BidingDriversList}
        options={{ headerShown: false }}
      />}
      <Stack.Screen
        name={
          appStyle?.homePageLayout === 4
            ? navigationStrings.TAXIHOMESCREEN
            : navigationStrings.HOME
        }
        component={getHomeScreen()}
        options={{ tabBarVisible: false }}
      />
      <Stack.Screen
        name={navigationStrings.ADDADDRESS}
        // component={Addaddress}
        component={Addaddress2}
      />

      <Stack.Screen name={navigationStrings.DELIVERY} component={Delivery} />
      <Stack.Screen
        name={navigationStrings.SUPERMARKET}
        component={SuperMarket}
      />
      <Stack.Screen
        name={navigationStrings.VENDOR}
        component={rendervendorScreen()}
      />
      <Stack.Screen
        name={navigationStrings.VENDOR_DETAIL}
        component={renderVendorDetailsScreens()}
      />
      {/* <Stack.Screen : >>>>>> move to Routes
        name={navigationStrings.PRODUCT_LIST}
        component={renderProductListScreen()}
      /> */}

      <Stack.Screen
        name={navigationStrings.ADD_VEHICLE_DETAILS}
        component={AddVehicleDetails}
      />

      <Stack.Screen name={navigationStrings.TRACKING} component={Tracking} />

      <Stack.Screen
        name={navigationStrings.TRACKDETAIL}
        component={TrackDetail}
      />
      <Stack.Screen
        name={navigationStrings.SEND_PRODUCT}
        component={SendProduct}
      />
      <Stack.Screen
        name={navigationStrings.BUY_PRODUCT}
        component={BuyProduct}
      />
      <Stack.Screen
        name={navigationStrings.CONFIRM_DETAILS_BUY}
        component={ConfirmDetailsBuy}
      />
      {/* <Stack.Screen : >>>>>> move to Routes
        name={navigationStrings.PRODUCTDETAIL}
        component={renderProductDetailsScreens()}
      /> */}
      {/* <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={checkSearchProductVendorItemLayout()}
        options={verticalAnimation}
      /> */}

      <Stack.Screen name={navigationStrings.LOCATION} component={Location} />

      <Stack.Screen name={navigationStrings.FILTER} component={Filter} />

      <Stack.Screen
        name={navigationStrings.BRANDDETAIL}
        component={renderBrandProductsScreens()}
      />
      <Stack.Screen name={navigationStrings.PAYMENT} component={Payment} />
      <Stack.Screen
        name={navigationStrings.PAYMENT_SUCCESS}
        component={PaymentSuccess}
      />

      <Stack.Screen
        name={navigationStrings.SHIPPING_DETAILS}
        component={ShippingDetails}
      />

      <Stack.Screen
        name={navigationStrings.VIEW_ALL_DATA}
        component={ViewAllData}
      />
      <Stack.Screen
        name={navigationStrings.CATEGORY_BRANDS}
        component={CategoryBrands}
      />
      <Stack.Screen
        name={navigationStrings.CHAT_SCREEN}
        component={dineInType === "p2p" ? P2pChatScreen : ChatScreen}
        options={{ gestureEnabled: true }}
      />
      <Stack.Screen
        name={navigationStrings.SCROLLABLE_CATEGORY}
        component={ScrollableCategory}
      />
      <Stack.Screen
        name={navigationStrings.LAUNDRY_AVAILABLE_VENDORS}
        component={LaundryAvailableVendors}
      />
      <Stack.Screen name={navigationStrings.CHAT_ROOM} component={dineInType === "p2p" ? P2pChatRoom : ChatRoom} />
      <Stack.Screen
        name={navigationStrings.CHAT_ROOM_FOR_VENDOR}
        component={ChatRoomForVendor}
      />
      <Stack.Screen
        name={navigationStrings.SUBSCRIPTION}
        component={Subscriptions2}
      />
      <Stack.Screen
        name={navigationStrings.SUBCATEGORY_VENDORS}
        component={appStyle?.homePageLayout == 10 ? SubCategoryItems : SubcategoryVendor}
      />
      <Stack.Screen
        name={navigationStrings.P2P_PRODUCTS}
        component={P2pOndemandProducts}
      />
      <Stack.Screen
        name={navigationStrings.P2P_PRODUCT_DETAIL}
        component={P2pOndemandProductDetail}
      />

      <Stack.Screen
        name={navigationStrings.SPOTDEALPRODUCTSANDSELECTEDPRODUCTS}
        component={SpotdealProductAndSelectedProducts}
      />
      <Stack.Screen
        name={navigationStrings.FREELANCER_SERVICE}
        component={FreelancerService}
      />
      <Stack.Screen
        name={navigationStrings.AVAILABLE_TECHNICIANS}
        component={AvailableTechnicians}
      />
      <Stack.Screen
        name={navigationStrings.TECHNICIAN_PROFILE}
        component={TechnicianProfile}
      />

      <Stack.Screen
        name={navigationStrings.WISHLIST}
        component={Wishlist2}
      />

      {/* <Stack.Screen
        name={navigationStrings.VIEW_ALL_SEARCH_ITEM}
        component={ViewAllSearchItems}
      /> */}

      <Stack.Screen
        name={navigationStrings.HOME_TEMP_3}
        component={HomeTemplate3}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_AGAIN}
        component={EcomOrderAgain}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_POWER_CONSUMPTION}
        component={ProductPowerConumption}
      />
      <Stack.Screen
        name={navigationStrings.CATEGORY}
        component={Category}
      />
      {/* car rental stacks  */}

      <Stack.Screen
        name={navigationStrings.CAR_RENTAL_HOME}
        component={CarRentalScreen}
      />

      <Stack.Screen
        name={navigationStrings.AVAILABLE_CARS}
        component={AvailableCars}
      />

      <Stack.Screen
        name={navigationStrings.ALL_CATEGORIES}
        component={AllCategories}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_PRICE_DETAILS}
        component={ProductPriceDetails}
      />

      {/* <Stack.Screen
        name={navigationStrings.PAYMENT_SCREEN}
        component={P2pPayment}
      /> */}

      <Stack.Screen
        name={navigationStrings.NOTIFICATION}
        component={Notifications}
      />

    </Stack.Navigator>
  );
}
