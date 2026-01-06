import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  AllinonePyments,
  AllPaymentMethods,
  AuthorizeNet,
  Avenue,
  Cart3,
  CartOD,
  Cashfree,
  Conekta,
  Easebuzz,
  FPX,
  HitPay,
  MasterCard,
  //Pyament Screens
  Mobbex,
  Mpaisa,
  MyCash,
  MyProfile2,
  MyProfile3,
  Offers,
  OpenPay,
  OrderDetail,
  Payfast,
  Paylink,
  PayPhone,
  Paystack,
  Pesapal,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  ProductList3,
  ProductListEcom,
  ScrollableCategory,
  Simplify,
  SkipCash,
  Square,
  StripeOXXO,
  ToyyibPay,
  Userede,
  VerifyAccount,
  VivaWallet,
  WebPayment,
  WindCave,
  Wishlist,
  Wishlist2,
  Yoco,
} from '../Screens';
import MyProfile from '../Screens/MyProfile/MyProfile2';
import OrderSuccess from '../Screens/OrderSuccess/OrderSuccess';
import DirectPayOnline from '../Screens/PaymentGateways/DirectPayOnline';
import Khalti from '../Screens/PaymentGateways/Khalti';
import KongaPay from '../Screens/PaymentGateways/KongaPay';
import Pagarme from '../Screens/PaymentGateways/Pagarme';
import StripeIdeal from '../Screens/PaymentGateways/StripeIdeal';
import navigationStrings from './navigationStrings';
import Livees from '../Screens/PaymentGateways/Livees';
import OffersOnDemand from '../Screens/OnDemand/OffersOnDemand/OffersOnDemand';
import Paypal from '../Screens/PaymentGateways/Paypal';
import Opay from '../Screens/PaymentGateways/Opay';

const Stack = createNativeStackNavigator();
export default function () {
  const { appData, appStyle } = useSelector((state) => state?.initBoot || {});
  const {  dineInType,priceType } = useSelector((state) => state?.home) || {};
  const checkProductListLayout = () => {
    switch (appStyle?.homePageLayout) {
      case 1: return ProductList;
      case 2: return ProductList2;
      case 10: return ProductListEcom
      default: return ProductList3;
    }
  };

  const checkProfileLayout = (layout) => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return MyProfile;
      case 2:
        return MyProfile2;
      default:
        return MyProfile3;
    }
  };
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={navigationStrings.CART}
        component={dineInType=="on_demand"&&  priceType=='vendor' ? CartOD : Cart3}
        options={{ animationEnabled: false }}
      />

      <Stack.Screen
        name={navigationStrings.OFFERS}
        component={Offers}
        options={{ animationEnabled: false }}
      />

      <Stack.Screen
        name={navigationStrings.ALL_PAYMENT_METHODS}
        component={AllPaymentMethods}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name={navigationStrings.ORDERSUCESS}
        component={OrderSuccess}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
      />
      <Stack.Screen
        name={navigationStrings.WEBPAYMENTS}
        component={WebPayment}
      />

      <Stack.Screen
        name={navigationStrings.WISHLIST}
        component={
          appStyle?.homePageLayout === 3 ||
            appStyle?.homePageLayout === 5 ||
            appStyle?.homePageLayout === 8
            ? Wishlist2
            : Wishlist
        }
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={checkProductListLayout()}
      />

      <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={
          appStyle?.homePageLayout === 2 ? ProductDetail2 : ProductDetail
        }
      />

      <Stack.Screen
        name={navigationStrings.MY_PROFILE}
        component={checkProfileLayout()}
      />
      <Stack.Screen name={navigationStrings.MOBBEX} component={Mobbex} />
      <Stack.Screen name={navigationStrings.PAYFAST} component={Payfast} />

      <Stack.Screen name={navigationStrings.YOCO} component={Yoco} />
      <Stack.Screen name={navigationStrings.PAYLINK} component={Paylink} />
      <Stack.Screen
        name={navigationStrings.ALL_IN_ONE_PAYMENTS}
        component={AllinonePyments}
      />
      <Stack.Screen name={navigationStrings.SIMPLIFY} component={Simplify} />
      <Stack.Screen name={navigationStrings.SQUARE} component={Square} />
      <Stack.Screen name={navigationStrings.PAGARME} component={Pagarme} />
      <Stack.Screen name={navigationStrings.PAYSTACK} component={Paystack} />
      <Stack.Screen
        name={navigationStrings.AuthorizeNet}
        component={AuthorizeNet}
      />
      <Stack.Screen
        name={navigationStrings.SCROLLABLE_CATEGORY}
        component={ScrollableCategory}
      />
      <Stack.Screen name={navigationStrings.FPX} component={FPX} />
      <Stack.Screen name={navigationStrings.KONGOPAY} component={KongaPay} />
      <Stack.Screen name={navigationStrings.AVENUE} component={Avenue} />
      <Stack.Screen name={navigationStrings.CASH_FREE} component={Cashfree} />
      <Stack.Screen name={navigationStrings.EASEBUZZ} component={Easebuzz} />
      <Stack.Screen name={navigationStrings.TOYYIAPAY} component={ToyyibPay} />
      <Stack.Screen name={navigationStrings.MPAISA} component={Mpaisa} />
      <Stack.Screen name={navigationStrings.WINDCAVE} component={WindCave} />

      <Stack.Screen name={navigationStrings.PAYPHONE} component={PayPhone} />

      <Stack.Screen
        name={navigationStrings.STRIPEOXXO}
        component={StripeOXXO}
      />
      <Stack.Screen
        name={navigationStrings.VIVAWALLET}
        component={VivaWallet}
      />
      <Stack.Screen name={navigationStrings.MYCASH} component={MyCash} />

      <Stack.Screen
        name={navigationStrings.STRIPEIDEAL}
        component={StripeIdeal}
      />
      <Stack.Screen
        name={navigationStrings.DIRECTPAYONLINE}
        component={DirectPayOnline}
      />
      <Stack.Screen name={navigationStrings.KHALTI} component={Khalti} />
      <Stack.Screen name={navigationStrings.SKIP_CASH} component={SkipCash} />

      <Stack.Screen name={navigationStrings.OPENPAY} component={OpenPay} />
      <Stack.Screen name={navigationStrings.USEREDE} component={Userede} />

      <Stack.Screen
        name={navigationStrings.VERIFY_ACCOUNT}
        component={VerifyAccount}
      />
      <Stack.Screen name={navigationStrings.CONEKTA} component={Conekta} />
      <Stack.Screen name={navigationStrings.PESAPAL} component={Pesapal} />
      <Stack.Screen name={navigationStrings.LIVESS} component={Livees} />
      <Stack.Screen
        name={navigationStrings.OFFERSONDEMAND}
        component={OffersOnDemand}
      />
      <Stack.Screen name={navigationStrings.PAYPAL} component={Paypal} />
      <Stack.Screen name={navigationStrings.OPAY} component={Opay} />
      <Stack.Screen name={navigationStrings.MASTERCARD} component={MasterCard} />
      <Stack.Screen name={navigationStrings.HITPAY} component={HitPay} />
    </Stack.Navigator>
  );
}
