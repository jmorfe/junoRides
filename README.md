# Introduction
Welcome to RoyoOrders by Code Brew Labs!

RoyoOrders is an all-in-one software solution designed to cater to a wide range of business needs. Whether you are running a food delivery service, a dine-out restaurant, an appointment-based business, home services, P2P (peer-to-peer) services, or a taxi service, RoyoOrders has you covered.

# Features
1. Delivery: Manage and track deliveries efficiently.
2. Dine-In: Handle reservations and in-house dining orders.
3. Take Away: Manage orders for takeaway.
4. Rent Items: Facilitate the rental of various items.
5. Taxi Service: Manage taxi bookings and track rides in real-time.
6. Home Services: Organize and track home service requests and fulfillments.
7. Appointments: Schedule and manage appointments.
8. P2P: Facilitate peer-to-peer service transactions.
9. Car Rental: Manage car rental bookings and track vehicle availability.
10. Inventory Tracking: Monitor stock levels and receive alerts for low inventory.
11. Customer Management: Store and manage customer information securely.
12. Reporting: Generate comprehensive reports on sales, inventory, and more.


#Installation of project

##Prerequisites
Before you begin, ensure you have met the following requirements:

* React Native CLI
* Android Studio
* Node.js version 18 or later
* NPM (Node Package Manager)
* Java version 17 or later


##Installing RoyoOrders
To install RoyoOrders, follow these steps:
1. git clone https://cbl-ro@dev.azure.com/cbl-ro/royoorders2.0/_git/royoorders2.0
2. Navigate to royoorders2.0 directory.
3. Open your project in code editor.
4. Run npm i --legacy-peer-deps
 

# Target Flavors
Our project uses the concept of target flavors to build multiple apps with the same codebase. 
This allows for easy management and customization of different app variants.

##Configuring Flavors
The flavors are defined in the android/app/build.gradle file:
```
flavorDimensions "appType"

productFlavors {
    royoorder {
        dimension "appType"
        versionCode 3
        versionName "1.0"
        applicationId 'com.codebrew.royoorder'
        resValue "string", "app_name", "RoyoOrder"
        resValue "string", "host_name", "sales.royoorders.com"
    }
}
```
##Running Flavors
To run a specific flavor, use the following commands and these scripts are declared in the `package.json` file:
```
  "scripts": {
    "royoorder": "react-native run-android --mode=royoorderDebug --appIdSuffix=royoorder",
    "royoorderRelease": "cd android && ./gradlew assembleRoyoorderRelease",
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint .",
    "clean": "cd ./android && ./gradlew clean",
    "uninstallAll": "cd android && ./gradlew uninstallAll",
    "postinstall": "patch-package",
    "build:ios": "react-native bundle --entry-file='index.js' --bundle-output='./ios/main.jsbundle' --dev=false --platform='ios'"
  },
```
* Development build:
```
npm run royoorder
```
* Production build
```
npm run royoorderRelease
```

#Code Flow:- How our code works


1. ##Starting the Application
    * Run the script ```npm run royoorder``` to build and start the royoorder variant of the app.

2. ##Initial Entry Point
    * The app's execution begins in ```index.js.```

3. ##Loading the Main App Component
    * ```index.js``` imports and loads ```App.js.```

4. ##Handling Permissions and Async Operations
    * In App.js, the app handles necessary permissions.
    * It performs asynchronous operations to retrieve user data from Async Storage, if available and set it to the redux(state management library to handle data in application).

5. ##Displaying the Initial Screen
    * The flow then moves to ```ShortCode.js``` which is the first screen in my routes, which renders a custom splash screen.
 
6. ##Post-Splash Screen Logic
    * After the splash screen ends, ShortCode.js checks for user data.
    * If user data is available, the app determines the appropriate route and handles navigation:
    * ####Authenticated Users: If userData is available in async storage then user will navigate to the Mainstack.
    * ####Unauthenticated Users: If userData is not  available in async storage then user will navigate to the Authstack.
 
7. ##Routing and Navigation
    * Routes Component: The main navigation is managed in the Routes component.
    * Uses NavigationContainer to wrap the navigator.
    * Uses createNativeStackNavigator to create a stack navigator.
    * Redux State: Retrieves userData, appSessionInfo, appStyle, themeColors, appData, and dineInType from the Redux store.
 
8. ##Screen Navigation Logic

      ###Initial Screens:
      * If appSessionInfo is `shortcode` or `show_shortcode`, navigate to ShortCode screen.
      * If appSessionInfo is `app_intro`, navigate to AppIntro screen.
      ###Authenticated or Guest Login:
      * If appSessionInfo is `guest_login` or userData has an `auth_token`, determine the main navigation stack based on appStyle and dineInType.
      ###Business Type Routing:
      * If `businessType is 10`, use DrawerRoutes.
      * Otherwise, use different tab routes (TabRoutes, TaxiTabRoutes, TabRoutesP2pOnDemand, TabRoutesEcommerce) based on businessType and dineInType.
 
9. ##Additional Screens and Navigation:

      1. `CourierStack`: Adds screens related to the courier feature.
      2. `TaxiAppStack`: Adds screens related to the taxi feature.
      3. `Chat Screens`: ChatScreen, ChatScreenForVendor, ChatRoom, ChatRoomForVendor, P2pChatScreen, P2pChatRoom.
      4. ` Product and Wishlist Screens`: ProductList, ProductDetail, Wishlist, P2pOndemandProductDetail, P2pOndemandProducts, P2pWishlist, P2pPayment.
      5. ` Other Screen`s:DeveloperMode, SearchProductVendorItem, ViewAllSearchItems.

10. ##Dynamic Screen Rendering:

   * Product List Layout: Determines the product list layout based on appStyle and dineInType.
   * Product Detail Layout: Determines the product detail layout based on dineInType and appStyle.
   * Search Product Vendor Item Layout: Determines the layout for searching product vendor items based on appStyle. 

11. ##Creating Bottom Tab Navigator:
   * The TabRoutes component uses createBottomTabNavigator from the @react-navigation/bottom-tabs package to create a bottom tab navigation.
   * This navigation component allows users to switch between different screens using a tab bar located at the bottom of the screen.
   * Tab screens are defined conditionally based on the `dineInType` and `appStyle?.tabBarLayout` configuration

12. ##Home Page
 
      ###Render Headers
      * The `renderHeaders` function dynamically renders different header components based on the [`homePageLayout`](#SpecificTerms) specified in the app style.
      ```
      const renderHeaders = useCallback(() => {
      switch (appStyle?.homePageLayout) {
         case 1:<DashBoardHeaderOne/>;
            break;
         case 2:<DashBoardHeaderOne/>;
            break;
         case 3:<DashBoardHeaderSix/>;
            break;
         case 6:<DashBoardHeaderFive/>;
             break;
         case 7:<DashBoardHeaderFive/>;
             break;
         case 11:<DashBoardHeaderFive/>;
            break;
         case 4:<DashBoardHeaderOne/>;
            break;
         case 8:<DashBoardHeaderSeven/>;
            break;
         case 10:<DashBoardHeaderFive/>;
            break;
         default:<DashBoardHeaderFive/>;
      }
      ```
      ### Render Home Screen
      * The `renderHomeScreen` function dynamically renders different home components based on the `homePageLayout` and `dineInType` specified in the redux state.
      ```
      const renderHomeScreen = () => {
         return (
            <>
            {renderHeaders()}
            {dineInType == 'pick_drop' && appStyle?.homePageLayout !== 6 ? (
               <TaxiHomeDashbord/>
            ) : (
               <DashBoardFiveV2Api/>
            )}
            </>
         );
      };
      ```

# SpecificTerms
 - ### `homePageLayout`: we can manage this homePageLayout from the admin pannel. In the app styling we have multiple app style layout so we can switch to any layout and this will reflect in our application as we get this key in our `/header` api.
 - ### `dineInType`: In our master app we have around 8 flow like delivery, taxi and so on, so when we switch to some other flow the dineInType will change accordingly.

#Troubleshooting
If you encounter issues during setup or development, here are some common solutions:

* Clean the project:
```
npm run clean
```
* Reinstall dependencies:
```
npm i --legacy-peer-deps
```
* Reset Metro Bundler cache:
```
npm run start --reset-cache
```

# Contributing

We welcome contributions to the RoyoOrders project. Please follow these steps to contribute:

1. Create a new branch ```(git checkout -b feature/your-feature-name).```
2. Make your changes.
3. Commit your changes ```(git commit -m 'Add some feature').```
4. Push to the branch ```(git push origin feature/your-feature-name).```
5. Open a Pull Request.

#License
This Project is owned by Codebrew Labs.
© Copyright 2024 Code Brew Labs | All Rights Reserved |  

#Contact
For more information, please contact:

###Code Brew Labs
Email: business@code-brew.com

Website: https://www.code-brew.com/
