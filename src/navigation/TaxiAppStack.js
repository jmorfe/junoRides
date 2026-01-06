import React from 'react';
import { useSelector } from 'react-redux';
import {
  Addaddress,
  AddNewRider,
  AuthorizeNet,
  ChooseCarTypeAndTimeTaxi,
  ChooseVechile,
  HitPay,
  HomeScreenTaxi, HomeV2Api, Location, MasterCard, Offers,
  OrderDetail,
  Payfast,
  PaymentOptions,
  PayPhone,
  Paystack,
  Pesapal,
  PickupTaxiOrderDetail,
  PinAddressOnMap,
  RateOrder,
  SkipCash,
  TaxiHomeScreen,
  VerifyAccount
} from '../Screens';
import OrderSuccess from '../Screens/OrderSuccess/OrderSuccess';
import DirectPayOnline from '../Screens/PaymentGateways/DirectPayOnline';
import Khalti from '../Screens/PaymentGateways/Khalti';
import BidingDriversList from '../Screens/TaxiApp/BidingDriversList/BidingDriversList';
import navigationStrings from './navigationStrings';
import Livees from '../Screens/PaymentGateways/Livees';
import Paypal from '../Screens/PaymentGateways/Paypal';
import Opay from '../Screens/PaymentGateways/Opay';

export default function (Stack) {

  const { appStyle, appData } = useSelector((state) => state?.initBoot);

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
    }}
  
  return (
    <>
      <Stack.Screen
        name={navigationStrings.HOMESCREENTAXI}
        component={HomeScreenTaxi}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.ADDADDRESS}
        component={Addaddress}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.ADD_NEW_RIDER}
        component={AddNewRider}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.PINADDRESSONMAP}
        component={PinAddressOnMap}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.PAYMENT_OPTIONS}
        component={PaymentOptions}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.CHOOSECARTYPEANDTIMETAXI}
        // component={ChooseCarTypeAndTimeTaxi}
        component={ChooseVechile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.OFFERS2}
        component={Offers}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.LOCATION}
        component={Location}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PICKUPTAXIORDERDETAILS}
        component={PickupTaxiOrderDetail}
        options={{ headerShown: false, unmountOnBlur: false }}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.ORDERSUCESS}
        component={OrderSuccess}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PAYFAST}
        component={Payfast}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PAYPHONE}
        component={PayPhone}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.AuthorizeNet}
        component={AuthorizeNet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PAYSTACK}
        component={Paystack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.DIRECTPAYONLINE}
        component={DirectPayOnline}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.KHALTI}
        component={Khalti}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.SKIP_CASH}
        component={SkipCash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.RATEORDER}
        component={RateOrder}
        options={{
          headerShown: false,
          unmountOnBlur: false,
        }}
      />
      <Stack.Screen
        name={navigationStrings.PESAPAL}
        component={Pesapal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.VERIFY_ACCOUNT_TAXI}
        component={VerifyAccount}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.BIDINGDRIVERSLIST}
        component={BidingDriversList}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name={navigationStrings.LIVESS}
        component={Livees}
        options={{ headerShown: false }}
      />
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
        name={navigationStrings.PAYPAL}
        component={Paypal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.MASTERCARD}
        component={MasterCard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.OPAY}
        component={Opay}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.HITPAY}
        component={HitPay}
        options={{ headerShown: false }}
      />
    </>
  );
}
